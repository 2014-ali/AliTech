
import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, UserAgeGroup } from '../../types';
import { APP_NAME, AppLogo, COLORS } from '../../constants';

interface Props {
  onComplete: (user: UserProfile) => void;
}

type AuthStep = 'language' | 'auth_type' | 'phone' | 'otp' | 'basic_info' | 'location';

const translations = {
  ar: {
    welcome: "مرحباً بك مجدداً",
    selectLang: "اختر لغة التطبيق",
    phoneLogin: "رقم الهاتف",
    back: "رجوع",
    enterPhone: "أدخل رقم هاتفك",
    sendOtp: "إرسال كود التحقق",
    enterOtp: "أدخل كود التحقق (OTP)",
    verify: "تحقق ودخول",
    profileTitle: "الملف الشخصي",
    fullName: "اسمك الكامل",
    genderM: "ذكر",
    genderF: "أنثى",
    next: "التالي",
    residence: "بيانات الإقامة",
    country: "البلد (مثلاً: لبنان)",
    city: "المدينة (مثلاً: بيروت)",
    start: "ابدأ الآن 🕋",
    error: "يرجى إكمال جميع الحقول المطلوبة"
  },
  en: {
    welcome: "Welcome Back",
    selectLang: "Select Language",
    phoneLogin: "Phone Number",
    back: "Back",
    enterPhone: "Enter your phone",
    sendOtp: "Send OTP Code",
    enterOtp: "Enter OTP Code",
    verify: "Verify & Enter",
    profileTitle: "Personal Profile",
    fullName: "Your Full Name",
    genderM: "Male",
    genderF: "Female",
    next: "Next Step",
    residence: "Residence Data",
    country: "Country (e.g. USA)",
    city: "City (e.g. NY)",
    start: "Start Now 🕋",
    error: "Please fill all required fields"
  }
};

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<AuthStep>('language');
  const [inputCode, setInputCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    phone: '',
    gender: Gender.MALE,
    ageGroup: UserAgeGroup.ADULT,
    language: 'ar',
    isDarkMode: false,
    subscriptionTier: 'free',
    prayerOffsets: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    location: { lat: 0, lng: 0, city: '' },
    nationality: '',
    use12HourFormat: true,
    prayerConfigs: {
      fajr: { sheikh: 'مشاري العفاسي', azanType: 'standard', reminderBefore: 10, preReminderSound: 'soft_chime', isEnabled: true, repeatInterval: 5 },
      dhuhr: { sheikh: 'مشاري العفاسي', azanType: 'standard', reminderBefore: 10, preReminderSound: 'soft_chime', isEnabled: true, repeatInterval: 5 },
      asr: { sheikh: 'مشاري العفاسي', azanType: 'standard', reminderBefore: 10, preReminderSound: 'soft_chime', isEnabled: true, repeatInterval: 5 },
      maghrib: { sheikh: 'مشاري العفاسي', azanType: 'standard', reminderBefore: 10, preReminderSound: 'soft_chime', isEnabled: true, repeatInterval: 5 },
      isha: { sheikh: 'مشاري العفاسي', azanType: 'standard', reminderBefore: 10, preReminderSound: 'soft_chime', isEnabled: true, repeatInterval: 5 },
    },
    homeworkStatus: 'idle',
    robotName: 'علي',
    fastingDays: [],
    recurringFasting: 'none'
  });

  const t = formData.language === 'en' ? translations.en : translations.ar;

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...inputCode];
    newOtp[index] = value.slice(-1);
    setInputCode(newOtp);
    if (value && index < 5) (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
  };

  const finalize = () => {
    if (!formData.name || !formData.nationality || !formData.location?.city) {
      alert(t.error);
      return;
    }
    onComplete({ ...formData, id: Date.now().toString(), isVerified: true } as UserProfile);
  };

  return (
    <div className="onboarding-container bg-[#FDFBF7] dark:bg-[#0A0A0A] font-['Cairo'] relative h-full flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-700">
        <AppLogo size="w-32 h-32 mb-10" />

        <div className="w-full bg-white dark:bg-stone-900 p-8 rounded-[3.5rem] shadow-2xl border-2 border-stone-50 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#50A9B4]/5 rounded-full blur-3xl"></div>
          
          {step === 'language' && (
            <div className="space-y-8 text-center relative z-10">
               <h2 className="text-xl font-black">{translations.ar.selectLang} / {translations.en.selectLang}</h2>
               <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => { setFormData({...formData, language: 'ar'}); setStep('auth_type'); }} className="w-full bg-[#1E3A34] text-white p-6 rounded-[2rem] font-black text-lg shadow-lg active:scale-95 transition-all">العربية</button>
                  <button onClick={() => { setFormData({...formData, language: 'en'}); setStep('auth_type'); }} className="w-full border-4 border-stone-50 dark:border-white/10 p-6 rounded-[2rem] font-black text-lg active:scale-95 transition-all">English</button>
               </div>
            </div>
          )}

          {step === 'auth_type' && (
            <div className="space-y-8 text-center relative z-10">
               <h2 className="text-2xl font-black">{t.welcome}</h2>
               <button onClick={() => setStep('phone')} className="w-full bg-[#1E3A34] text-white p-6 rounded-[2rem] font-black flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all border-b-4 border-[#D4AF37]">
                 <span className="text-2xl">📱</span> {t.phoneLogin}
               </button>
               <button onClick={() => setStep('language')} className="text-stone-300 dark:text-stone-600 text-[10px] font-black uppercase tracking-[0.3em]">{t.back}</button>
            </div>
          )}

          {step === 'phone' && (
            <div className="space-y-8 relative z-10">
               <h2 className="text-xl font-black text-center">{t.enterPhone}</h2>
               <div className="flex gap-3" dir="ltr">
                  <div className="h-16 px-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border-2 flex items-center font-black text-[#50A9B4]">+961</div>
                  <input type="tel" className="flex-1 h-16 px-5 bg-stone-50 dark:bg-stone-800 rounded-2xl border-2 font-black text-xl tracking-widest outline-none focus:border-[#D4AF37] transition-all" placeholder="70 000 000" />
               </div>
               <button onClick={() => setStep('otp')} className="w-full bg-[#1E3A34] text-white p-6 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">{t.sendOtp}</button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-8 relative z-10">
               <h2 className="text-xl font-black text-center">{t.enterOtp}</h2>
               <div className="flex justify-between gap-2" dir="ltr">
                  {[0,1,2,3,4,5].map(i => (
                    <input key={i} id={`otp-${i}`} type="text" maxLength={1} className="w-11 h-16 bg-stone-50 dark:bg-stone-800 border-2 rounded-2xl text-center font-black text-2xl focus:border-[#D4AF37] outline-none" value={inputCode[i]} onChange={e => handleOtpChange(i, e.target.value)} />
                  ))}
               </div>
               <button onClick={() => setStep('basic_info')} className="w-full bg-[#1E3A34] text-white p-6 rounded-[2rem] font-black active:scale-95 transition-all shadow-xl">{t.verify}</button>
            </div>
          )}

          {step === 'basic_info' && (
            <div className="space-y-8 relative z-10">
               <h2 className="text-2xl font-black text-center">{t.profileTitle}</h2>
               <input 
                 className="w-full h-16 px-6 bg-stone-50 dark:bg-stone-800 rounded-[2rem] border-2 font-black text-center text-lg outline-none focus:border-[#D4AF37] transition-all"
                 placeholder={t.fullName}
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
               />
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormData({...formData, gender: Gender.MALE})} className={`p-5 rounded-3xl border-4 font-black transition-all ${formData.gender === Gender.MALE ? 'bg-[#1E3A34] border-[#D4AF37] text-white' : 'bg-white border-stone-50 text-stone-300'}`}>{t.genderM}</button>
                  <button onClick={() => setFormData({...formData, gender: Gender.FEMALE})} className={`p-5 rounded-3xl border-4 font-black transition-all ${formData.gender === Gender.FEMALE ? 'bg-[#50A9B4] border-[#D4AF37] text-white' : 'bg-white border-stone-50 text-stone-300'}`}>{t.genderF}</button>
               </div>
               <button onClick={() => setStep('location')} className="w-full bg-[#1E3A34] text-white p-6 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">{t.next}</button>
            </div>
          )}

          {step === 'location' && (
            <div className="space-y-8 relative z-10">
               <h2 className="text-2xl font-black text-center">{t.residence}</h2>
               <div className="space-y-4">
                  <input 
                    className="w-full h-16 px-6 bg-stone-50 dark:bg-stone-800 rounded-[2rem] border-2 font-black text-center text-lg outline-none focus:border-[#D4AF37] transition-all"
                    placeholder={t.country}
                    value={formData.nationality}
                    onChange={e => setFormData({...formData, nationality: e.target.value})}
                  />
                  <input 
                    className="w-full h-16 px-6 bg-stone-50 dark:bg-stone-800 rounded-[2rem] border-2 font-black text-center text-lg outline-none focus:border-[#D4AF37] transition-all"
                    placeholder={t.city}
                    value={formData.location?.city}
                    onChange={e => setFormData({...formData, location: { lat: 0, lng: 0, city: e.target.value }})}
                  />
               </div>
               <button onClick={finalize} className="w-full bg-[#1E3A34] text-white p-7 rounded-[2.5rem] font-black text-xl shadow-2xl border-b-8 border-[#D4AF37] active:scale-95 transition-all">{t.start}</button>
            </div>
          )}
        </div>
        
        <p className="mt-8 text-[8px] font-black text-stone-300 dark:text-stone-700 uppercase tracking-[0.6em]">AliTech Intelligence Quality</p>
      </div>
    </div>
  );
};

export default Onboarding;
