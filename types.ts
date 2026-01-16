
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

export interface SheikhConfig {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  quran: string;
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
  isNewToIslam: boolean;
  isChildMode: boolean;
  hasWhishMoney: boolean;
  robotName?: string;
  subscriptionTier: number;
  prayerOffsets: PrayerOffsets;
  sheikhs: SheikhConfig;
  azanSound: string;
  isDoNotDisturb: boolean;
  prePrayerReminder: number;
  use12HourFormat: boolean;
  fastingDays: string[]; // ISO date strings
  recurringFasting: 'none' | 'mon-thu';
}

export interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  country: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Surah {
  id: number;
  name: string;
  verses: number;
  type: string;
  arabicName: string;
}
