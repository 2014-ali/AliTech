
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types';

const QUESTION_BANK = [
  { q: "ما هي عاصمة فلسطين الأبدية؟", a: "القدس" },
  { q: "كم عدد ركعات سنة الفجر؟", a: "2" },
  { q: "ما هو اسم أطول سورة في القرآن الكريم؟", a: "البقرة" },
  { q: "حاصل ضرب 7 في 8 هو؟", a: "56" },
  { q: "من هو النبي الذي لُقب بـ 'كليم الله'؟", a: "موسى" },
  { q: "ما هو الركن الثاني من أركان الإسلام؟", a: "الصلاة" },
  { q: "كم عدد أجزاء القرآن الكريم؟", a: "30" },
  { q: "ما هو لون القبة الخضراء في المسجد النبوي؟", a: "أخضر" },
  { q: "حاصل جمع 125 + 75 هو؟", a: "200" },
  { q: "ما هي عاصمة لبنان؟", a: "بيروت" }
];

interface Props {
  user: UserProfile;
  onDismiss: () => void;
}

const FajrAlarm: React.FC<Props> = ({ user, onDismiss }) => {
  const [stage, setStage] = useState<'azan' | 'nag' | 'quiz'>('azan');
  const [currentQuestions, setCurrentQuestions] = useState<typeof QUESTION_BANK>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // اختيار 5 أسئلة عشوائية عند بدء المنبه
  useEffect(() => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
  }, []);

  const FAJR_AZAN_URLS: any = {
    'مشاري العفاسي': "https://www.islamcan.com/audio/adhan/azan1.mp3",
    'عبد الباسط عبد الصمد': "https://www.islamcan.com/audio/adhan/azan11.mp3",
    'المنشاوي': "https://www.islamcan.com/audio/adhan/azan16.mp3",
    'سعود الشريم': "https://www.islamcan.com/audio/adhan/azan3.mp3",
    'عبد الرحمن السديس': "https://www.islamcan.com/audio/adhan/azan2.mp3"
  };

  useEffect(() => {
    if (audioRef.current && stage === 'azan') {
      const sheikh = user.prayerConfigs.fajr.sheikh;
      audioRef.current.src = FAJR_AZAN_URLS[sheikh] || FAJR_AZAN_URLS['مشاري العفاسي'];
      audioRef.current.play().catch(() => {});
    }
  }, [stage, user.prayerConfigs.fajr.sheikh]);

  const submitAnswer = () => {
    if (userAnswer.trim() === currentQuestions[currentIdx].a) {
      if (currentIdx < 4) {
        setCurrentIdx(prev => prev + 1);
        setUserAnswer('');
        setErrorCount(0);
      } else {
        onDismiss();
        alert("أحسنت! أنت الآن مستيقظ تماماً. تقبل الله صلاتك.");
      }
    } else {
      setErrorCount(prev => prev + 1);
      setUserAnswer('');
      if (errorCount >= 1) {
        alert("إجابة خاطئة! ركز جيداً، المنبه لن ينطفئ حتى تجيب بشكل صحيح.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#1E3A34] flex flex-col items-center justify-center p-8 text-center font-['Cairo'] text-white">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] pointer-events-none"></div>
      
      {stage === 'azan' && (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="text-9xl drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]">🕌</div>
          <h2 className="text-4xl font-black text-[#D4AF37]">صلاة الفجر خير من النوم</h2>
          <p className="text-xl opacity-80">جاري رفع الأذان بصوت الشيخ {user.prayerConfigs.fajr.sheikh}</p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setStage('quiz')}
              className="bg-[#D4AF37] text-[#1E3A34] px-12 py-5 rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all"
            >استيقظت.. ابدأ الاختبار ✅</button>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">AliTech Forced Wake-up System</p>
          </div>
          <audio ref={audioRef} onEnded={() => setStage('quiz')} />
        </div>
      )}

      {stage === 'quiz' && (
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-10 relative z-10">
          <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[4rem] border-2 border-white/10 shadow-3xl">
            <div className="flex justify-between items-center mb-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">اختبار اليقظة</p>
                <h3 className="text-2xl font-black">السؤال {currentIdx + 1} / 5</h3>
              </div>
              <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-2xl text-[#1E3A34]">🧠</div>
            </div>

            <p className="text-2xl font-bold mb-10 leading-relaxed text-[#FDFBF7]">{currentQuestions[currentIdx]?.q}</p>
            
            <input 
              type="text" 
              className="w-full p-6 bg-white rounded-[2rem] text-[#1E3A34] text-center font-black text-xl outline-none shadow-inner border-4 border-transparent focus:border-[#D4AF37] transition-all"
              placeholder="اكتب الإجابة هنا..."
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && submitAnswer()}
              autoFocus
            />
          </div>

          <button 
            onClick={submitAnswer}
            className="w-full bg-[#D4AF37] text-[#1E3A34] p-7 rounded-[2.5rem] font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >تحقق من الإجابة</button>
          
          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.4em]">AliTech Intelligence Safety Lock</p>
          
          {/* صوت تنبيه مزعج يعمل في الخلفية إذا تأخر المستخدم */}
          <audio autoPlay loop src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" />
        </div>
      )}
    </div>
  );
};

export default FajrAlarm;
