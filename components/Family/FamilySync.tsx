
import React, { useState } from 'react';
import { UserProfile } from '../../types';

const FamilySync: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [tab, setTab] = useState<'family' | 'tv'>('family');
  const [isSyncing, setIsSyncing] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'هاتف الوالدة', status: 'متصل الآن', icon: '📱' },
    { id: 2, name: 'هاتف الوالد', status: 'في العمل', icon: '📱' }
  ]);

  const simulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newMember = { id: Date.now(), name: 'جهاز طفل متصل', status: 'تم الربط بنجاح', icon: '👶' };
      setFamilyMembers(prev => [...prev, newMember]);
      alert("تمت المزامنة بنجاح مع الهاتف الجديد عبر نظام AliTech للربط العائلي!");
    }, 2500);
  };

  return (
    <div className={`p-8 space-y-10 min-h-full font-['Cairo'] pb-32 transition-colors duration-500 ${user.isChildMode ? 'bg-sky-50' : 'bg-[#FAF8F4]'}`}>
      <div className="text-center space-y-2">
        <h2 className={`text-3xl font-black tracking-tight ${user.isChildMode ? 'text-sky-900' : 'text-teal-950'}`}>نظام الربط العائلي</h2>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em]">AliTech Universal Sync</p>
      </div>

      <div className={`flex p-2 rounded-[2.5rem] shadow-sm border-2 ${user.isChildMode ? 'bg-white border-sky-100' : 'bg-white border-stone-50'}`}>
        <button onClick={() => setTab('family')} className={`flex-1 py-4 rounded-[1.8rem] text-sm font-black transition-all ${tab === 'family' ? (user.isChildMode ? 'bg-sky-500 text-white' : 'bg-teal-950 text-white') : 'text-stone-300'}`}>وضع العائلة 👪</button>
        <button onClick={() => setTab('tv')} className={`flex-1 py-4 rounded-[1.8rem] text-sm font-black transition-all ${tab === 'tv' ? (user.isChildMode ? 'bg-sky-500 text-white' : 'bg-teal-950 text-white') : 'text-stone-300'}`}>شاشة التلفاز 📺</button>
      </div>

      {tab === 'family' ? (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="text-center">
             <div className="bg-white p-8 rounded-[4rem] border-4 border-amber-100 shadow-2xl inline-block relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=YMF-FAMILY-${user.id}`} className="w-56 h-56 group-hover:scale-105 transition-transform" alt="sync-qr" />
                <p className="mt-6 font-black text-teal-950 text-xs uppercase tracking-widest">امسح لربط الهاتف بالعائلة</p>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-teal-950 text-md px-2">الأجهزة المتصلة ({familyMembers.length})</h3>
            <div className="space-y-3">
              {familyMembers.map(m => (
                <div key={m.id} className="bg-white p-5 rounded-[2.5rem] border-2 border-stone-50 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{m.icon}</div>
                    <div>
                      <p className="text-sm font-black text-stone-800">{m.name}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">{m.status}</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse ring-4 ring-green-100"></div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={simulateSync}
              disabled={isSyncing}
              className={`w-full text-white p-7 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/20 ${user.isChildMode ? 'bg-sky-500' : 'luxury-gradient'}`}
            >
              {isSyncing ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : (
                <><span>📷</span><span>مسح هاتف جديد (Scan)</span></>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-black aspect-video rounded-[3rem] overflow-hidden relative group shadow-2xl border-4 border-white">
             <img src="https://images.unsplash.com/photo-1593359674240-a5a2fa174493?q=80&w=1000&auto=format" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[5000ms]" />
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center bg-black/40">
                <h4 className="font-black text-2xl text-amber-400 drop-shadow-lg">TV Art Experience</h4>
                <p className="text-xs font-bold mt-2 leading-relaxed">حوّل شاشة التلفاز إلى لوحة فنية إسلامية تعرض القرآن والأذكار بدقة 4K</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button className={`w-full bg-white p-7 rounded-[2.5rem] border-2 shadow-xl font-black flex items-center justify-center gap-4 active:scale-95 transition-all ${user.isChildMode ? 'border-sky-100 text-sky-900' : 'border-stone-50 text-teal-950'}`}>
              <span className="text-2xl">🔌</span>
              <span>توصيل التلفاز عبر كود QR</span>
            </button>
            <div className={`p-6 rounded-[2.5rem] border-2 border-dashed text-center ${user.isChildMode ? 'bg-sky-100 border-sky-200' : 'bg-amber-50 border-amber-100 shadow-inner'}`}>
               <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">ميزة قيد الإطلاق 🚀</p>
               <p className="text-[11px] font-bold mt-1 text-stone-600">انتظر نسخة "TV-YMF" قريباً من AliTech</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilySync;
