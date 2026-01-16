
import React, { useState } from 'react';
import { UserProfile, Gender, UserAgeGroup } from '../../types';
import { APP_NAME, ADMIN_PHONE } from '../../constants';

interface Props {
  onComplete: (user: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    gender: Gender.MALE,
    ageGroup: UserAgeGroup.ADULT,
    nationality: '',
    location: { lat: 33.8938, lng: 35.5018, city: '' },
    isNewToIslam: false,
    isChildMode: false,
    hasWhishMoney: false,
    subscriptionTier: 0,
    prayerOffsets: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    sheikhs: {
      fajr: 'العفاسي',
      dhuhr: 'عبد الباسط',
      asr: 'المنشاوي',
      maghrib: 'الحصري',
      isha: 'الشريم',
      quran: 'العفاسي'
    },
    azanSound: 'standard',
    isDoNotDisturb: false,
    prePrayerReminder: 10,
    use12HourFormat: true,
    robotName: 'علي'
  });

  const getCleanURL = () => {
    return window.location.href.split('#')[0];
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getCleanURL());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const nextStep = () => setStep(s => s + 1);

  const simulateGoogleLogin = () => {
    if (!formData.name) {
      alert("يرجى كتابة الاسم قبل تسجيل الدخول عبر جوجل");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col p-10 text-center bg-[#FAF8F4] overflow-y-auto font-['Cairo'] relative">
      <div className="mb-10 mt-6 relative z-10">
        <div className="w-32 h-32 luxury-gradient rounded-[3.5rem] mx-auto flex items-center justify-center shadow-2xl border-4 border-[#d4af37] rotate-6 relative animate-in zoom-in duration-700">
          <span className="text-7xl text-white -rotate-6">🌙</span>
        </div>
        <h1 className="text-4xl font-black mt-8 text-teal-950 tracking-tight uppercase">{APP_NAME}</h1>
        <p className="text-[#d4af37] text-[10px] font-black mt-2 uppercase tracking-[0.5em] opacity-80">AliTech • Crafted for You</p>
      </div>

      <div className="flex-1 max-w-sm mx-auto w-full relative z-10">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-teal-950">مرحباً بك في عالم الفخامة</h2>
              <input 
                type="text"
                placeholder="ما هو اسمك الكريم؟"
                className="w-full p-6 bg-white border-2 border-stone-100 rounded-[2.5rem] outline-none focus:border-[#d4af37] transition-all text-center text-lg font-black shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={simulateGoogleLogin}
                className="w-full bg-white border-2 border-stone-100 p-6 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all font-black"
              >
                {loading ? <div className="w-6 h-6 border-4 border-teal-950 border-t-transparent rounded-full animate-spin"></div> : (
                  <>
                    <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="google" />
                    <span className="text-teal-950">التسجيل عبر Google</span>
                  </>
                )}
              </button>

              {/* حل مشكلة الرابط 404 */}
              <div className="pt-8 border-t border-stone-100">
                <p className="text-[10px] text-stone-300 font-bold mb-3">افتح التطبيق على هاتفك الآن</p>
                <button 
                  onClick={handleCopyLink}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${copySuccess ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500 border border-stone-200 shadow-inner'}`}
                >
                  {copySuccess ? '✓ تم نسخ الرابط الفعلي' : '📋 اضغط هنا لنسخ الرابط الصحيح لهاتفك'}
                </button>
                <p className="text-[8px] text-stone-300 mt-2 font-bold">انسخه وأرسله لنفسك عبر الواتساب وافتحه من الهاتف</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-left duration-500">
            <h2 className="text-3xl font-black text-teal-950">رقم الهاتف إلزامي</h2>
            <div className="space-y-2">
              <input 
                type="tel"
                placeholder="7X XXX XXX"
                className="w-full p-8 bg-white border-2 border-stone-100 rounded-[3rem] text-center text-4xl font-black tracking-widest outline-none focus:border-[#d4af37]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button className="text-[10px] text-stone-400 font-bold underline" onClick={() => alert("سيتم إبلاغ المشرف علي طه بأنك لا تملك رقماً، لكن لا يمكنك المتابعة آلياً.")}>ليس لدي رقم هاتف؟</button>
            </div>
            <button 
              disabled={phone.length < 8}
              onClick={nextStep}
              className="w-full luxury-gradient text-white p-7 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all"
            >
              إرسال كود التفعيل
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in slide-in-from-left duration-500">
            <h2 className="text-3xl font-black text-teal-950">أدخل الكود</h2>
            <input 
              type="text" placeholder="----"
              className="w-full p-8 bg-white border-2 border-stone-100 rounded-[3rem] text-center text-6xl font-black tracking-[1.5rem]"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.slice(0,4))}
            />
            <button onClick={nextStep} className="w-full bg-teal-950 text-white p-7 rounded-[2.5rem] font-black shadow-2xl">تأكيد</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-right pb-10">
            <h2 className="text-2xl font-black text-center mb-6">إعداد الملف الشخصي</h2>
            <div className="grid grid-cols-2 gap-4">
               <SelectField label="الجنس" options={['ذكر', 'أنثى']} onChange={(v) => setFormData({...formData, gender: v as Gender})} />
               <SelectField label="العمر" options={['18-45', '4-10', '10-18', '45+']} onChange={(v) => setFormData({...formData, ageGroup: v as UserAgeGroup, isChildMode: v === '4-10'})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <InputField label="الجنسية" placeholder="لبناني" onChange={(v) => setFormData({...formData, nationality: v})} />
               <InputField label="المدينة" placeholder="بيروت" onChange={(v) => setFormData({...formData, location: {...formData.location!, city: v}})} />
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
               <p className="text-[10px] font-bold text-amber-700">هل لديك حساب Whish Money؟</p>
               <div className="flex gap-2 mt-2">
                 <button onClick={() => setFormData({...formData, hasWhishMoney: true})} className={`flex-1 p-2 rounded-xl text-[10px] font-black ${formData.hasWhishMoney ? 'bg-amber-500 text-white' : 'bg-white border'}`}>نعم</button>
                 <button onClick={() => setFormData({...formData, hasWhishMoney: false})} className={`flex-1 p-2 rounded-xl text-[10px] font-black ${!formData.hasWhishMoney ? 'bg-amber-500 text-white' : 'bg-white border'}`}>لا</button>
               </div>
            </div>
            <button 
              onClick={() => onComplete({...formData, id: 'U'+Date.now(), phone, isVerified: true} as UserProfile)}
              className="w-full luxury-gradient text-white p-7 rounded-[2.5rem] font-black shadow-2xl mt-4"
            >
              ابدأ الرحلة الإيمانية
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SelectField = ({ label, options, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-stone-300 pr-2">{label}</label>
    <select className="w-full p-4 bg-white border border-stone-100 rounded-2xl font-black text-xs" onChange={e => onChange(e.target.value)}>
      {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const InputField = ({ label, placeholder, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-stone-300 pr-2">{label}</label>
    <input type="text" placeholder={placeholder} className="w-full p-4 bg-white border border-stone-100 rounded-2xl font-black text-xs" onChange={e => onChange(e.target.value)} />
  </div>
);

export default Onboarding;
