
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { AppLogo } from '../../constants';

interface Props {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onClose: () => void;
}

const HomeworkReminder: React.FC<Props> = ({ user, onUpdateUser, onClose }) => {
  const [step, setStep] = useState<'initial' | 'confirm_solve' | 'timer' | 'check_finish'>('initial');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins in seconds

  useEffect(() => {
    let interval: any;
    if (step === 'timer' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (step === 'timer' && timeLeft === 0) {
      setStep('check_finish');
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = () => {
    onUpdateUser({ ...user, homeworkStatus: 'finished' });
    onClose();
  };

  const handleStartTimer = () => {
    setStep('timer');
    setTimeLeft(15 * 60);
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-[#1E3A34]/95 backdrop-blur-md flex items-center justify-center p-8 font-['Cairo']">
      <div className="bg-white w-full max-w-sm rounded-[4rem] p-8 text-center space-y-8 shadow-2xl border-4 border-[#D4AF37] animate-in zoom-in-95 duration-500 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#50A9B4]/10 rounded-bl-[4rem]"></div>
        
        <div className="flex justify-center -mt-20 relative z-10">
           {/* Removed non-existent 'border' prop from AppLogo */}
           <AppLogo size="w-32 h-32" />
        </div>

        {step === 'initial' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black text-[#1E3A34]">أهلاً بعودتك يا بطل! 🎒</h2>
            <p className="text-lg font-bold text-stone-600">هل حللت الواجبات المدرسية؟</p>
            <div className="flex flex-col gap-3">
               <button onClick={handleFinish} className="w-full bg-[#50A9B4] text-white p-5 rounded-3xl font-black shadow-lg active:scale-95 transition-all">نعم، تم بنجاح ✅</button>
               <button onClick={() => setStep('confirm_solve')} className="w-full bg-stone-100 text-stone-500 p-5 rounded-3xl font-black active:scale-95 transition-all">ليس بعد 📚</button>
            </div>
          </div>
        )}

        {step === 'confirm_solve' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-[#D4AF37]">لا بأس.. العلم نور! 📚</h2>
            <p className="text-lg font-bold text-stone-600">هل ستذهب لحلها الآن؟ سأنتظرك هنا.</p>
            <div className="flex flex-col gap-3">
               <button onClick={handleStartTimer} className="w-full bg-[#1E3A34] text-white p-6 rounded-3xl font-black shadow-xl active:scale-95 transition-all">نعم، سأبدأ الآن 🚀</button>
               <button onClick={onClose} className="text-xs text-stone-300 font-bold">سأقوم بذلك لاحقاً</button>
            </div>
          </div>
        )}

        {step === 'timer' && (
          <div className="space-y-8 py-6 animate-in zoom-in-95">
            <h2 className="text-xl font-black text-[#50A9B4]">ركز جيداً.. أنت ذكي! ⏳</h2>
            <div className="text-6xl font-black tabular-nums text-[#1E3A34] drop-shadow-sm">{formatTime(timeLeft)}</div>
            <p className="text-xs text-stone-400 font-bold">سنقوم بسؤالك مجدداً بعد 15 دقيقة لنتأكد من إنجازك.</p>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border">
               <div className="bg-[#50A9B4] h-full transition-all duration-1000" style={{ width: `${(timeLeft / (15*60)) * 100}%` }}></div>
            </div>
            <button onClick={handleFinish} className="text-[10px] font-black text-stone-300 underline">أنهيت مبكراً؟ اضغط هنا</button>
          </div>
        )}

        {step === 'check_finish' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black text-[#1E3A34]">مرت 15 دقيقة..</h2>
            <p className="text-lg font-bold text-stone-600">هل أنهيت الواجبات يا ذكي؟</p>
            <div className="flex flex-col gap-3">
               <button onClick={handleFinish} className="w-full bg-[#50A9B4] text-white p-5 rounded-3xl font-black shadow-lg active:scale-95 transition-all">نعم، انتهيت 🎉</button>
               <button onClick={handleStartTimer} className="w-full bg-stone-100 text-stone-500 p-5 rounded-3xl font-black active:scale-95 transition-all">أحتاج 15 دقيقة أخرى ⏳</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkReminder;
