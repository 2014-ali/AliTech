
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, CommunityMessage } from '../../types';
import { useNavigate } from 'react-router-dom';

const CommunityChat: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<CommunityMessage[]>([
    { id: '1', userId: 'admin', userName: 'المشرف علي طه', role: 'admin', text: 'أهلاً بكم في مجتمع صديقك المسلم! كيف يمكننا مساعدتكم اليوم؟', timestamp: '10:00 AM' },
    { id: '2', userId: 'robot', userName: 'الروبوت علي', role: 'robot', text: 'أنا هنا أيضاً للإجابة على أسئلتكم الفقهية والتقنية.', timestamp: '10:05 AM' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: CommunityMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      avatar: user.avatar
    };
    setMessages([...messages, newMsg]);
    setInput('');

    // محاكاة رد سريع من الروبوت
    if (input.includes('صلاة') || input.includes('فجر')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          userId: 'robot',
          userName: 'الروبوت علي',
          role: 'robot',
          text: 'تذكروا أن صلاة الفجر هي نور يومكم. هل أعددتم منبه الفجر القوي؟',
          timestamp: 'الآن'
        }]);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F5F0] font-['Cairo']">
      <div className="p-6 bg-[#1E3A34] text-white flex items-center justify-between rounded-b-[3.5rem] shadow-2xl relative shrink-0">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <div className="text-center">
           <h2 className="text-lg font-black">المجتمع الإسلامي</h2>
           <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest">Global Connection Hub</p>
        </div>
        <div className="w-8"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-10 scroll-hide">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.userId === user.id ? 'items-start' : 'items-end'}`}>
            <div className="flex items-center gap-2 mb-1">
               <span className={`text-[10px] font-black ${m.role === 'admin' ? 'text-red-500' : m.role === 'robot' ? 'text-[#D4AF37]' : 'text-stone-400'}`}>
                 {m.userName} {m.role === 'admin' ? '👑' : m.role === 'robot' ? '🤖' : ''}
               </span>
            </div>
            <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm shadow-sm ${
              m.userId === user.id ? 'bg-[#50A9B4] text-white rounded-tr-none' : 'bg-white text-stone-800 rounded-tl-none border border-stone-100'
            }`}>
              {m.text}
              <p className="text-[8px] opacity-40 mt-1 text-left">{m.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-stone-100 flex gap-2 items-center rounded-t-[3rem] shadow-inner shrink-0">
        <input 
          placeholder="اكتب رسالتك للمجتمع..." 
          className="flex-1 bg-stone-50 p-4 rounded-2xl outline-none text-sm font-bold border-2 border-transparent focus:border-[#50A9B4] transition-all"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-[#1E3A34] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">➤</button>
      </div>
    </div>
  );
};

export default CommunityChat;
