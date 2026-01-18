
import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC<{ user: UserProfile, onUpdate: (user: UserProfile) => void }> = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const save = () => {
    onUpdate({ ...user, name });
    alert("تم تحديث بياناتك الشخصية بنجاح ✅");
    navigate('/');
  };

  return (
    <div className="h-full bg-white font-['Cairo'] flex flex-col">
      <div className="p-8 bg-[#50A9B4] text-white rounded-b-[4rem] text-center relative shrink-0 shadow-xl">
         <button onClick={() => navigate(-1)} className="absolute top-10 right-8 text-2xl w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">←</button>
         <h2 className="text-2xl font-black pt-4">الملف الشخصي</h2>
      </div>

      <div className="flex-1 p-8 space-y-10 overflow-y-auto scroll-hide">
         <div className="flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
               <div className="w-36 h-36 bg-stone-50 rounded-[3.5rem] border-4 border-[#D4AF37] shadow-2xl overflow-hidden flex items-center justify-center text-5xl">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="profile" />
                  ) : (
                    <span className="opacity-20 text-stone-400">👤</span>
                  )}
               </div>
               <button 
                 className="absolute -bottom-2 -right-2 bg-[#1E3A34] text-white w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center active:scale-90 transition-all"
               >📸</button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileChange} 
               />
            </div>
            <div className="text-center">
               <h3 className="text-xl font-black text-[#1E3A34]">{user.name || 'مستخدم جديد'}</h3>
               <p className="text-xs text-stone-400 font-bold tracking-widest">{user.phone}</p>
            </div>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[11px] font-black text-stone-300 uppercase mr-4">تعديل الاسم</label>
               <input 
                 className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-stone-100 font-bold focus:border-[#50A9B4] outline-none shadow-sm transition-all"
                 value={name} onChange={e => setName(e.target.value)}
                 placeholder="اسمك الكريم"
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center shadow-inner">
                  <p className="text-[10px] font-black text-stone-300 uppercase mb-1">بلد الإقامة</p>
                  <p className="font-black text-[#1E3A34] text-sm">{user.nationality || 'غير محدد'}</p>
               </div>
               <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center shadow-inner">
                  <p className="text-[10px] font-black text-stone-300 uppercase mb-1">المدينة</p>
                  <p className="font-black text-[#1E3A34] text-sm">{user.location.city || 'غير محدد'}</p>
               </div>
            </div>
         </div>

         <div className="pt-4">
            <button onClick={save} className="w-full bg-[#1E3A34] text-white p-6 rounded-[2.5rem] font-black shadow-xl active:scale-95 transition-all border-b-4 border-[#D4AF37]">حفظ التعديلات ✅</button>
         </div>
         
         <p className="text-center text-[8px] text-stone-300 font-black uppercase tracking-[0.4em]">AliTech Profile System Hub</p>
      </div>
    </div>
  );
};

export default ProfilePage;
