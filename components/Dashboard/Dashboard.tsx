
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, Ad, PrayerOffsets, UserAgeGroup } from '../../types';
import { useNavigate } from 'react-router-dom';
import { COLORS, APP_NAME, AppLogo } from '../../constants';
import FajrAlarm from '../Prayers/FajrAlarm';
import HomeworkReminder from '../School/HomeworkReminder';

interface Props {
  user: UserProfile;
  ads: Ad[];
  onUpdateUser: (user: UserProfile) => void;
}

const translations = {
  ar: {
    next: "الصلاة القادمة",
    remaining: "متبقي",
    robot: "الروبوت الذكي",
    robotSub: "رفيقك علي بالذكاء الاصطناعي",
    quran: "القرآن",
    calendar: "الرزنامة",
    athkar: "الأذكار",
    premium: "الملكية",
    help: "الأسئلة",
  },
  en: {
    next: "Next Prayer",
    remaining: "Left",
    robot: "Smart Robot",
    robotSub: "Your companion Ali AI",
    quran: "Quran",
    calendar: "Calendar",
    athkar: "Athkar",
    premium: "Premium",
    help: "FAQs",
  }
};

const Dashboard: React.FC<Props> = ({ user, ads, onUpdateUser }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFajrAlarm, setShowFajrAlarm] = useState(false);
  const [globalAlert, setGlobalAlert] = useState<string | null>(null);
  const navigate = useNavigate();
  const isEn = user.language === 'en';
  const t = isEn ? translations.en : translations.ar;

  useEffect(() => {
    // التحقق من وجود تنبيه عالمي من المشرف
    const sys = JSON.parse(localStorage.getItem('alitech_sys_config') || '{"msg": "", "maint": false}');
    if (sys.msg) setGlobalAlert(sys.msg);
    if (sys.maint) {
      // إذا كان وضع الصيانة مفعل، نقوم بتنبيه المستخدم (محاكاة)
      alert("⚠️ التطبيق حالياً في وضع الصيانة بأمر من المشرف علي طه.");
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // منطق تشغيل منبه الفجر تلقائياً (محاكاة: يفتح إذا كانت الصلاة القادمة فجر ومتبقي أقل من دقيقة)
      // للتبسيط، أضفنا زر تجريبي للمنبه في مكان آخر أو نعتمد على الوقت الفعلي.
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const baseTimes = { fajr: "05:12", dhuhr: "11:58", asr: "14:40", maghrib: "16:55", isha: "18:22" };
  const prayerNames: any = isEn 
    ? { fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" }
    : { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" };

  const nextPrayerData = useMemo(() => {
    const getAdjustedDate = (base: string, offset: number, daysOffset = 0) => {
      const [h, m] = base.split(':').map(Number);
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      date.setHours(h, m + offset, 0, 0);
      return date;
    };

    const schedule = Object.entries(baseTimes).map(([key, base]) => ({
      key,
      name: prayerNames[key],
      time: getAdjustedDate(base, user.prayerOffsets[key as keyof PrayerOffsets])
    }));
    
    let next = schedule.find(p => p.time > currentTime);
    if (!next) next = { ...schedule[0], time: getAdjustedDate(baseTimes.fajr, user.prayerOffsets.fajr, 1) };
    
    const diff = next.time.getTime() - currentTime.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const countdown = isEn ? `${h}h ${m}m` : `${h}س ${m}د`;

    // إذا حان وقت الفجر، نشغل المنبه الخارق
    if (next.key === 'fajr' && diff < 5000 && diff > 0 && !showFajrAlarm) {
        setShowFajrAlarm(true);
    }

    return { name: next.name, countdown };
  }, [currentTime, user.prayerOffsets, isEn, showFajrAlarm]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FDFBF7] dark:bg-[#0A0A0A] font-['Cairo'] relative">
      {showFajrAlarm && <FajrAlarm user={user} onDismiss={() => setShowFajrAlarm(false)} />}
      
      {/* Global Alert Bar from Admin */}
      {globalAlert && (
        <div className="bg-[#D4AF37] text-[#1E3A34] py-2 px-6 text-center text-[10px] font-black uppercase tracking-widest relative z-[100] animate-in slide-in-from-top duration-500">
           ⚠️ {globalAlert}
           <button onClick={() => setGlobalAlert(null)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">✕</button>
        </div>
      )}

      {/* Slim & Luxury Header */}
      <div className="bg-[#1E3A34] text-white pt-10 pb-5 px-6 md:px-12 rounded-b-[3.5rem] shadow-2xl relative shrink-0 border-b-[4px] border-[#D4AF37]">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
        
        <div className="flex justify-between items-center relative z-10">
           <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-white/10 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden active:scale-90 transition-all">
             {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-xl">👤</span>}
           </button>
           
           <div className="flex flex-col items-center animate-in fade-in zoom-in-90" onDoubleClick={() => setShowFajrAlarm(true)}>
              <AppLogo size="w-16 h-16" />
           </div>

           <button onClick={() => navigate('/settings')} className="w-10 h-10 bg-white/10 rounded-2xl border border-white/5 flex items-center justify-center active:scale-90 transition-all text-xl">⚙️</button>
        </div>

        <div onClick={() => navigate('/prayer-schedule')} className="relative z-10 flex flex-col items-center mt-3 cursor-pointer group">
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest opacity-80">{t.next}</span>
              <span className="text-sm font-black text-white">{nextPrayerData.name}</span>
              <div className="h-3 w-[1px] bg-white/20 mx-1"></div>
              <span className="text-[11px] font-black tabular-nums text-[#50A9B4]">{nextPrayerData.countdown}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 p-5 md:p-10 space-y-6 overflow-y-auto scroll-hide pb-28">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon="📖" label={t.quran} onClick={() => navigate('/quran')} color="text-[#50A9B4]" />
            <QuickAction icon="📅" label={t.calendar} onClick={() => navigate('/calendar')} color="text-[#D4AF37]" />
            <QuickAction icon="📿" label={t.athkar} onClick={() => navigate('/athkar')} color="text-emerald-700" />
            <QuickAction icon="❓" label={t.help} onClick={() => navigate('/help')} color="text-stone-400" />
         </div>

         <div onClick={() => navigate('/robot')} className="bg-[#1E3A34] p-6 rounded-[2.5rem] text-white flex items-center gap-4 shadow-xl border-r-8 border-[#50A9B4] cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0 border border-[#D4AF37]">🤖</div>
            <div className="flex-1">
               <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">{t.robot}</p>
               <p className="text-[12px] font-bold opacity-80">{t.robotSub}</p>
            </div>
            <span className={`text-xl opacity-40 ${isEn ? 'rotate-180' : ''}`}>←</span>
         </div>
         
         <div className="bg-stone-50 p-6 rounded-[2.5rem] border border-stone-100 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-300">AliTech Quality Control Center</p>
         </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, label, onClick, color }: any) => (
  <button onClick={onClick} className="bg-white dark:bg-stone-900/50 p-6 rounded-[2.5rem] shadow-sm border border-stone-100 dark:border-white/5 text-center space-y-2 active:scale-95 transition-all hover:border-[#D4AF37]/30">
    <div className="text-3xl">{icon}</div>
    <p className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</p>
  </button>
);

export default Dashboard;
