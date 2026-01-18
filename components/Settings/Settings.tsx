
import React from 'react';
import { UserProfile } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const translations = {
  ar: {
    title: "الإعدادات",
    hub: "AliTech Control Hub",
    tier: "عضويتك الحالية",
    free: "عضوية مجانية",
    premium: "عضوية ملكية 👑",
    darkMode: "الوضع الداكن",
    format12: "نظام 12 ساعة",
    langLabel: "لغة التطبيق",
    logout: "تسجيل الخروج",
  },
  en: {
    title: "Settings",
    hub: "AliTech Control Hub",
    tier: "Subscription Tier",
    free: "Free Member",
    premium: "Royal Member 👑",
    darkMode: "Dark Mode",
    format12: "12-Hour Format",
    langLabel: "App Language",
    logout: "Logout",
  }
};

const Settings: React.FC<Props> = ({ user, onUpdate, onLogout }) => {
  const navigate = useNavigate();
  const isEn = user.language === 'en';
  const t = isEn ? translations.en : translations.ar;

  return (
    <div className="p-6 space-y-8 bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-full pb-32 font-['Cairo']">
      <div className="text-center">
        <h2 className="text-2xl font-black text-[#1E3A34] dark:text-white">{t.title}</h2>
        <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">{t.hub}</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('/subscription')}
          className="w-full luxury-gradient p-5 rounded-3xl text-white text-right relative overflow-hidden group shadow-lg"
        >
          <div className="relative z-10 flex items-center justify-between">
             <div className={isEn ? 'text-left' : 'text-right'}>
                <h4 className="font-black text-sm">{t.tier}</h4>
                <p className="text-[10px] opacity-70">{user.subscriptionTier === 'free' ? t.free : t.premium}</p>
             </div>
             <span className="text-xl">💎</span>
          </div>
        </button>

        <ToggleItem label={t.darkMode} active={user.isDarkMode} onToggle={() => onUpdate({...user, isDarkMode: !user.isDarkMode})} />
        <ToggleItem label={t.format12} active={user.use12HourFormat} onToggle={() => onUpdate({...user, use12HourFormat: !user.use12HourFormat})} />
        
        {/* اختيار اللغة */}
        <div className="p-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-white/5 flex items-center justify-between">
           <span className="text-xs font-black">{t.langLabel}</span>
           <div className="flex bg-stone-50 dark:bg-black p-1 rounded-xl border border-stone-100 dark:border-white/10">
              <button 
                onClick={() => onUpdate({...user, language: 'ar'})} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${!isEn ? 'bg-[#1E3A34] text-white shadow-md' : 'text-stone-400'}`}
              >العربية</button>
              <button 
                onClick={() => onUpdate({...user, language: 'en'})} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${isEn ? 'bg-[#1E3A34] text-white shadow-md' : 'text-stone-400'}`}
              >English</button>
           </div>
        </div>
      </div>

      <div className="pt-6 space-y-4 text-center">
         <button onClick={onLogout} className="text-red-500 font-bold text-xs uppercase tracking-widest">{t.logout}</button>
         <button onDoubleClick={() => navigate('/maker')} className="w-full opacity-5 text-stone-400 text-[7px] font-black uppercase tracking-[0.5em]">AliTech System v3.0</button>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, active, onToggle }: any) => (
  <button onClick={onToggle} className="w-full flex items-center justify-between p-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-white/5 shadow-sm active:scale-95 transition-all">
    <span className="text-xs font-black">{label}</span>
    <div className={`w-10 h-5 rounded-full p-0.5 transition-all ${active ? 'bg-[#50A9B4]' : 'bg-stone-200 dark:bg-stone-800'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-all ${active ? (document.documentElement.dir === 'rtl' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`}></div>
    </div>
  </button>
);

export default Settings;
