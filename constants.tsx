
import React from 'react';

export const APP_NAME = "صديقك المسلم";
export const DEVELOPER = "Ali Taha (AliTech)";

export const ADMIN_CODE = "AliTech2014";
export const ADMIN_PHONE = "+96170000000";

export const SHEIKHS = [
  { id: 'alafasy', name: 'مشاري العفاسي', apiId: 'ar.alafasy' },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', apiId: 'ar.abdulbasit' },
  { id: 'minshawi', name: 'المنشاوي', apiId: 'ar.minshawi' },
  { id: 'shuraim', name: 'سعود الشريم', apiId: 'ar.shuraym' },
  { id: 'sudais', name: 'عبد الرحمن السديس', apiId: 'ar.sudais' }
];

export const COLORS = {
  primary: "#50A9B4",
  secondary: "#D4AF37",
  bgLight: "#FDFBF7",
  textDark: "#1E3A34",
};

export const AppLogo = ({ size = "w-24 h-24" }: { size?: string }) => (
  <div className={`${size} bg-white rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl p-1 border-[3px] border-[#D4AF37] relative overflow-hidden`}>
    <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
      <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] mb-0.5">
        {/* المنارة */}
        <path d="M70 42 L74 42 L74 72 L70 72 Z" fill="#50A9B4" />
        <path d="M70 42 L72 35 L74 42 Z" fill="#50A9B4" />
        <circle cx="72" cy="34" r="1.5" fill="#D4AF37" />
        
        {/* القاعدة */}
        <path d="M25 72 L68 72 L68 62 L25 62 Z" fill="#50A9B4" />
        <rect x="30" y="65" width="4" height="4" rx="1" fill="white" fillOpacity="0.3" />
        <rect x="40" y="65" width="4" height="4" rx="1" fill="white" fillOpacity="0.3" />
        <rect x="50" y="65" width="4" height="4" rx="1" fill="white" fillOpacity="0.3" />
        <rect x="60" y="65" width="4" height="4" rx="1" fill="white" fillOpacity="0.3" />

        {/* القبة */}
        <path d="M28 62 C28 35 65 35 65 62" fill="#50A9B4" />
        
        {/* الهلال */}
        <path d="M46.5 32 A 4 4 0 1 0 46.5 40 A 3 3 0 1 1 46.5 32" fill="#D4AF37" />
      </svg>
      <div className="text-center -mt-1">
        <div className="text-[#1E3A34] text-[7px] font-[900] leading-none mb-0.5" style={{ fontFamily: 'Cairo' }}>صديقك المسلم</div>
        <div className="text-[#50A9B4] text-[4px] font-bold leading-none opacity-90 uppercase tracking-[0.1em]">Your Muslim Friend</div>
      </div>
    </div>
  </div>
);
