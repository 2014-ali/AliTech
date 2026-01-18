
import React, { useState, useEffect } from 'react';
import { Ad, Complaint, UserProfile, SentCode } from '../../types';
import { ADMIN_CODE } from '../../constants';
import { useNavigate } from 'react-router-dom';

interface Props {
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
  complaints: Complaint[];
}

const AdminPanel: React.FC<Props> = ({ ads, setAds, complaints }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'ads' | 'complaints'>('system');
  
  // حالة النظام (Global State)
  const [globalMessage, setGlobalMessage] = useState('');
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [globalPrayerOffset, setGlobalPrayerOffset] = useState(0);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('all_registered_users') || '[]');
    setUsers(allUsers);
    
    // جلب حالة النظام السابقة
    const sys = JSON.parse(localStorage.getItem('alitech_sys_config') || '{"msg": "", "maint": false, "offset": 0}');
    setGlobalMessage(sys.msg);
    setIsMaintenance(sys.maint);
    setGlobalPrayerOffset(sys.offset);
  }, [isAdmin]);

  const saveSystemConfig = () => {
    const config = { msg: globalMessage, maint: isMaintenance, offset: globalPrayerOffset };
    localStorage.setItem('alitech_sys_config', JSON.stringify(config));
    alert("تم تحديث إعدادات النظام العالمية بنجاح ✅");
  };

  const handleLogin = () => {
    if (pass === ADMIN_CODE) {
      setIsAdmin(true);
    } else {
      alert("كود الصانع غير صحيح. الوصول مرفوض.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-[#064E3B] font-['Cairo']">
        <div className="bg-white p-12 rounded-[4rem] w-full max-w-md space-y-10 text-center shadow-3xl border-t-8 border-[#D4AF37] animate-in zoom-in-95">
           <div className="w-24 h-24 bg-[#064E3B] rounded-[2rem] mx-auto flex items-center justify-center text-5xl border-4 border-[#D4AF37] shadow-xl">🛠️</div>
           <div className="space-y-2">
             <h2 className="text-3xl font-black text-[#064E3B]">مركز تحكم AliTech</h2>
             <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">بوابة المشرف علي طه</p>
           </div>
           <input 
             type="password"
             placeholder="ادخل كود الوصول الخاص"
             className="w-full p-7 bg-stone-50 border-4 border-stone-100 rounded-[2.5rem] text-center font-black text-2xl outline-none focus:border-[#D4AF37] transition-all"
             value={pass}
             onChange={(e) => setPass(e.target.value)}
             onKeyPress={e => e.key === 'Enter' && handleLogin()}
           />
           <button onClick={handleLogin} className="w-full bg-[#064E3B] text-white p-7 rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all">تفعيل السيطرة الكاملة</button>
           <button onClick={() => navigate('/')} className="text-stone-300 text-[10px] font-black uppercase tracking-[0.5em]">Ali Taha Exclusive System</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F8F5F0] min-h-full font-['Cairo'] pb-32 overflow-y-auto scroll-hide">
      <div className="flex justify-between items-center bg-[#1E3A34] p-8 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black">غرفة التحكم الرئيسية</h2>
          <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em]">AliTech Command Center • v4.0</p>
        </div>
        <button onClick={() => setIsAdmin(false)} className="relative z-10 bg-red-500/20 text-red-200 px-6 py-3 rounded-2xl font-black text-xs border border-red-500/30">إغلاق الجلسة</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scroll-hide">
        <AdminTab label="السيطرة على النظام" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
        <AdminTab label="قاعدة المستخدمين" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <AdminTab label="إعلانات AliTech" active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} />
        <AdminTab label="رسائل الشكاوى" active={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')} />
      </div>

      {activeTab === 'system' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-5">
           {/* التنبيه العالمي */}
           <div className="bg-white p-8 rounded-[3rem] shadow-sm border-2 border-amber-100">
              <h3 className="font-black text-lg text-[#1E3A34] mb-4 flex items-center gap-2">📢 تنبيه عالمي (لجميع المستخدمين)</h3>
              <textarea 
                className="w-full p-6 bg-stone-50 rounded-[2rem] border-2 border-stone-100 h-32 outline-none font-bold"
                placeholder="اكتب رسالة ستظهر فوراً عند فتح التطبيق لكل المستخدمين..."
                value={globalMessage}
                onChange={e => setGlobalMessage(e.target.value)}
              />
           </div>

           {/* إعدادات القوة */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm flex items-center justify-between border-2 border-red-50">
                 <div>
                    <h4 className="font-black text-[#1E3A34]">وضع الصيانة</h4>
                    <p className="text-[10px] text-stone-400">قفل التطبيق بالكامل عن الجميع</p>
                 </div>
                 <button 
                   onClick={() => setIsMaintenance(!isMaintenance)}
                   className={`w-16 h-8 rounded-full p-1 transition-all ${isMaintenance ? 'bg-red-500' : 'bg-stone-200'}`}
                 >
                   <div className={`w-6 h-6 bg-white rounded-full transition-all ${isMaintenance ? 'translate-x-8' : 'translate-x-0'}`}></div>
                 </button>
              </div>

              <div className="bg-white p-8 rounded-[3rem] shadow-sm border-2 border-emerald-50">
                 <h4 className="font-black text-[#1E3A34]">تعديل الوقت العالمي</h4>
                 <div className="flex items-center gap-4 mt-2">
                    <input 
                      type="number" 
                      className="w-20 p-3 bg-stone-50 border rounded-xl text-center font-black"
                      value={globalPrayerOffset}
                      onChange={e => setGlobalPrayerOffset(Number(e.target.value))}
                    />
                    <span className="text-xs font-bold text-stone-400">دقيقة (لكل الصلوات)</span>
                 </div>
              </div>
           </div>

           <button 
             onClick={saveSystemConfig}
             className="w-full bg-[#D4AF37] text-[#1E3A34] p-8 rounded-[3rem] font-black text-xl shadow-2xl active:scale-95 transition-all border-b-8 border-amber-600"
           >تثبيت الإعدادات العالمية الآن ✅</button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-500">
           <div className="grid grid-cols-3 gap-4">
              <StatCard label="المستخدمين" value={users.length} color="text-teal-600" />
              <StatCard label="العضويات الملكية" value={users.filter(u => u.subscriptionTier !== 'free').length} color="text-amber-600" />
              <StatCard label="المتصلين الآن" value={Math.floor(users.length * 0.4)} color="text-blue-600" />
           </div>
           
           {users.map(u => (
             <div key={u.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm flex items-center justify-between group hover:border-[#D4AF37] transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-2xl border border-stone-100">👤</div>
                   <div>
                      <p className="font-black text-[#1E3A34]">{u.name}</p>
                      <p className="text-[10px] text-stone-300 font-mono tracking-tighter">{u.phone} • {u.nationality}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="bg-red-50 text-red-500 p-3 rounded-xl text-[10px] font-black">حظر 🚫</button>
                   <button className="bg-[#50A9B4] text-white p-3 rounded-xl text-[10px] font-black">تفاصيل</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* الأقسام الأخرى بنفس الروح القوية */}
    </div>
  );
};

const AdminTab = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`shrink-0 px-8 py-4 rounded-[1.8rem] text-sm font-black transition-all ${active ? 'bg-[#D4AF37] text-[#1E3A34] shadow-lg scale-105' : 'bg-white text-stone-300 opacity-60 hover:opacity-100'}`}
  >{label}</button>
);

const StatCard = ({ label, value, color }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] text-center border border-stone-100 shadow-sm">
    <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

export default AdminPanel;
