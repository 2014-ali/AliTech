
export enum UserAgeGroup {
  CHILD = '4-10',
  TEEN = '10-18',
  ADULT = '18-45',
  ELDER = '45+'
}

export enum Gender {
  MALE = 'ذكر',
  FEMALE = 'أنثى'
}

export interface PrayerOffsets {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface IndividualPrayerConfig {
  sheikh: string;
  azanType: 'standard' | 'takbeer' | 'voice_only' | 'silent';
  reminderBefore: number;
  preReminderSound: string;
  isEnabled: boolean;
  repeatInterval: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  isVerified: boolean;
  gender: Gender;
  ageGroup: UserAgeGroup;
  location: { lat: number; lng: number; city: string };
  nationality: string;
  avatar?: string;
  language: 'ar' | 'en';
  isDarkMode: boolean;
  subscriptionTier: 'free' | 'royal' | 'gold';
  prayerOffsets: PrayerOffsets;
  prayerConfigs: {
    fajr: IndividualPrayerConfig;
    dhuhr: IndividualPrayerConfig;
    asr: IndividualPrayerConfig;
    maghrib: IndividualPrayerConfig;
    isha: IndividualPrayerConfig;
  };
  use12HourFormat: boolean;
  // نظام المساعد الدراسي
  schoolReturnTime?: string; // بصيغة HH:mm
  homeworkStatus: 'idle' | 'reminding' | 'solving' | 'finished';
  lastHomeworkCheck?: string;
  // New properties to fix missing property errors
  robotName?: string;
  isChildMode?: boolean;
  fastingDays: string[];
  recurringFasting: 'none' | 'mon-thu';
}

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  verses: number;
  type: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  drawing?: string;
}

export interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

// Fixed missing Complaint export
export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

// Fixed missing SentCode export for AdminPanel
export interface SentCode {
  id: string;
  targetPhone: string;
  code: string;
  description: string;
  isClaimed: boolean;
}

// Fixed missing CommunityMessage export
export interface CommunityMessage {
  id: string;
  userId: string;
  userName: string;
  role: 'user' | 'admin' | 'robot';
  text: string;
  timestamp: string;
  avatar?: string;
}
