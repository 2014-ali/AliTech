
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message } from '../../types';
import { getRobotResponse } from '../../services/geminiService';
import RobotVoice from './RobotVoice';

const RobotChat: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `أهلاً بك يا ${user.name}! معك رفيقك "علي"، أنا هنا لأصحبك في رحلتك الإيمانية والتعليمية بكل حكمة ومودة. كيف يمكنني خدمتك اليوم؟` }
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

    const response = await getRobotResponse(input, user, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  if (showVoice) {
    return <RobotVoice user={user} onClose={() => setShowVoice(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF8F4] font-['Cairo']">
      {/* Premium Header */}
      <div className="p-6 luxury-gradient text-white flex items-center justify-between shadow-2xl rounded-b-[3rem] relative z-30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-inner border border-white/10 backdrop-blur-xl ring-2 ring-[#d4af37]/20">🤖</div>
          <div>
            <h2 className="font-black text-lg tracking-tight">{user.robotName || 'علي'}</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
               <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">متصل</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowVoice(true)}
          className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl hover:bg-white/20 transition-all active:scale-90"
        >
          🎙️
        </button>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm shadow-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-teal-900 text-white rounded-tr-none shadow-teal-900/10' 
                : 'bg-white text-emerald-950 rounded-tl-none border border-emerald-50 shadow-emerald-950/5 font-medium'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white p-4 rounded-[2rem] rounded-tl-none border-2 border-emerald-50 flex gap-2">
              <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-stone-100 flex gap-4 items-center rounded-t-[3.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] relative z-30">
        <div className="flex-1 bg-[#FDFCF9] rounded-[2rem] p-1 flex items-center border-2 border-stone-50 shadow-inner group focus-within:border-teal-900/20 transition-all">
          <input 
            type="text"
            placeholder="اسأل علي..."
            className="flex-1 bg-transparent px-5 py-4 outline-none text-sm font-bold text-teal-950"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-teal-900 text-white w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-30 shadow-xl transition-all hover:scale-105 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotChat;
