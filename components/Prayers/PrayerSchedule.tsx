
import React from 'react';
import { UserProfile, PrayerOffsets } from '../../types';
import { useNavigate } from 'react-router-dom';

const PrayerSchedule: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();

  const baseTimes = {
    fajr: "05:12",
    dhuhr: "11:58",
    asr: "14:40",
    maghrib: "16:55",
    isha: "18:22"
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date("2026-01-16");
    d.setDate(d.getDate() + i);
    return d;
  });

  const getAdjustedTime = (base: string, offset: number) => {
    const [h, m] = base.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + offset, 0);
    const resH = date.getHours().toString().padStart(2, '0');
    const resM = date.getMinutes().toString().padStart(2, '0');
    
    if (!user.use12HourFormat) return `${resH}:${resM}`;
    
    let hour12 = parseInt(resH) % 12;
    if (hour12 === 0) hour12 = 12;
    const period = parseInt(resH) >= 12 ? 'م' : 'ص';
    return `${hour12}:${resM} ${period}`;
  };

  return (
    <div className="p-8 space-y-10 bg-[#FAF8F4] min-h-full pb-32 font-['Cairo']">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-stone-400">←</button>
        <h2 className="text-2xl font-black text-teal-950 tracking-tight">جدول الأسبوع</h2>
      </div>

      <div className="space-y-6">
        {days.map((day, idx) => {
          const dayName = day.toLocaleDateString('ar-LB', { weekday: 'long', day: 'numeric', month: 'short' });
          const isToday = idx === 0;

          return (
            <div key={idx} className={`bg-white p-6 rounded-[3rem] shadow-sm border ${isToday ? 'border-teal-900/20 ring-4 ring-teal-50' : 'border-stone-50'}`}>
              <h3 className={`text-sm font-black mb-4 px-2 ${isToday ? 'text-teal-900' : 'text-stone-400'}`}>
                {isToday ? 'اليوم - ' : ''}{dayName}
              </h3>
              <div className="grid grid-cols-5 gap-1">
                {Object.entries(baseTimes).map(([key, time]) => (
                  <div key={key} className="text-center p-2 rounded-2xl bg-stone-50">
                    <p className="text-[8px] font-black text-stone-300 uppercase mb-1">{key === 'fajr' ? 'فجر' : key === 'dhuhr' ? 'ظهر' : key === 'asr' ? 'عصر' : key === 'maghrib' ? 'مغرب' : 'عشاء'}</p>
                    <p className="text-[10px] font-black text-teal-950 tabular-nums">
                      {getAdjustedTime(time, user.prayerOffsets[key as keyof PrayerOffsets])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-stone-900 rounded-[3rem] text-center text-white space-y-2">
         <p className="text-xs font-black gold-text">ملاحظة</p>
         <p className="text-[10px] opacity-70 leading-relaxed px-4">
            يتم حساب المواقيت بناءً على موقعك الجغرافي المسجل. يمكنك تعديل الدقائق يدوياً من الإعدادات الرئيسية.
         </p>
      </div>
    </div>
  );
};

export default PrayerSchedule;
