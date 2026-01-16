
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { UserProfile, UserAgeGroup } from '../../types';
import { ADMIN_PHONE, DEVELOPER } from '../../constants';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const RobotVoice: React.FC<{ user: UserProfile; onClose: () => void }> = ({ user, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [visualData, setVisualData] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsReady(true);
    setStatus('connecting');
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    await audioContextRef.current.resume();
    await outputAudioContextRef.current.resume();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const instruction = `أنت رفيق ذكي وحكيم جداً يدعى "${user.robotName || 'علي'}". 
أنت العقل المفكر لتطبيق 'صديقك المسلم' من تطوير ${DEVELOPER}.

أنت تتحدث صوتياً الآن مع:
- ${user.name}، من ${user.location.city}، عمره ${user.ageGroup}.
- حالته الإيمانية: ${user.isNewToIslam ? 'جديد على الإسلام (كن مقنعاً وعلمياً برفق)' : 'مسلم ممارس'}.
- وضع الطفل: ${user.isChildMode ? 'مفعّل (كن مرحاً جداً واستخدم عبارات تشجيعية للأطفال)' : 'غير مفعّل'}.

أنت تعرف كل شيء في التطبيق:
- يوجد قسم للقرآن الكريم، الأذكار، مواقيت الصلاة، وتقويم الصيام.
- هناك ميزة الربط العائلي والتحكم في التلفاز.
- الدعم الفني والمادي يتم عبر المشرف علي طه (${ADMIN_PHONE}).

عندما تشرح شيئاً معقداً، ارسم شكلاً توضيحياً بـ SVG داخل وسم <drawing>...</drawing>.
تحدث باختصار لأنك في وضع الصوت، وكن دائماً محفزاً وإيجابياً.`;

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setStatus('listening');
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(processor);
          processor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            const drawingMatch = text.match(/<drawing>([\s\S]*?)<\/drawing>/);
            if (drawingMatch) setVisualData(drawingMatch[1]);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputAudioContextRef.current) {
            setStatus('speaking');
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
            const buffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
            const source = outputAudioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputAudioContextRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
            };
          }
        },
        onerror: (e) => { console.error(e); setStatus('idle'); },
        onclose: () => onClose()
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction: instruction
      }
    });
    sessionRef.current = await sessionPromise;
  };

  useEffect(() => {
    return () => {
      sessionRef.current?.close();
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-teal-950 flex flex-col items-center p-6 text-center font-['Cairo'] overflow-hidden">
      <div className="w-full flex justify-between items-center mb-10 shrink-0">
        <span className="text-white/20 text-[10px] font-black tracking-widest uppercase">AliTech Intelligence Engine</span>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">✕</button>
      </div>

      {!isReady ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95">
           <div className="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center text-8xl shadow-2xl border-4 border-[#d4af37]/20">🤖</div>
           <h2 className="text-2xl font-black text-white">تحدث الآن مع {user.robotName || 'علي'}</h2>
           <p className="text-stone-400 text-xs px-10">سيكون "علي" مدركاً تماماً لموقعك وصيامك وصلاتك ليقدم لك أفضل نصيحة.</p>
           <button onClick={startSession} className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">ابدأ المحادثة 🎙️</button>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col items-center gap-8 overflow-hidden">
           <div className={`w-full max-w-sm rounded-[3rem] transition-all duration-700 overflow-hidden ${visualData ? 'flex-1 bg-white p-4 shadow-2xl' : 'h-0 opacity-0'}`}>
              {visualData && <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: visualData }} />}
           </div>

           <div className="flex flex-col items-center shrink-0">
              <div className={`w-36 h-36 rounded-[2.5rem] bg-white flex items-center justify-center shadow-2xl relative transition-all duration-500 ${status === 'speaking' ? 'scale-110' : 'scale-100'}`}>
                 <span className="text-7xl">🤖</span>
                 {status === 'speaking' && <div className="absolute inset-0 rounded-[2.5rem] border-4 border-emerald-400 animate-ping opacity-20"></div>}
              </div>
              <h3 className="text-xl font-black text-white mt-6">{user.robotName || 'علي'}</h3>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
                {status === 'connecting' ? 'جاري الاتصال بالعقل المفكر...' : status === 'listening' ? 'أسمعك يا بطل...' : 'أجيبك الآن...'}
              </p>
           </div>

           <div className="flex gap-2 h-10 items-end shrink-0">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-1.5 rounded-full bg-emerald-400 transition-all duration-300 ${status === 'speaking' ? 'animate-bounce' : 'opacity-20'}`} 
                 style={{ height: status === 'speaking' ? `${20 + Math.random()*20}px` : '10px', animationDelay: `${i*0.1}s` }} />
             ))}
           </div>
        </div>
      )}

      <div className="mt-10 mb-4 opacity-20 text-white text-[8px] font-black uppercase tracking-[0.5em]">Global Context Aware Engine</div>
    </div>
  );
};

export default RobotVoice;
