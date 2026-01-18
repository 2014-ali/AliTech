
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Surah } from '../../types';
import { SHEIKHS } from '../../constants';

interface Ayah {
  number: number;
  text: string;
  audio: string;
}

const QuranReader: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [selectedSheikh, setSelectedSheikh] = useState(SHEIKHS[0]);
  const [showSheikhMenu, setShowSheikhMenu] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
  ];

  const allSurahs: Surah[] = surahNames.map((name, index) => ({
    id: index + 1,
    name: `Surah ${index + 1}`,
    arabicName: name,
    verses: 0,
    type: index < 80 ? "مكية" : "مدنية"
  }));

  const fetchSurahAyahs = async (surahId: number, sheikhApiId: string) => {
    setLoading(true);
    setCurrentAyahIndex(-1);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${sheikhApiId}`);
      const data = await res.json();
      const fetchedAyahs = data.data.ayahs.map((a: any) => ({
        number: a.numberInSurah,
        text: a.text,
        audio: a.audio
      }));
      setAyahs(fetchedAyahs);
      ayahRefs.current = new Array(fetchedAyahs.length).fill(null);
    } catch (e) {
      console.error("Failed to load surah ayahs", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSurah) {
      fetchSurahAyahs(selectedSurah.id, selectedSheikh.apiId);
    }
  }, [selectedSheikh, selectedSurah]);

  const selectSurah = (s: Surah) => {
    setSelectedSurah(s);
  };

  const playAyah = (index: number) => {
    if (index >= ayahs.length) {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      return;
    }
    setCurrentAyahIndex(index);
    if (audioRef.current) {
      audioRef.current.src = ayahs[index].audio;
      audioRef.current.play();
      setIsPlaying(true);
      ayahRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (currentAyahIndex === -1) playAyah(0);
      else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className={`h-full flex flex-col font-['Cairo'] ${user.isDarkMode ? 'bg-[#121212]' : 'bg-[#F8F5F0]'}`}>
      <div className="p-8 md:p-12 bg-[#134E4A] text-white shrink-0 rounded-b-[4rem] shadow-xl text-center relative z-20">
         <h2 className="text-2xl md:text-4xl font-black">المصحف المرتل</h2>
         <p className="text-[10px] md:text-xs text-[#C5A059] font-black uppercase tracking-[0.4em] mt-1">AliTech Holy Quran System</p>
         
         <button 
           onClick={() => setShowSheikhMenu(!showSheikhMenu)}
           className="mt-6 bg-white/10 px-6 py-3 rounded-2xl text-[10px] md:text-xs font-black border border-white/20 backdrop-blur-md flex items-center gap-2 mx-auto"
         >
           <span>صوت القارئ: {selectedSheikh.name}</span>
           <span>▼</span>
         </button>

         {showSheikhMenu && (
           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 md:w-80 bg-white rounded-3xl shadow-2xl p-2 z-50 text-stone-800 animate-in slide-in-from-top-2">
             {SHEIKHS.map(s => (
               <button 
                 key={s.id}
                 onClick={() => { setSelectedSheikh(s); setShowSheikhMenu(false); }}
                 className={`w-full text-right p-4 rounded-2xl font-black text-xs md:text-sm transition-colors ${selectedSheikh.id === s.id ? 'bg-[#50A9B4] text-white' : 'hover:bg-stone-50'}`}
               >
                 {s.name}
               </button>
             ))}
           </div>
         )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-4 pb-32 scroll-hide">
        {selectedSurah ? (
          <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
             <div className="flex items-center justify-between sticky top-0 bg-[#F8F5F0]/90 dark:bg-[#121212]/90 backdrop-blur-md py-4 z-10 px-4 rounded-3xl">
                <button onClick={() => { setSelectedSurah(null); setIsPlaying(false); setAyahs([]); }} className="text-xs md:text-sm font-black text-[#134E4A] dark:text-[#50A9B4]">← فهرس السور</button>
                <div className="text-center">
                   <h3 className="text-3xl font-black text-[#134E4A] dark:text-white">{selectedSurah.arabicName}</h3>
                </div>
                <button 
                   onClick={togglePlay}
                   className="w-14 h-14 bg-[#134E4A] text-white rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-all"
                >
                   {isPlaying ? "⏸" : "▶"}
                </button>
             </div>

             <audio ref={audioRef} onEnded={() => playAyah(currentAyahIndex + 1)} />

             {loading ? (
                <div className="text-center p-20 animate-pulse text-stone-300 font-black">جاري تحميل الآيات المباركة...</div>
             ) : (
                <div className="bg-white dark:bg-stone-900 p-8 md:p-16 rounded-[3.5rem] shadow-sm text-right leading-[3.5] font-['Tajawal'] text-3xl md:text-4xl">
                   {ayahs.map((ayah, idx) => (
                      <div 
                        key={idx} 
                        ref={el => { ayahRefs.current[idx] = el; }}
                        className={`inline-block p-3 rounded-2xl cursor-pointer transition-all duration-500 ${currentAyahIndex === idx ? 'bg-[#D4AF37]/20 text-[#D4AF37] scale-105 shadow-md ring-2 ring-[#D4AF37]' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50'}`}
                        onClick={() => playAyah(idx)}
                      >
                         {ayah.text} <span className="text-[#50A9B4] text-sm md:text-lg opacity-50 mx-2">({ayah.number})</span>
                      </div>
                   ))}
                </div>
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {allSurahs.map(s => (
              <button key={s.id} onClick={() => selectSurah(s)} className="w-full bg-white dark:bg-stone-900 p-6 md:p-8 rounded-[2.5rem] border border-stone-50 dark:border-white/5 shadow-sm flex items-center justify-between group active:scale-95 transition-all hover:border-[#50A9B4]/30">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center font-black text-xs md:text-sm group-hover:bg-[#50A9B4] group-hover:text-white transition-colors">{s.id}</div>
                  <h4 className="font-black text-xl md:text-2xl">{s.arabicName}</h4>
                </div>
                <div className="text-left">
                   <span className="text-[10px] md:text-xs text-stone-300 font-bold block">{s.type}</span>
                   <span className="text-[8px] md:text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">Listen to {selectedSheikh.name.split(' ')[0]}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranReader;
