
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ADMIN_PHONE, ADMIN_CODE } from '../../constants';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const Settings: React.FC<Props> = ({ user, onUpdate, onLogout }) => {
  const [code, setCode] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isEditingRobot, setIsEditingRobot] = useState(false);
  const [tempRobotName, setTempRobotName] = useState(user.robotName || (user.isChildMode ? 'ليث' : 'علي'));
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const handleApplyCode = () => {
    if (code === ADMIN_CODE) {
      alert("تم تفعيل ميزات المشرف بنجاح! أنت الآن عضو ملكي VIP");
      onUpdate({ ...user, subscriptionTier: 5 });
    } else {
      alert("الكود غير صحيح. تواصل مع المشرف للحصول على كود صالح.");
    }
  };

  const getCleanURL = () => {
    // محاولة الحصول على الرابط الفعلي للاستضافة
    return window.location.origin + window.location.pathname;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getCleanURL());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`يا صديقي، هذا هو رابط تطبيقي "صديقك المسلم" الفخم، افتحه الآن: ${getCleanURL()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className={`p-6 space-y-8 min-h-full pb-32 font-['Cairo'] transition-all duration-500 ${user.isChildMode ? 'bg-sky-50' : 'bg-white'}`}>
      <div className="text-center pt-4">
        <h2 className={`text-2xl font-black ${user.isChildMode ? 'text-sky-900' : 'text-teal-900'}`}>الإعدادات</h2>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">AliTech Professional Suite</p>
      </div>

      {/* User Card */}
      <div className={`${user.isChildMode ? 'bg-sky-500' : 'luxury-gradient'} text-white p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center text-5xl mb-4 border-2 border-white/20 backdrop-blur-xl shadow-inner">
            {user.isChildMode ? '🦁' : '👤'}
          </div>
          <h3 className="text-2xl font-black">{user.name}</h3>
          <div className="flex items-center gap-2 mt-2">
             <span className="bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase">{user.subscriptionTier >= 5 ? 'عضوية ملكية VIP' : 'عضوية أساسية'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeader title="الوصول للهاتف الذكي" />
        <button 
          onClick={() => setShowDownloadModal(true)}
          className={`w-full flex items-center gap-4 p-6 rounded-[3rem] border-2 shadow-xl active:scale-95 transition-all ${user.isChildMode ? 'bg-white border-sky-200 text-sky-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">📱</div>
          <div className="flex-1 text-right">
             <p className="text-md font-black">فتح على هاتفي</p>
             <p className="text-[10px] opacity-70">انسخ الرابط ليعمل كـ App حقيقي</p>
          </div>
          <span className="text-xl">←</span>
        </button>

        <SectionHeader title="التحكم والخصوصية" />
        <div className="space-y-3">
          <ToggleItem 
            label="نظام الوقت (12/24)" 
            active={user.use12HourFormat} 
            onToggle={() => onUpdate({...user, use12HourFormat: !user.use12HourFormat})} 
          />
          <ToggleItem 
            label="وضع الطفل (تغيير شامل)" 
            active={user.isChildMode} 
            onToggle={() => onUpdate({...user, isChildMode: !user.isChildMode})} 
          />
        </div>

        <SectionHeader title="الروبوت الذكي" />
        <div className="bg-white p-6 rounded-[3rem] border-2 border-stone-100 shadow-sm flex flex-col gap-4">
           {isEditingRobot ? (
             <div className="flex gap-2 p-2 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
               <input 
                 type="text" 
                 className="flex-1 bg-transparent px-4 py-2 outline-none font-black text-teal-950 text-sm"
                 value={tempRobotName}
                 onChange={(e) => setTempRobotName(e.target.value)}
                 autoFocus
               />
               <button onClick={() => { onUpdate({...user, robotName: tempRobotName}); setIsEditingRobot(false); }} className="bg-teal-900 text-white px-6 rounded-xl text-xs font-black">حفظ</button>
             </div>
           ) : (
             <div className="flex items-center justify-between">
                <div className="text-right">
                   <p className="text-xs text-stone-400 font-bold">اسم صديقك المفضل</p>
                   <p className="text-lg font-black text-teal-950">{user.robotName || (user.isChildMode ? 'ليث' : 'علي')}</p>
                </div>
                <button onClick={() => setIsEditingRobot(true)} className="text-xs font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">تعديل الاسم</button>
             </div>
           )}
        </div>

        <SectionHeader title="الدعم والمالية" />
        <div className="space-y-3">
          <button 
            onClick={() => setShowPayment(true)}
            className="w-full flex items-center gap-4 p-6 bg-white rounded-[3rem] border-2 border-emerald-100 shadow-sm text-right active:scale-95 transition-all"
          >
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">💵</div>
             <div className="flex-1">
                <p className="text-sm font-black text-emerald-950">Whish Money / دفع إلكتروني</p>
                <p className="text-[10px] text-emerald-600 font-bold">افتح جميع الميزات للأبد</p>
             </div>
          </button>
          
          <SettingButton label="مركز الشكاوى" icon="📝" onClick={() => navigate('/complaints')} />
          
          <a href={`https://wa.me/${ADMIN_PHONE}`} target="_blank" className="flex items-center gap-4 p-6 bg-emerald-950 text-white rounded-[3rem] shadow-xl active:scale-95 transition-all">
             <span className="text-2xl">👤</span>
             <div className="flex-1 text-right">
                <p className="text-xs opacity-60">تواصل مباشر</p>
                <p className="text-sm font-black tracking-tight">المشرف علي طه (AliTech)</p>
             </div>
             <span className="bg-white/20 p-2 rounded-full">💬</span>
          </a>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[4rem] p-10 space-y-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-50 rounded-full blur-3xl"></div>
              
              <div className="space-y-2 relative z-10">
                 <h3 className="text-2xl font-black text-emerald-950">بوابة الدفع الفخمة</h3>
                 <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Support AliTech Innovation</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div className="p-6 bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 space-y-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Whish_Money_Logo.png" className="h-10 mx-auto grayscale brightness-0" alt="whish" />
                    <p className="text-sm font-black text-emerald-900">أرسل المبلغ إلى رقم: <span className="underline decoration-4 decoration-emerald-200">79071048</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold">باسم: علي طه</p>
                 </div>
                 
                 <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-black text-stone-300 uppercase">لديك كود تفعيل؟</p>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder="YMF-XXXX-XXXX"
                         className="flex-1 p-5 bg-stone-50 border-2 border-stone-100 rounded-2xl text-center font-black uppercase text-xs outline-none focus:border-emerald-500"
                         value={code} onChange={e => setCode(e.target.value)}
                       />
                       <button onClick={handleApplyCode} className="bg-emerald-950 text-white px-8 rounded-2xl font-black text-xs shadow-lg">تفعيل</button>
                    </div>
                 </div>
              </div>

              <button onClick={() => setShowPayment(false)} className="w-full py-4 text-stone-300 text-[10px] font-black uppercase tracking-widest">إغلاق البوابة</button>
           </div>
        </div>
      )}

      {/* Share/Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[300] bg-teal-950/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="bg-white rounded-[4rem] w-full max-w-sm p-10 space-y-8 shadow-2xl text-center">
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-teal-950">هذا هو رابطك الخاص</h3>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">لا مزيد من أخطاء 404</p>
             </div>

             <div className="bg-stone-50 p-6 rounded-[3rem] border-4 border-stone-100 inline-block shadow-inner">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getCleanURL())}`} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto mix-blend-multiply"
                />
             </div>
             
             <div className="space-y-4">
                <button 
                  onClick={handleWhatsAppShare}
                  className="w-full py-6 bg-[#25D366] text-white rounded-[2.5rem] font-black text-md flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
                >
                  <span className="text-2xl">💬</span>
                  أرسل لنفسك عبر واتساب
                </button>
                
                <button 
                  onClick={handleCopyLink}
                  className={`w-full py-6 rounded-[2.5rem] font-black text-md flex items-center justify-center gap-4 shadow-lg transition-all ${copySuccess ? 'bg-teal-900 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  {copySuccess ? '✓ تم نسخ الرابط' : '📋 نسخ الرابط يدوياً'}
                </button>

                <div className="p-5 bg-amber-50 rounded-[2rem] border border-amber-100">
                   <p className="text-[9px] text-amber-700 font-bold leading-relaxed">
                     بمجرد فتح الرابط من هاتفك، اضغط على **"إضافة إلى الشاشة الرئيسية"** ليعمل التطبيق بكامل فخامته وبدون متصفح.
                   </p>
                </div>
             </div>

             <button onClick={() => setShowDownloadModal(false)} className="text-stone-300 text-[10px] font-black uppercase tracking-widest pt-4">تراجع</button>
          </div>
        </div>
      )}

      <div className="pt-12 text-center">
        <button onClick={onLogout} className="text-red-500 font-black text-xs uppercase tracking-widest border-b-2 border-red-100 pb-1">تسجيل الخروج الآمن</button>
        <p className="text-[9px] text-stone-300 font-black uppercase tracking-[0.5em] mt-8">Design & Dev by Ali Taha © 2026</p>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] px-4 pt-6 text-right">{title}</h4>
);

const ToggleItem: React.FC<{ label: string; active: boolean; onToggle: () => void }> = ({ label, active, onToggle }) => (
  <button 
    onClick={onToggle}
    className="w-full flex items-center justify-between p-7 bg-white rounded-[2.5rem] border-2 border-stone-50 transition-all shadow-sm active:scale-98"
  >
    <div className={`w-14 h-7 rounded-full p-1.5 transition-all duration-500 ${active ? 'bg-emerald-600' : 'bg-stone-300'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500 ${active ? 'translate-x-7' : 'translate-x-0'}`}></div>
    </div>
    <span className="text-sm font-black text-stone-700">{label}</span>
  </button>
);

const SettingButton: React.FC<{ label: string; icon: string; onClick: () => void }> = ({ label, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-5 p-7 bg-white rounded-[2.5rem] border-2 border-stone-50 shadow-sm transition-all active:scale-98 text-right">
    <span className="text-stone-300 text-xl">←</span>
    <span className="text-sm font-black text-stone-700 flex-1">{label}</span>
    <span className="text-3xl">{icon}</span>
  </button>
);

export default Settings;
