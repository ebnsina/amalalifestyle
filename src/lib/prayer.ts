import { dayKey } from '#lib/format.js';
import type { Prayer } from '#lib/schema.js';

export type PrayerInfo = { id: Prayer; bn: string; en: string; whenBn: string; whenEn: string };

export const fard: PrayerInfo[] = [
  { id: 'fajr', bn: 'ফজর', en: 'Fajr', whenBn: 'ভোর', whenEn: 'Dawn' },
  { id: 'dhuhr', bn: 'যোহর', en: 'Dhuhr', whenBn: 'দুপুর', whenEn: 'Midday' },
  { id: 'asr', bn: 'আসর', en: 'Asr', whenBn: 'বিকেল', whenEn: 'Afternoon' },
  { id: 'maghrib', bn: 'মাগরিব', en: 'Maghrib', whenBn: 'সন্ধ্যা', whenEn: 'Sunset' },
  { id: 'isha', bn: 'ইশা', en: 'Isha', whenBn: 'রাত', whenEn: 'Night' },
];

export const extra: PrayerInfo[] = [
  { id: 'tahajjud', bn: 'তাহাজ্জুদ', en: 'Tahajjud', whenBn: 'শেষ রাতে, ফজরের আগে', whenEn: 'Late night, before Fajr' },
  { id: 'ishraq', bn: 'ইশরাক', en: 'Ishraq', whenBn: 'সূর্য ওঠার একটু পরে', whenEn: 'Shortly after sunrise' },
  { id: 'duha', bn: 'চাশত (দুহা)', en: 'Duha', whenBn: 'সকাল থেকে দুপুরের আগে', whenEn: 'Morning, before midday' },
  { id: 'awwabin', bn: 'আওয়াবীন', en: 'Awwabin', whenBn: 'মাগরিবের পরে', whenEn: 'After Maghrib' },
  { id: 'witr', bn: 'বিতর', en: 'Witr', whenBn: 'ইশার পরে', whenEn: 'After Isha' },
];

const allFard = (done: Prayer[] = []) => fard.every((p) => done.includes(p.id));

// Days in a row with all five fard prayers; today still counts as "in progress" until it's over.
export function streak(log: Record<string, Prayer[]>, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (!allFard(log[dayKey(d)])) d.setDate(d.getDate() - 1);
  let n = 0;
  while (allFard(log[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
