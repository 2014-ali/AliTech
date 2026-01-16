
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Surah } from '../../types';

const SHEIKH_AUDIO_MAP: Record<string, string> = {
  'مشاري العفاسي': 'ar.alafasy',
  'عبد الباسط عبد الصمد': 'ar.abdulsamad',
  'محمد صديق المنشاوي': 'ar.minshawi',
  'محمود خليل الحصري': 'ar.husary',
  'ياسر الدوسري': 'ar.dossari',
  'ماهر المعيقلي': 'ar.mahermuaiqly'
};

const SHEIKH_LIST = Object.keys(SHEIKH_AUDIO_MAP);

const QuranReader: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [currentSheikh, setCurrentSheikh] = useState(user.sheikhs.quran || SHEIKH_LIST[0]);
  const [showSheikhPicker, setShowSheikhPicker] = useState(false);
  // Added missing searchTerm and setSearchTerm state
  const [searchTerm, setSearchTerm] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseListRef = useRef<HTMLDivElement>(null);

  const fullSurahList: Surah[] = [
    { id: 1, name: "Al-Fatihah", arabicName: "الفاتحة", verses: 7, type: "مكية" },
    { id: 2, name: "Al-Baqarah", arabicName: "البقرة", verses: 286, type: "مدنية" },
    { id: 18, name: "Al-Kahf", arabicName: "الكهف", verses: 110, type: "مكية" },
    { id: 36, name: "Yaseen", arabicName: "يس", verses: 83, type: "مكية" },
    { id: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", verses: 4, type: "مكية" },
  ];

  const playVerse = (verseNum: number) => {
    if (!selectedSurah) return;
    setActiveVerse(verseNum);
    
    // التمرير التلقائي للآية الحالية لتبقى في المنتصف
    const verseEl = document.getElementById(`verse-${verseNum}`);
    if (verseEl) {
      verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const sheikhId = SHEIKH_AUDIO_MAP[currentSheikh] || 'ar.alafasy';
    const verseId = selectedSurah.id * 1000 + verseNum - 1000;
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${sheikhId}/${verseId}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(e => {
        console.warn("Autoplay blocked, user interaction required.");
        setIsPlaying(false);
      });
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playVerse(activeVerse || 1);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    const handleEnded = () => {
      setActiveVerse(prev => {
        if (selectedSurah && prev && prev < selectedSurah.verses) {
          const next = prev + 1;
          playVerse(next);
          return next;
        }
        setIsPlaying(false);
        return null;
      });
    };
    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, [selectedSurah, currentSheikh]);

  const fatihahVerses = [
    "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "الرَّحْمَٰنِ الرَّحِيمِ", "مَالِكِ يَوْمِ الدِّينِ",
    "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
  ];

  if (selectedSurah) {
    return (
      <div className="h-full flex flex-col bg-[#FAF8F4] font-['Cairo'] overflow-hidden">
        {/* Compact Header */}
        <div className="p-4 luxury-gradient text-white flex justify-between items-center shadow-lg shrink-0">
          <button onClick={() => setSelectedSurah(null)} className="text-sm font-black opacity-80">← رجوع</button>
          <div className="text-center">
             <h2 className="font-black text-md">{selectedSurah.arabicName}</h2>
             <p className="text-[8px] text-teal-200 uppercase tracking-widest">{currentSheikh}</p>
          </div>
          <button onClick={() => setShowSheikhPicker(true)} className="text-lg">👤</button>
        </div>
        
        {/* Reading Area - Fixed Height with internal scroll */}
        <div ref={verseListRef} className="flex-1 overflow-y-auto p-6 space-y-8 text-center scroll-hide">
          <div className="text-2xl font-serif text-teal-900 py-8 border-b-2 border-stone-50">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          {selectedSurah.id === 1 ? fatihahVerses.map((v, i) => (
            <p key={i} id={`verse-${i+1}`} onClick={() => playVerse(i+1)} className={`text-2xl font-serif leading-loose transition-all duration-500 p-4 rounded-3xl cursor-pointer ${activeVerse === i+1 ? 'text-amber-600 bg-amber-50 scale-105 shadow-inner' : 'text-stone-800 opacity-40'}`}>
              {v} <span className="text-[10px] bg-stone-100 px-2 py-1 rounded-full text-stone-400 mr-2">{i+1}</span>
            </p>
          )) : (
            <div className="py-20 text-stone-300">
               <p className="text-lg font-black tracking-tight">النص الكامل جارٍ التحميل...</p>
               <div className="mt-10 text-6xl gold-text font-black animate-bounce">{activeVerse || "؟"}</div>
            </div>
          )}
        </div>

        {/* Floating Controls Area - Fixed at bottom */}
        <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-between shadow-2xl shrink-0">
           <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-teal-900 rounded-2xl flex items-center justify-center text-white shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>🎧</div>
              <div>
                 <p className="text-[10px] font-black text-stone-800">{currentSheikh}</p>
                 <p className="text-[8px] text-emerald-600 font-bold uppercase">{isPlaying ? 'جاري التلاوة' : 'متوقف'}</p>
              </div>
           </div>
           <button onClick={togglePlayback} className="w-14 h-14 luxury-gradient text-white rounded-full flex items-center justify-center text-2xl shadow-xl active:scale-90 transition-all">
             {isPlaying ? '⏸' : '▶'}
           </button>
        </div>

        {/* Sheikh Picker - Popover */}
        {showSheikhPicker && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end">
            <div className="w-full bg-white rounded-t-[3rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20">
               <h3 className="text-lg font-black text-center text-teal-950">اختر صوت القارئ</h3>
               <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1 scroll-hide">
                  {SHEIKH_LIST.map(s => (
                    <button key={s} onClick={() => { setCurrentSheikh(s); setShowSheikhPicker(false); if(isPlaying) playVerse(activeVerse || 1); }}
                      className={`p-3 rounded-2xl border-2 text-xs font-black transition-all ${currentSheikh === s ? 'bg-teal-900 text-white border-teal-900' : 'bg-stone-50 border-stone-100 text-stone-600'}`}>
                      {s}
                    </button>
                  ))}
               </div>
               <button onClick={() => setShowSheikhPicker(false)} className="w-full py-2 text-[10px] font-black text-stone-300 uppercase">إلغاء</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#FAF8F4] font-['Cairo'] overflow-hidden">
      <div className="p-6 luxury-gradient text-white flex flex-col items-center shrink-0">
        <h2 className="text-2xl font-black">القرآن الكريم</h2>
        <p className="text-[10px] gold-text font-bold uppercase tracking-[0.3em] mt-1">تلاوة عذبة لكل زمان</p>
      </div>
      
      <div className="p-4 shrink-0">
        <div className="relative">
          <input type="text" placeholder="ابحث عن السورة..." className="w-full p-4 pr-12 bg-white rounded-2xl shadow-sm outline-none text-sm font-bold text-teal-950 border border-stone-100" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 scroll-hide pb-20">
        {fullSurahList.filter(s => s.arabicName.includes(searchTerm)).map(s => (
          <button key={s.id} onClick={() => setSelectedSurah(s)} className="w-full bg-white p-4 rounded-3xl border border-stone-50 flex items-center justify-between hover:border-teal-200 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-stone-50 text-stone-400 rounded-xl flex items-center justify-center font-black text-xs">{s.id}</div>
               <div className="text-right">
                 <h4 className="font-black text-stone-800 text-lg">{s.arabicName}</h4>
                 <p className="text-[8px] text-stone-300 font-bold uppercase">{s.verses} آية • {s.type}</p>
               </div>
            </div>
            <span className="text-xl opacity-30">📖</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuranReader;
