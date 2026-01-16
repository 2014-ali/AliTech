
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onAdd: (text: string) => void;
}

const ComplaintsPage: React.FC<Props> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setSent(true);
    setTimeout(() => navigate('/settings'), 2500);
  };

  return (
    <div className="p-10 space-y-12 text-right bg-[#FAF8F4] min-h-full font-['Cairo']">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-teal-950 tracking-tight">الشكاوى والنصائح</h2>
        <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded-full"></div>
        <p className="text-sm text-stone-500 font-bold leading-relaxed px-6">
          نحن نصغي إليك دائماً.. شاركنا اقتراحاتك أو مشاكلك لنرتقي برفيقك المسلم للأفضل.
        </p>
      </div>

      {sent ? (
        <div className="bg-white p-14 rounded-[4rem] text-center space-y-6 shadow-2xl border-4 border-emerald-50 animate-in zoom-in-95 duration-700 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
           <div className="text-7xl drop-shadow-lg">✨</div>
           <p className="text-2xl font-black text-teal-950 tracking-tight">شكراً لمشاركتك!</p>
           <p className="text-sm text-stone-400 font-bold">تم إرسال رسالتك مباشرة لغرفة عمليات AliTech.</p>
           <div className="pt-4">
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.3em]">Redirecting back...</span>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
          <div className="relative group">
            <textarea 
              className="w-full h-64 p-8 bg-white border-4 border-stone-50 rounded-[3.5rem] outline-none focus:border-teal-900/10 focus:ring-8 focus:ring-teal-50/50 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.02)] text-right leading-relaxed font-bold text-teal-950 placeholder:text-stone-200"
              placeholder="اكتب ملاحظاتك هنا بكل شفافية..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute bottom-6 right-8 text-[10px] font-black text-stone-200 uppercase tracking-widest group-focus-within:text-teal-900/20 transition-colors">
               Direct Support Access
            </div>
          </div>
          
          <button 
            disabled={!text.trim()}
            onClick={handleSubmit}
            className="w-full luxury-gradient text-white p-8 rounded-[3.5rem] font-black shadow-[0_25px_50px_rgba(0,0,0,0.15)] disabled:opacity-30 active:scale-95 transition-all duration-300 border-2 border-[#d4af37]/20 text-lg"
          >
            إرسال للمشرف علي طه
          </button>
          
          <p className="text-center text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em]">
            AliTech Quality Assurance • v2.0
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
