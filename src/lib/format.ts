import { i18n, locale } from '#lib/i18n.svelte.js';

// One formatter per language and style; building them on every call is wasteful in long lists.
const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();
const fmt = <T extends Intl.NumberFormat | Intl.DateTimeFormat>(kind: string, make: (l: string) => T) => {
  const key = `${kind}|${locale()}`;
  if (!cache.has(key)) cache.set(key, make(locale()));
  return cache.get(key) as T;
};

// Bangla digits in Bangla, Western digits in English.
export const num = (n: number) => fmt('num', (l) => new Intl.NumberFormat(l, { maximumFractionDigits: 1 })).format(n);

// Users may type Bangla digits; normalise to ASCII before parsing.
export const parseNum = (s: string) =>
  Number(s.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d))).trim() || NaN);

export const dateLabel = (d: Date) =>
  fmt('date', (l) => new Intl.DateTimeFormat(l, { weekday: 'long', day: 'numeric', month: 'long' })).format(d);

const spoken: Record<number, string> = { 0.5: 'আধা', 1.5: 'দেড়', 2.5: 'আড়াই' };
const unitEn: Record<string, string> = {
  'কাপ': 'cup', 'বাটি': 'bowl', 'টি': 'pc', 'টুকরা': 'piece', 'মাঝারি টুকরা': 'medium piece', 'চামচ': 'spoon',
  'গ্লাস': 'glass',
};
export const unitName = (unit: string) => (i18n.lang === 'en' ? unitEn[unit] ?? unit : unit);

// "দেড় কাপ", "২টি" — how people actually say portions; "1.5 cup" in English.
export const qty = (units: number, unit: string) =>
  i18n.lang === 'en'
    ? `${num(units)} ${unitName(unit)}`
    : `${spoken[units] ?? num(units)}${unit === 'টি' ? '' : ' '}${unit}`;

// Local calendar day as YYYY-MM-DD; toISOString() would use UTC and roll over at 6am in Bangladesh.
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseDay = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// The last n calendar days as day keys, oldest first, ending today.
export const lastDays = (n: number, from = new Date()) =>
  Array.from({ length: n }, (_, i) => dayKey(new Date(from.getFullYear(), from.getMonth(), from.getDate() - (n - 1 - i))));

export const weekday = (key: string, width: 'short' | 'narrow' = 'short') =>
  fmt(`weekday-${width}`, (l) => new Intl.DateTimeFormat(l, { weekday: width })).format(parseDay(key));

export const shortDate = (key: string) =>
  fmt('short', (l) => new Intl.DateTimeFormat(l, { day: 'numeric', month: 'short' })).format(parseDay(key));

// "আজ", "tomorrow"…
export const relativeDay = (days: number) =>
  new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' }).format(days, 'day');

// 75 → "১:১৫"
export const clock = (seconds: number) =>
  `${num(Math.floor(seconds / 60))}:${fmt('two', (l) => new Intl.NumberFormat(l, { minimumIntegerDigits: 2 })).format(seconds % 60)}`;
