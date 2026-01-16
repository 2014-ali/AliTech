
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, Ad, PrayerOffsets, SheikhConfig } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: UserProfile;
  ads: Ad[];
  onUpdateUser: (user: UserProfile) => void;
}

const Dashboard: React.FC<Props> = ({ user, ads, onUpdateUser }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const baseTimes = { fajr: "05:12", dhuhr: "11:58", asr: "14:40", maghrib: "16:55", isha: "18:22" };

  const getAdjustedDate = (base: string, offset: number, daysOffset = 0) => {
    const [h, m] = base.split(':').map(Number);
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(h, m + offset, 0, 0);
    return date;
  };

  const getAdjustedTimeDisplay = (base: string, offset: number) => {
    const date = getAdjustedDate(base, offset);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: user.use12HourFormat });
  };

  const prayerItems = [
    { key: 'fajr', name: "الفجر", base: baseTimes.fajr, icon: "🌅" },
    { key: 'dhuhr', name: "الظهر", base: baseTimes.dhuhr, icon: "☀️" },
    { key: 'asr', name: "العصر", base: baseTimes.asr, icon: "🌤️" },
    { key: 'maghrib', name: "المغرب", base: baseTimes.maghrib, icon: "🌇" },
    { key: 'isha', name: "العشاء", base: baseTimes.isha, icon: "🌙" },
  ];

  const nextPrayerData = useMemo(() => {
    const now = currentTime;
    const schedule = prayerItems.map(p => ({
      ...p,
      time: getAdjustedDate(p.base, user.prayerOffsets[p.key as keyof PrayerOffsets])
    }));
    let next = schedule.find(p => p.time > now);
    if (!next) {
      const fajrTomorrow = getAdjustedDate(baseTimes.fajr, user.prayerOffsets.fajr, 1);
      next = { ...schedule[0], time: fajrTomorrow };
    }
    const diff = next.time.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return { name: next.name, countdown: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` };
  }, [currentTime, user.prayerOffsets]);

  return (
    <div className={`h-full flex flex-col overflow-hidden font-['Cairo'] transition-colors duration-500 ${user.isChildMode ? 'bg-sky-50' : 'bg-[#FAF8F4]'}`}>
      {/* Header Section */}
      <div className={`${user.isChildMode ? 'bg-sky-500' : 'luxury-gradient'} text-white pt-12 pb-8 px-6 rounded-b-[3.5rem] shadow-2xl flex flex-col items-center shrink-0 relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full flex justify-between items-center mb-6 relative z-10">
           <div className="text-right">
              <p className={`text-[10px] font-black tracking-widest uppercase ${user.isChildMode ? 'text-sky-100' : 'gold-text'}`}>
                {new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date())} هـ
              </p>
              <h1 className="text-2xl font-black drop-shadow-sm">{user.isChildMode ? 'أهلاً يا بطل،' : 'مرحباً،'} {user.name}</h1>
           </div>
           <button onClick={() => navigate('/settings')} className={`w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-md transition-all active:scale-90 ${user.isChildMode ? 'bg-white/20 border-white/30' : 'bg-white/10 border-white/10'}`}>
              <span className="text-xl">⚙️</span>
           </button>
        </div>

        {/* AI Friend Action */}
        <div onClick={() => navigate('/robot')} className="relative group cursor-pointer active:scale-95 transition-all mb-2">
           <div className={`w-36 h-36 rounded-[3rem] shadow-2xl flex items-center justify-center border-4 transition-all ${user.isChildMode ? 'bg-white border-sky-200' : 'bg-white border-amber-400/30'}`}>
              <span className="text-8xl group-hover:scale-110 transition-transform duration-500">{user.isChildMode ? '🦁' : '🤖'}</span>
           </div>
           <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-black shadow-xl border-2 border-white whitespace-nowrap animate-bounce-slow ${user.isChildMode ? 'bg-sky-600 text-white' : 'bg-amber-400 text-teal-950'}`}>
              {user.isChildMode ? 'العب مع صديقك' : `اسأل ${user.robotName || 'علي'}`}
           </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        
        <div className="grid grid-cols-2 gap-4 shrink-0">
           <button onClick={() => navigate('/quran')} className={`h-28 rounded-[2.5rem] text-white flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${user.isChildMode ? 'bg-orange-400' : 'bg-teal-950'}`}>
              <span className="text-4xl">📖</span>
              <span className="text-xs font-black">القرآن الكريم</span>
           </button>
           <button onClick={() => navigate('/athkar')} className={`h-28 rounded-[2.5rem] text-white flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${user.isChildMode ? 'bg-purple-400' : 'bg-stone-900'}`}>
              <span className="text-4xl">📿</span>
              <span className="text-xs font-black">الأذكار</span>
           </button>
        </div>

        {/* Prayer Card */}
        <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-stone-100 flex flex-col overflow-hidden relative">
           <div className={`p-5 border-b flex justify-between items-center ${user.isChildMode ? 'bg-sky-50 border-sky-100' : 'bg-stone-50/50 border-stone-50'}`}>
              <h3 className={`font-black text-sm ${user.isChildMode ? 'text-sky-900' : 'text-teal-950'}`}>مواقيت الصلاة</h3>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm ${user.isChildMode ? 'bg-sky-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  {nextPrayerData.name} بعد {nextPrayerData.countdown}
                </span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto scroll-hide p-5 space-y-3">
              {prayerItems.map(p => {
                const adjustedTime = getAdjustedDate(p.base, user.prayerOffsets[p.key as keyof PrayerOffsets]);
                const isPassed = currentTime > adjustedTime;
                
                return (
                  <div key={p.key} className={`flex items-center justify-between p-4 rounded-3xl transition-all border-2 ${isPassed ? 'opacity-30 grayscale scale-95' : `bg-white ${user.isChildMode ? 'border-sky-50 hover:border-sky-200' : 'border-stone-50 hover:border-amber-100 shadow-sm'}`}`}>
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">{p.icon}</span>
                        <span className={`text-sm font-black ${user.isChildMode ? 'text-sky-900' : 'text-stone-700'}`}>{p.name}</span>
                    </div>
                    <div className="text-left">
                        <span className={`text-md font-black tabular-nums ${user.isChildMode ? 'text-sky-600' : 'text-teal-950'}`}>
                          {getAdjustedTimeDisplay(p.base, user.prayerOffsets[p.key as keyof PrayerOffsets])}
                        </span>
                        <p className="text-[8px] text-stone-400 font-bold uppercase tracking-tighter">{user.sheikhs[p.key as keyof SheikhConfig]}</p>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Tools Footer */}
        <div className="flex gap-4 h-20 shrink-0 overflow-x-auto scroll-hide pb-2">
           <ToolIcon icon="🧭" label="القبلة" isChild={user.isChildMode} />
           <ToolIcon icon="📅" label="صيام" onClick={() => navigate('/fasting')} isChild={user.isChildMode} />
           <ToolIcon icon="👪" label="عائلة" onClick={() => navigate('/family')} isChild={user.isChildMode} />
           <ToolIcon icon="📺" label="تلفاز" isChild={user.isChildMode} />
           <ToolIcon icon="💰" label="دعم" onClick={() => navigate('/settings')} isChild={user.isChildMode} />
        </div>
      </div>
    </div>
  );
};

const ToolIcon: React.FC<{icon: string, label: string, onClick?: () => void, isChild: boolean}> = ({icon, label, onClick, isChild}) => (
  <button onClick={onClick} className={`flex-none w-24 rounded-[2rem] flex flex-col items-center justify-center gap-1 active:scale-90 transition-all shadow-lg border-2 ${isChild ? 'bg-white border-sky-100 text-sky-600' : 'bg-white border-stone-50 text-teal-950'}`}>
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Dashboard;
