
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useNavigate } from 'react-router-dom';

const HelpCenter: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const isEn = user.language === 'en';
  const [activeTab, setActiveTab] = useState(0);

  const faqs = [
    {
      q: isEn ? "How to change prayer times?" : "كيف أعدل مواقيت الصلاة؟",
      a: isEn ? "Go to Prayer Schedule and click on the prayer you want to adjust manually." : "اذهب لصفحة المواقيت واضغط على اسم الصلاة التي تريد تعديلها يدوياً."
    },
    {
      q: isEn ? "Where is the smart robot?" : "أين أجد الروبوت الذكي؟",
      a: isEn ? "The robot Ali is available on the main dashboard. You can chat with him using text or voice." : "الروبوت علي موجود في الواجهة الرئيسية، يمكنك التحدث معه نصياً أو صوتياً."
    },
    {
      q: isEn ? "What is the Premium membership?" : "ما هي العضوية الملكية؟",
      a: isEn ? "It gives you voice AI access and hides all ads in the app." : "تمنحك وصولاً كاملاً للذكاء الاصطناعي الصوتي وتزيل الإعلانات."
    },
    {
      q: isEn ? "How to sync with family?" : "كيف أربط التطبيق مع عائلتي؟",
      a: isEn ? "Coming soon in the AliTech next update! Stay tuned." : "هذه الميزة ستتوفر في تحديث AliTech القادم عبر رمز QR."
    }
  ];

  return (
    <div className="h-full bg-[#FAF8F4] dark:bg-[#0A0A0A] font-['Cairo'] flex flex-col">
      <div className="p-8 luxury-gradient text-white rounded-b-[4rem] text-center shadow-xl shrink-0">
         <button onClick={() => navigate(-1)} className="absolute top-10 right-8 text-2xl">←</button>
         <h2 className="text-2xl font-black pt-4">{isEn ? 'Help Center' : 'مركز المساعدة'}</h2>
         <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mt-1">AliTech Questions Hub</p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto scroll-hide pb-32">
         {faqs.map((faq, idx) => (
           <div 
             key={idx} 
             onClick={() => setActiveTab(activeTab === idx ? -1 : idx)}
             className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-white/5 shadow-sm cursor-pointer transition-all"
           >
             <div className="flex justify-between items-center gap-4">
                <h4 className="font-black text-sm text-[#1E3A34] dark:text-white leading-relaxed">{faq.q}</h4>
                <span className={`text-[#D4AF37] transition-transform ${activeTab === idx ? 'rotate-180' : ''}`}>▼</span>
             </div>
             {activeTab === idx && (
                <div className="mt-4 pt-4 border-t border-stone-50 dark:border-white/5 animate-in slide-in-from-top-2">
                   <p className="text-xs text-stone-500 dark:text-stone-400 font-bold leading-relaxed">{faq.a}</p>
                </div>
             )}
           </div>
         ))}

         <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[3rem] text-center border-2 border-dashed border-amber-200 dark:border-amber-900/30">
            <p className="text-xs font-black text-amber-900 dark:text-amber-200">{isEn ? "Need more help?" : "تحتاج مساعدة إضافية؟"}</p>
            <p className="text-[10px] text-stone-400 mt-2">{isEn ? "Contact us via Settings > Complaints" : "تواصل معنا عبر الإعدادات > الشكاوى"}</p>
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;
