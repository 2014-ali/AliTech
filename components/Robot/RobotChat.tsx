
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message } from '../../types';
import { getRobotResponse } from '../../services/geminiService';
import RobotVoice from './RobotVoice';

const RobotChat: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `أهلاً بك يا ${user.name}! معك رفيقك "علي"، أنا هنا لأصحبك في رحلتك الإيمانية بكل حكمة. اسألني عن أي شيء، وسأشرح لك بالرسم إن لزم الأمر.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getRobotResponse(input, user, messages);
    
    // استخراج الرسم البياني إن وجد
    const drawingMatch = responseText.match(/<drawing>([\s\S]*?)<\/drawing>/);
    const cleanText = responseText.replace(/<drawing>[\s\S]*?<\/drawing>/, '').trim();

    setMessages(prev => [...prev, { 
      role: 'model', 
      text: cleanText || "إليك هذا الرسم التوضيحي:", 
      drawing: drawingMatch ? drawingMatch[1] : undefined 
    }]);
    setIsLoading(false);
  };

  if (showVoice) {
    return <RobotVoice user={user} onClose={() => setShowVoice(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF8F4] font-['Cairo']">
      <div className="p-6 luxury-gradient text-white flex items-center justify-between shadow-2xl rounded-b-[3rem] relative z-30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-inner border border-white/10 backdrop-blur-xl">🤖</div>
          <div>
            <h2 className="font-black text-lg tracking-tight">{user.robotName || 'علي'}</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
               <p className="text-[10px] text-emerald-200 font-bold uppercase">ذكي ومتفاعل</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowVoice(true)}
          className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl hover:bg-white/20 transition-all active:scale-90"
        >🎙️</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm shadow-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#134E4A] text-white rounded-tr-none' 
                : 'bg-white text-stone-800 rounded-tl-none border border-stone-50 font-medium'
            }`}>
              {m.text}
            </div>
            {m.drawing && (
              <div className="mt-4 w-full max-w-[85%] bg-white p-4 rounded-[2rem] shadow-md border-2 border-[#C5A059]/20 animate-in zoom-in duration-500 overflow-hidden" dangerouslySetInnerHTML={{ __html: m.drawing }} />
            )}
          </div>
        ))}
        {isLoading && <div className="flex justify-end"><div className="bg-white p-4 rounded-[2rem] flex gap-2"><div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce delay-100"></div></div></div>}
      </div>

      <div className="p-6 bg-white border-t border-stone-100 flex gap-4 items-center rounded-t-[3.5rem] shadow-xl relative z-30">
        <div className="flex-1 bg-stone-50 rounded-[2rem] flex items-center border-2 border-stone-50 group focus-within:border-[#134E4A]/20 transition-all">
          <input 
            type="text" placeholder="اسأل علي..." 
            className="flex-1 bg-transparent px-5 py-4 outline-none text-sm font-bold"
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-[#134E4A] text-white w-14 h-14 rounded-full flex items-center justify-center"><span className="rotate-180">➤</span></button>
        </div>
      </div>
    </div>
  );
};

export default RobotChat;
