
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { UserProfile, Ad } from './types';
import { APP_NAME, AppLogo } from './constants';
import Onboarding from './components/Auth/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import RobotChat from './components/Robot/RobotChat';
import QuranReader from './components/Quran/QuranReader';
import FamilySync from './components/Family/FamilySync';
import Settings from './components/Settings/Settings';
import AthkarPage from './components/Athkar/AthkarPage';
import PrayerSchedule from './components/Prayers/PrayerSchedule';
import HijriCalendar from './components/Calendar/HijriCalendar';
import SubscriptionPage from './components/Subscription/SubscriptionPage';
import ProfilePage from './components/Profile/ProfilePage';
import AdminPanel from './components/Admin/AdminPanel';
import HelpCenter from './components/Help/HelpCenter';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // التحقق من حالة النظام العالمية
    const sys = JSON.parse(localStorage.getItem('alitech_sys_config') || '{"msg": "", "maint": false}');
    setIsMaintenance(sys.maint);

    const savedUser = localStorage.getItem('ymf_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const isComplete = parsed.name && parsed.nationality && parsed.location?.city;
      setUser(parsed);
      applyTheme(parsed);
      if (!isComplete && location.pathname !== '/login') {
        navigate('/login');
      }
    }
    setIsLoaded(true);
  }, [location.pathname]);

  const applyTheme = (profile: UserProfile) => {
    if (profile.isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    document.documentElement.dir = profile.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = profile.language;
  };

  const handleUpdateUser = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('ymf_user', JSON.stringify(profile));
    applyTheme(profile);
  };

  // شاشة وضع الصيانة العالمية
  if (isMaintenance && location.pathname !== '/maker') {
    return (
      <div className="h-screen bg-[#1E3A34] flex flex-col items-center justify-center p-12 text-center font-['Cairo']">
         <div className="w-40 h-40 bg-white/10 rounded-[4rem] flex items-center justify-center text-7xl shadow-2xl border-4 border-[#D4AF37] animate-pulse mb-10">🛠️</div>
         <h1 className="text-3xl font-black text-[#D4AF37] mb-4">وضع الصيانة مفعل</h1>
         <p className="text-white opacity-70 leading-relaxed font-bold">
            بأمر من المشرف "علي طه"، التطبيق حالياً تحت التحديث لضمان أفضل جودة. سنعود قريباً جداً.
         </p>
         <div className="mt-20 opacity-20 text-white text-[8px] font-black uppercase tracking-[0.5em]">AliTech Security Shield</div>
      </div>
    );
  }

  if (!isLoaded) return (
    <div className="h-screen bg-[#FDFBF7] flex items-center justify-center font-['Cairo']">
       <div className="flex flex-col items-center gap-6 animate-pulse">
         <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
         <p className="text-[#1E3A34] font-black text-sm uppercase tracking-widest">AliTech System Booting</p>
       </div>
    </div>
  );

  const isAuthPage = location.pathname === '/login';

  return (
    <div className={`w-full max-w-screen-xl mx-auto h-screen relative flex flex-col shadow-2xl overflow-hidden md:border-x ${user?.isDarkMode ? 'bg-[#0A0A0A] text-white' : 'bg-[#fdfbf7] text-[#1E3A34]'}`}>
      <div className="flex-1 overflow-y-auto pb-24 scroll-hide relative">
        <Routes>
          <Route path="/" element={user && user.name && user.nationality && user.location?.city ? <Dashboard user={user} ads={ads} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Onboarding onComplete={(p) => { handleUpdateUser(p); navigate('/'); }} />} />
          <Route path="/robot" element={user ? <RobotChat user={user} /> : <Navigate to="/login" />} />
          <Route path="/quran" element={user ? <QuranReader user={user} /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <HijriCalendar user={user} /> : <Navigate to="/login" />} />
          <Route path="/prayer-schedule" element={user ? <PrayerSchedule user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/subscription" element={user ? <SubscriptionPage user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings user={user} onUpdate={handleUpdateUser} onLogout={() => { setUser(null); localStorage.removeItem('ymf_user'); navigate('/login'); }} /> : <Navigate to="/login" />} />
          <Route path="/help" element={user ? <HelpCenter user={user} /> : <Navigate to="/login" />} />
          <Route path="/athkar" element={user ? <AthkarPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/maker" element={<AdminPanel ads={ads} setAds={setAds} complaints={[]} />} />
        </Routes>
      </div>

      {user && user.name && user.nationality && !isAuthPage && (
        <nav className={`fixed bottom-0 left-0 right-0 max-w-screen-xl mx-auto p-4 pb-6 md:pb-8 backdrop-blur-xl border-t flex justify-around items-end z-50 rounded-t-[3rem] ${user.isDarkMode ? 'bg-black/80 border-white/10' : 'bg-white/95 border-stone-100 shadow-2xl'}`}>
          <NavIcon icon="📖" to="/quran" active={location.pathname === '/quran'} />
          <NavIcon icon="🕋" to="/prayer-schedule" active={location.pathname === '/prayer-schedule'} />
          <button 
            onClick={() => navigate('/')} 
            className={`w-16 h-16 md:w-20 md:h-20 -translate-y-4 rounded-full shadow-2xl transition-all active:scale-90 flex items-center justify-center border-4 border-[#D4AF37] ${location.pathname === '/' ? 'bg-[#50A9B4]' : 'bg-[#1E3A34]'}`}
          >
             <AppLogo size="w-12 h-12" />
          </button>
          <NavIcon icon="📅" to="/calendar" active={location.pathname === '/calendar'} />
          <NavIcon icon="⚙️" to="/settings" active={location.pathname === '/settings'} />
        </nav>
      )}
    </div>
  );
};

const NavIcon = ({ icon, to, active }: any) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className={`p-3 rounded-2xl transition-all ${active ? 'bg-[#50A9B4]/10 scale-110 shadow-inner' : 'opacity-30 hover:opacity-100'}`}>
      <span className="text-2xl">{icon}</span>
    </button>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);
export default App;
