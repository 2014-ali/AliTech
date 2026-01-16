
import React, { useState } from 'react';
import { UserProfile } from '../../types';

const AthkarPage: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [counter, setCounter] = useState(0);

  const sections = [
    { title: "أذكار الصباح", icon: "🌅", count: 18, color: "border-amber-100 bg-amber-50" },
    { title: "أذكار المساء", icon: "🌇", count: 21, color: "border-blue-100 bg-blue-50" },
    { title: "أذكار النوم", icon: "🌙", count: 12, color: "border-purple-100 bg-purple-50" },
  ];

  return (
    <div className="p-8 space-y-10 bg-[#FAF8F4] min-h-full pb-32">
      <div className="luxury-gradient text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 text-center space-y-2">
           <h2 className="text-3xl font-black">المسبحة الذكية</h2>
           <p className="text-[10px] text-emerald-200 font-bold tracking-[0.4em] uppercase">اذكر الله يذكرك</p>
           <div className="text-8xl font-black tabular-nums py-8 gold-text drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">{counter}</div>
        </div>
        <div className="flex justify-center gap-6 relative z-10">
          <button 
            onClick={() => setCounter(0)}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black backdrop-blur-md active:scale-90 transition-all"
          >
            إعادة
          </button>
          <button 
            onClick={() => setCounter(c => c + 1)}
            className="w-28 h-28 rounded-full bg-amber-400 text-teal-950 flex items-center justify-center text-6xl shadow-[0_15px_30px_rgba(212,175,55,0.4)] border-4 border-white active:scale-90 transition-all"
          >
            +
          </button>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="font-black text-teal-950 text-xl px-2">أذكار المسلم</h3>
        {sections.map(s => (
          <div 
            key={s.title} 
            className={`p-6 rounded-[2.5rem] border-2 ${s.color} flex items-center justify-between cursor-pointer hover:shadow-xl transition-all group active:scale-95`}
          >
            <div className="flex items-center gap-5">
              <div className="text-4xl group-hover:scale-110 transition-transform">{s.icon}</div>
              <div className="text-right">
                <p className="text-lg font-black text-stone-800">{s.title}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{s.count} ذكر في انتظارك</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-300">
               <span className="text-xl">←</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AthkarPage;
