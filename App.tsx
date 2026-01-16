
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { UserProfile, Ad, Complaint } from './types';
import { APP_NAME, ICONS } from './constants';
import Onboarding from './components/Auth/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import RobotChat from './components/Robot/RobotChat';
import QuranReader from './components/Quran/QuranReader';
import FamilySync from './components/Family/FamilySync';
import Settings from './components/Settings/Settings';
import AthkarPage from './components/Athkar/AthkarPage';
import AdminPanel from './components/Admin/AdminPanel';
import ComplaintsPage from './components/Settings/ComplaintsPage';
import PrayerSchedule from './components/Prayers/PrayerSchedule';
import FastingCalendar from './components/Fasting/FastingCalendar';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('ymf_user');
    const savedAds = localStorage.getItem('ymf_ads');
    const savedComplaints = localStorage.getItem('ymf_complaints');
    
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('ymf_user');
      }
    }
    
    if (savedAds) setAds(JSON.parse(savedAds));
    if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
    
    setIsLoaded(true);
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('ymf_user', JSON.stringify(profile));
    navigate('/');
  };

  const handleUpdateUser = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('ymf_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ymf_user');
    navigate('/login');
  };

  const addComplaint = (text: string) => {
    if (!user) return;
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      text,
      date: new Date().toISOString()
    };
    const updated = [...complaints, newComplaint];
    setComplaints(updated);
    localStorage.setItem('ymf_complaints', JSON.stringify(updated));
  };

  if (!isLoaded) return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-950 text-white p-8">
      <div className="w-20 h-20 bg-emerald-900 rounded-[2rem] flex items-center justify-center shadow-2xl animate-pulse mb-6 border-2 border-amber-400">
        <span className="text-4xl text-white">🌙</span>
      </div>
      <h1 className="text-xl font-black gold-text">صديقك المسلم</h1>
    </div>
  );

  // ثيم وضع الطفل مقابل ثيم الكبار الفخم
  const appThemeClass = user?.isChildMode 
    ? "bg-sky-50 border-sky-200" 
    : "bg-[#fdfbf7] border-stone-200";

  return (
    <div className={`max-w-md mx-auto h-screen relative flex flex-col shadow-2xl overflow-hidden border-x ${appThemeClass}`}>
      <div className="flex-1 overflow-y-auto pb-24 scroll-hide">
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} ads={ads} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Onboarding onComplete={handleLogin} />} />
          <Route path="/robot" element={user ? <RobotChat user={user} /> : <Navigate to="/login" />} />
          <Route path="/quran" element={user ? <QuranReader user={user} /> : <Navigate to="/login" />} />
          <Route path="/athkar" element={user ? <AthkarPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/family" element={user ? <FamilySync user={user} /> : <Navigate to="/login" />} />
          <Route path="/prayer-schedule" element={user ? <PrayerSchedule user={user} /> : <Navigate to="/login" />} />
          <Route path="/fasting" element={user ? <FastingCalendar user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/complaints" element={user ? <ComplaintsPage onAdd={addComplaint} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={<AdminPanel ads={ads} setAds={setAds} complaints={complaints} />} />
          <Route path="/settings" element={user ? <Settings user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      {user && !window.location.hash.includes('admin') && (
        <nav className={`absolute bottom-0 left-0 right-0 backdrop-blur-xl border-t flex justify-around px-2 py-4 shadow-[0_-8px_40px_rgba(0,0,0,0.06)] z-50 rounded-t-[2.5rem] ${user.isChildMode ? 'bg-white border-sky-100' : 'bg-white/80 border-stone-100'}`}>
          <NavItem icon={<ICONS.Mosque />} label="الرئيسية" to="/" isChild={user.isChildMode} />
          <NavItem icon={<ICONS.Quran />} label="القرآن" to="/quran" isChild={user.isChildMode} />
          <NavItem icon={<ICONS.Robot />} label="الروبوت" to="/robot" isChild={user.isChildMode} />
          <NavItem icon={<ICONS.Family />} label="العائلة" to="/family" isChild={user.isChildMode} />
          <NavItem icon={<ICONS.Settings />} label="الإعدادات" to="/settings" isChild={user.isChildMode} />
        </nav>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; to: string; isChild: boolean }> = ({ icon, label, to, isChild }) => {
  const navigate = useNavigate();
  const isActive = window.location.hash === `#${to}` || (to === '/' && (window.location.hash === '#/' || window.location.hash === ''));
  
  const activeColor = isChild ? 'bg-sky-500 shadow-sky-200' : 'bg-teal-900 shadow-teal-900/20';
  const textColor = isChild ? (isActive ? 'text-sky-600' : 'text-sky-300') : (isActive ? 'text-teal-900' : 'text-stone-300');

  return (
    <button 
      onClick={() => navigate(to)}
      className={`flex flex-col items-center gap-1 transition-all duration-500 group ${isActive ? 'scale-105' : ''} ${textColor}`}
    >
      <div className={`p-2 rounded-[1.2rem] transition-all duration-500 ${isActive ? `${activeColor} text-white shadow-xl` : 'group-hover:bg-stone-50'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>{label}</span>
    </button>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
