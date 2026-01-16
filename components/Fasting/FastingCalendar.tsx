
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const FastingCalendar: React.FC<Props> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // Jan 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const toggleDay = (dayStr: string) => {
    let newDays = [...user.fastingDays];
    if (newDays.includes(dayStr)) {
      newDays = newDays.filter(d => d !== dayStr);
    } else {
      newDays.push(dayStr);
    }
    onUpdateUser({ ...user, fastingDays: newDays });
  };

  const isFastingDay = (date: Date) => {
    const dayStr = date.toISOString().split('T')[0];
    if (user.fastingDays.includes(dayStr)) return true;
    
    if (user.recurringFasting === 'mon-thu') {
      const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, 4 is Thursday
      return dayOfWeek === 1 || dayOfWeek === 4;
    }
    return false;
  };

  const monthName = currentMonth.toLocaleString('ar-LB', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8 space-y-8 bg-[#FAF8F4] min-h-full pb-32 font-['Cairo']">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-stone-400">←</button>
        <h2 className="text-2xl font-black text-teal-950 tracking-tight">تقويم الصيام</h2>
      </div>

      <div className="bg-white p-8 rounded-[3.5rem] shadow-xl border border-stone-50 space-y-8">
        <div className="flex justify-between items-center px-4">
           <h3 className="font-black text-emerald-950">{monthName}</h3>
           <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center">←</button>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center">→</button>
           </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(d => (
            <div key={d} className="text-[10px] font-black text-stone-300 uppercase">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const active = isFastingDay(date);
            const isToday = day === 16 && currentMonth.getMonth() === 0; // Jan 16, 2026

            return (
              <button 
                key={day}
                onClick={() => toggleDay(date.toISOString().split('T')[0])}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all ${
                  active 
                    ? 'bg-emerald-900 text-white shadow-lg scale-105' 
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                } ${isToday ? 'ring-2 ring-amber-400' : ''}`}
              >
                <span className="text-sm font-black">{day}</span>
                {active && <span className="text-[6px] font-bold absolute bottom-1.5 uppercase">صائم</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest px-4">خيارات الصيام المتكرر</h4>
        <button 
          onClick={() => onUpdateUser({ ...user, recurringFasting: user.recurringFasting === 'mon-thu' ? 'none' : 'mon-thu' })}
          className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between font-black ${
            user.recurringFasting === 'mon-thu' 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950' 
              : 'bg-white border-stone-100 text-stone-400'
          }`}
        >
          <div className="text-right">
            <p className="text-sm">صيام الاثنين والخميس</p>
            <p className="text-[10px] opacity-60">تحديد تلقائي للأيام أسبوعياً</p>
          </div>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${user.recurringFasting === 'mon-thu' ? 'bg-emerald-900 border-emerald-900 text-white' : 'border-stone-100'}`}>
            {user.recurringFasting === 'mon-thu' && "✓"}
          </div>
        </button>
      </div>

      <div className="bg-amber-50 p-6 rounded-[2.5rem] border-2 border-amber-100 text-center space-y-2">
         <p className="text-xs font-black text-amber-900">💡 نصيحة من "علي"</p>
         <p className="text-[10px] text-amber-800 leading-relaxed font-bold">
            صيام التطوع من أعظم القربات، قال النبي ﷺ: "تُعرض الأعمال يوم الاثنين والخميس، فأحب أن يُعرض عملي وأنا صائم".
         </p>
      </div>
    </div>
  );
};

export default FastingCalendar;
