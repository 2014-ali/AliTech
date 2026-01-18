
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CODE } from '../../constants';

const SubscriptionPage: React.FC<{ user: UserProfile, onUpdate: (user: UserProfile) => void }> = ({ user, onUpdate }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClaim = () => {
    if (!code.trim()) return;

    // الدخول السري للصانع عبر خانة الأكواد كما طلب المستخدم
    if (code === ADMIN_CODE) {
      navigate('/maker');
      return;
    }

    // منطق الأكواد الأخرى
    if (code === 'ALITECH-GOLD') {
      setLoading(true);
      setTimeout(() => {
        onUpdate({ ...user, subscriptionTier: 'gold' });
        alert("تم تفعيل العضوية الذهبية بنجاح! شكراً لك.");
        setLoading(false);
        navigate('/');
      }, 1500);
    } else {
      alert("الكود غير صحيح أو منتهي الصلاحية.");
    }
  };

  return (
    <div className="p-8 space-y-10 bg-[#FAF8F4] dark:bg-black min-h-full font-['Cairo'] pb-32">
      <div className="text-center space-y-2">
         <h2 className="text-3xl font-black text-[#1E3A34] dark:text-white">العضوية الملكية</h2>
         <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">AliTech Exclusive Access</p>
      </div>

      <div className="bg-[#1E3A34] p-10 rounded-[4rem] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
         <h3 className="text-2xl font-black">أنت حالياً: <span className="text-[#D4AF37]">{user.subscriptionTier === 'free' ? 'عضو عادي' : 'عضو ذهبي 👑'}</span></h3>
         <p className="text-xs opacity-70">اشترك الآن لفتح ميزات الذكاء الاصطناعي الصوتي المتطور وإزالة الإعلانات.</p>
      </div>

      <div className="space-y-6">
         <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] shadow-xl space-y-6">
            <h4 className="font-black text-center text-stone-700 dark:text-stone-300">ادخل كود الدفع أو الهدية</h4>
            <input 
              placeholder="ادخل الكود هنا..." 
              className="w-full p-5 bg-stone-50 dark:bg-stone-800 rounded-2xl text-center font-black border-2 border-transparent focus:border-[#D4AF37] outline-none transition-all"
              value={code} onChange={e => setCode(e.target.value)}
            />
            <button 
              onClick={handleClaim}
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#1E3A34] p-6 rounded-[2rem] font-black shadow-xl active:scale-95 transition-all"
            >
              {loading ? "جاري التحقق..." : "تفعيل ✅"}
            </button>
         </div>
      </div>
      
      <p className="text-center text-[10px] text-stone-300 font-bold uppercase tracking-widest px-10 leading-loose">
        جميع الحقوق محفوظة لشركة AliTech • 2025
      </p>
    </div>
  );
};

export default SubscriptionPage;
