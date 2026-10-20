import type { Activity, Goal, Sex } from '#lib/nutrition.js';

export const sexOptions: { id: Sex; bn: string; en: string }[] = [
  { id: 'female', bn: 'নারী', en: 'Woman' },
  { id: 'male', bn: 'পুরুষ', en: 'Man' },
];

export const activityOptions: { id: Activity; bn: string; en: string; hintBn: string; hintEn: string; emoji: string }[] = [
  { id: 'low', bn: 'বেশিরভাগ সময় বসে থাকি', en: 'Mostly sitting', hintBn: 'অফিস, পড়াশোনা, ঘরে বিশ্রাম', hintEn: 'Office work, study, resting at home', emoji: '🪑' },
  { id: 'medium', bn: 'মাঝামাঝি চলাফেরা', en: 'Moving around some', hintBn: 'ঘরের কাজ, হাঁটাহাঁটি, বাজার করা', hintEn: 'Housework, walking, shopping', emoji: '🚶' },
  { id: 'high', bn: 'অনেক পরিশ্রম করি', en: 'Very active', hintBn: 'শারীরিক কাজ, নিয়মিত ব্যায়াম', hintEn: 'Physical work, regular exercise', emoji: '🏋️' },
];

export const goalOptions: { id: Goal; bn: string; en: string; emoji: string }[] = [
  { id: 'lose', bn: 'ওজন কমাতে চাই', en: 'Lose weight', emoji: '📉' },
  { id: 'keep', bn: 'ওজন ঠিক রাখতে চাই', en: 'Keep my weight', emoji: '⚖️' },
  { id: 'gain', bn: 'ওজন বাড়াতে চাই', en: 'Gain weight', emoji: '📈' },
];

export const avoidOptions = [
  { id: 'beef', bn: 'গরুর মাংস খাই না', en: 'No beef' },
  { id: 'fish', bn: 'মাছ খাই না', en: 'No fish' },
  { id: 'milk', bn: 'দুধে সমস্যা হয়', en: 'Milk upsets me' },
  { id: 'egg', bn: 'ডিম খাই না', en: 'No eggs' },
];
