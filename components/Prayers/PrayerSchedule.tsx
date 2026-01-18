
import React, { useState } from 'react';
import { UserProfile, PrayerOffsets, IndividualPrayerConfig } from '../../types';
import { useNavigate } from 'react-router-dom';
import { SHEIKHS } from '../../constants';

interface Props {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const PrayerSchedule: React.FC<Props> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const isAr = user.language === 'ar';
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [selectedPrayer, setSelectedPrayer] = useState<{ key: keyof UserProfile['prayerConfigs'], name_ar: string, name_en: string } | null>(null);

  const baseTimes = { fajr: "05:12", dhuhr: "11:58", asr: "14:40", maghrib: "16:55", isha: "18:22" };

  // وظيفة لحساب التاريخ الهجري والميلادي بناءً على اليوم الحالي (17 كانون الثاني 2026 = 28 رجب 1447)
  const getDisplayDate = (daysAdd: number) => {
    if (daysAdd === 0) return isAr ? "اليوم" : "Today";

    const baseGreg = new Date(2026, 0, 17); // 17 Jan 2026
    baseGreg.setDate(baseGreg.getDate() + daysAdd);
    
    const gregDay = baseGreg.getDate();
    const gregMonthNames = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
    const gregMonth = gregMonthNames[baseGreg.getMonth()];

    // حساب هجري بسيط (مرجعي)
    let hijriDay = 28 + daysAdd;
    let hijriMonth = "رجب";
    let hijriYear = 1447;

    if (hijriDay > 30) {
      hijriDay -= 30;
      hijriMonth = "شعبان";
    }
    if (hijriMonth === "شعبان" && hijriDay > 29) {
      hijriDay -= 29;
      hijriMonth = "رمضان";
    }

    return `${gregDay} ${gregMonth} - ${hijriDay} ${hijriMonth}`;
  };

  const getAdjustedTime = (base: string, offset: number, daysAdd = 0) => {
    const [h, m] = base.split(':').map(Number);
    const date = new Date(2026, 0, 17);
    date.setDate(date.getDate() + daysAdd);
    date.setHours(h, m + offset, 0);
    return date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: user.use12HourFormat });
  };

  const updateConfig = (field: keyof IndividualPrayerConfig, value: any) => {
    if (!selectedPrayer) return;
    const newConfigs = { ...user.prayerConfigs };
    newConfigs[selectedPrayer.key] = { ...newConfigs[selectedPrayer.key], [field]: value };
    onUpdateUser({ ...user, prayerConfigs: newConfigs });
  };

  const updateOffset = (delta: number) => {
    if (!selectedPrayer) return;
    const newOffsets = { ...user.prayerOffsets };
    newOffsets[selectedPrayer.key as keyof PrayerOffsets] += delta;
    onUpdateUser({ ...user, prayerOffsets: newOffsets });
  };

  return (
    <div className="flex flex-col h-full font-['Cairo'] bg-[#FAF8F4] overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {selectedPrayer && (
        <div className="fixed inset-0 z-[1000] bg-black/70 flex items-end animate-in fade-in backdrop-blur-sm">
           <div className="bg-white w-full rounded-t-[4rem] p-8 space-y-6 animate-in slide-in-from-bottom-20 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-4">
                 <div className="text-right">
                    <h3 className="text-xl font-black text-[#1E3A34]">{isAr ? `إعدادات صلاة ${selectedPrayer.name_ar}` : `${selectedPrayer.name_en} Settings`}</h3>
                    <p className="text-[10px] text-[#50A9B4] font-bold">التعديلات هنا ستطبق على كافة الأيام القادمة</p>
                 </div>
                 <button onClick={() => setSelectedPrayer(null)} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center">✕</button>
              </div>
              
              <div className="space-y-6">
                 {/* تعديل الوقت يدوياً */}
                 <div className="p-6 bg-amber-50 rounded-3xl border-2 border-amber-100 space-y-3">
                    <label className="text-xs font-black text-amber-900 block">تعديل التوقيت (بالدقائق)</label>
                    <div className="flex items-center justify-center gap-6">
                       <button onClick={() => updateOffset(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-md text-2xl font-black text-amber-600 border border-amber-100">-</button>
                       <div className="text-center">
                          <span className="text-3xl font-black text-[#1E3A34] tabular-nums">{user.prayerOffsets[selectedPrayer.key as keyof PrayerOffsets]}</span>
                          <span className="text-[10px] block font-bold text-stone-400">دقيقة</span>
                       </div>
                       <button onClick={() => updateOffset(1)} className="w-12 h-12 rounded-2xl bg-white shadow-md text-2xl font-black text-amber-600 border border-amber-100">+</button>
                    </div>
                 </div>

                 {/* اختيار القارئ */}
                 <div className="space-y-3">
                    <label className="text-xs font-black text-stone-400 mr-2">صوت الشيخ المفضل</label>
                    <div className="grid grid-cols-1 gap-2">
                       {SHEIKHS.map(s => (
                         <button 
                           key={s.id}
                           onClick={() => updateConfig('sheikh', s.name)}
                           className={`p-4 rounded-2xl border-2 flex items-center justify-between font-bold transition-all ${user.prayerConfigs[selectedPrayer.key].sheikh === s.name ? 'bg-[#50A9B4] border-[#50A9B4] text-white' : 'bg-white border-stone-50 text-stone-500'}`}
                         >
                            <span>{s.name}</span>
                            {user.prayerConfigs[selectedPrayer.key].sheikh === s.name && <span>✓</span>}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <button onClick={() => setSelectedPrayer(null)} className="w-full bg-[#1E3A34] text-white p-6 rounded-3xl font-black shadow-xl">حفظ وإغلاق ✅</button>
           </div>
        </div>
      )}

      <div className="p-10 bg-[#1E3A34] text-white rounded-b-[4.5rem] shadow-2xl relative shrink-0">
        <button onClick={() => navigate(-1)} className="absolute top-10 right-8 text-2xl">←</button>
        <div className="text-center pt-6">
           <h2 className="text-2xl font-black">{isAr ? 'المواقيت والرزنامة' : 'Prayer & Calendar'}</h2>
           <div className="flex bg-white/10 p-1 rounded-2xl mt-4 w-48 mx-auto backdrop-blur-md">
              <button onClick={() => setView('daily')} className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'daily' ? 'bg-[#D4AF37] text-white' : 'text-white/40'}`}>اليوم</button>
              <button onClick={() => setView('monthly')} className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'monthly' ? 'bg-[#D4AF37] text-white' : 'text-white/40'}`}>الشهر</button>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scroll-hide pb-32">
        {view === 'daily' ? (
          <div className="space-y-3 p-2">
            {Object.entries(baseTimes).map(([key, base]) => {
              const names_ar: any = {fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء'};
              const names_en: any = {fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha'};
              return (
                <button 
                  key={key} 
                  onClick={() => setSelectedPrayer({ key: key as any, name_ar: names_ar[key], name_en: names_en[key] })}
                  className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-white border-2 border-transparent hover:border-[#D4AF37]/30 transition-all shadow-sm active:scale-[0.98]"
                >
                   <div className="text-right">
                      <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">{key}</span>
                      <span className="text-lg font-black text-[#1E3A34] block">{isAr ? names_ar[key] : names_en[key]}</span>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-[#50A9B4] font-bold">بصوت: {user.prayerConfigs[key as keyof UserProfile['prayerConfigs']].sheikh}</p>
                        {user.prayerOffsets[key as keyof PrayerOffsets] !== 0 && (
                          <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black">
                            {user.prayerOffsets[key as keyof PrayerOffsets] > 0 ? '+' : ''}{user.prayerOffsets[key as keyof PrayerOffsets]}د
                          </span>
                        )}
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-xl font-black text-[#50A9B4] tabular-nums block">
                         {getAdjustedTime(base, user.prayerOffsets[key as keyof PrayerOffsets])}
                      </span>
                   </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="bg-white p-6 rounded-[3rem] shadow-sm overflow-x-auto">
                <table className="w-full text-center text-[10px] font-bold min-w-[450px]">
                   <thead>
                      <tr className="text-stone-300 border-b">
                         <th className="pb-4 text-right pr-4">التاريخ (ميلادي - هجري)</th>
                         <th className="pb-4">فجر</th>
                         <th className="pb-4">ظهر</th>
                         <th className="pb-4">عصر</th>
                         <th className="pb-4">مغرب</th>
                         <th className="pb-4">عشاء</th>
                      </tr>
                   </thead>
                   <tbody className="text-teal-950">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(d => (
                        <tr key={d} className={`border-b border-stone-50 ${d === 0 ? 'bg-amber-50/50' : ''}`}>
                           <td className={`py-4 pr-4 text-right font-black whitespace-nowrap ${d === 0 ? 'text-[#D4AF37]' : 'text-stone-500'}`}>
                             {getDisplayDate(d)}
                           </td>
                           <td className="py-4 opacity-70 tabular-nums">{getAdjustedTime(baseTimes.fajr, user.prayerOffsets.fajr, d)}</td>
                           <td className="py-4 opacity-70 tabular-nums">{getAdjustedTime(baseTimes.dhuhr, user.prayerOffsets.dhuhr, d)}</td>
                           <td className="py-4 opacity-70 tabular-nums">{getAdjustedTime(baseTimes.asr, user.prayerOffsets.asr, d)}</td>
                           <td className="py-4 opacity-70 tabular-nums">{getAdjustedTime(baseTimes.maghrib, user.prayerOffsets.maghrib, d)}</td>
                           <td className="py-4 opacity-70 tabular-nums">{getAdjustedTime(baseTimes.isha, user.prayerOffsets.isha, d)}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="bg-[#50A9B4]/10 p-4 rounded-2xl text-center">
                <p className="text-[9px] text-[#1E3A34] font-black">💡 تم حساب كافة الأيام القادمة بناءً على تعديلاتك الشخصية للوقت اليوم.</p>
             </div>
             <p className="text-center text-[8px] text-stone-400 font-black uppercase tracking-widest">AliTech Quality Timing • 2026</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerSchedule;
