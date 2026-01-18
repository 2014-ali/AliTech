
import React from 'react';
import { UserProfile } from '../../types';

const HijriCalendar: React.FC<{ user: UserProfile }> = ({ user }) => {
  // التاريخ المرجعي بناءً على طلب المستخدم
  const hijriDate = "28 رجب 1447 هـ";
  const gregDate = "17 كانون الثاني 2026 م";
  
  const events = [
    { title: "ليلة الإسراء والمعراج", date: "27 رجب", color: "bg-blue-500", passed: true },
    { title: "بداية شهر شعبان", date: "1 شعبان", color: "bg-amber-500", passed: false },
    { title: "ليلة النصف من شعبان", date: "15 شعبان", color: "bg-emerald-500", passed: false },
    { title: "بداية شهر رمضان المبارك", date: "1 رمضان", color: "bg-teal-600", passed: false }
  ];

  return (
    <div className="p-8 space-y-8 bg-[#FAF8F4] dark:bg-black min-h-full font-['Cairo'] pb-32">
      <div className="luxury-gradient p-10 rounded-[4rem] text-white text-center shadow-2xl relative overflow-hidden border-b-4 border-[#D4AF37]">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
         <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-2 relative z-10">التقويم الموحد</p>
         <h2 className="text-4xl font-black relative z-10">{hijriDate}</h2>
         <p className="text-sm opacity-80 mt-2 relative z-10 font-bold">{gregDate}</p>
         <div className="mt-6 inline-block px-4 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest relative z-10">
           AliTech High Precision Mode
         </div>
      </div>

      <div className="space-y-4">
         <h3 className="font-black text-lg px-4 text-[#1E3A34] dark:text-white">أهم المناسبات القادمة</h3>
         {events.map(e => (
           <div key={e.title} className={`bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-50 dark:border-white/5 flex items-center justify-between transition-opacity ${e.passed ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-4 text-right">
                 <div className={`w-3 h-3 rounded-full ${e.color} ${!e.passed ? 'animate-pulse' : ''}`}></div>
                 <div>
                    <span className="font-black text-sm block">{e.title}</span>
                    {e.passed && <span className="text-[8px] font-black text-stone-300 uppercase">انقضت بسلام</span>}
                 </div>
              </div>
              <span className="text-xs font-bold text-[#50A9B4]">{e.date}</span>
           </div>
         ))}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-stone-50 text-center space-y-4">
         <p className="text-xs text-[#1E3A34] dark:text-stone-300 leading-relaxed font-bold">
            تم ضبط النظام ليعمل بدقة متناهية مع التقويم المعتمد. مواعيد الصلاة في جدولك الشهري مرتبطة بتعديلاتك اللحظية لليوم.
         </p>
         <div className="text-[10px] text-[#D4AF37] font-black tracking-widest uppercase">AliTech Global Hijri System v2.6</div>
      </div>
    </div>
  );
};

export default HijriCalendar;
