import { describe, expect, it } from 'vitest';

import { foodById, foods } from '#lib/data/foods.js';
import { parseBackup } from '#lib/backup.js';
import { bmi, bmiBand, healthyRange } from '#lib/bmi.js';
import { dayKey, lastDays, num, parseNum, qty, unitName } from '#lib/format.js';
import { i18n } from '#lib/i18n.svelte.js';
import { compareToBudget, dailyTarget, recommend } from '#lib/nutrition.js';
import type { Backup, Profile, Task } from '#lib/schema.js';
import { dueLabel, inView, type View } from '#lib/tasks.js';
import { streak, summary } from '#lib/prayer.js';
import { daysOf, inRange, lastN } from '#lib/range.js';
import { convertWords } from '#lib/phonetic.svelte.js';
import { matchScore } from '#lib/search.js';

const woman: Profile = {
  age: 34, heightCm: 163, weightKg: 68, sex: 'female', activity: 'medium', goal: 'lose', mealsPerDay: 3, avoid: [],
};

describe('dailyTarget (Mifflin-St Jeor)', () => {
  it('matches a hand-worked example', () => {
    // 10*68 + 6.25*163 - 5*34 - 161 = 1367.75; *1.375 = 1880.7; -400 = 1480.7 → 1480
    expect(dailyTarget(woman)).toBe(1480);
  });
  it('never goes below the safe floor', () => {
    expect(dailyTarget({ ...woman, weightKg: 35, heightCm: 140, age: 80, activity: 'low' })).toBe(1200);
    expect(dailyTarget({ ...woman, sex: 'male', weightKg: 40, heightCm: 145, age: 85, activity: 'low' })).toBe(1500);
  });
});

describe('recommend', () => {
  const plate = [foodById['rice-white'], foodById['dal-masoor'], foodById.rui];
  it('keeps a real meal even when the day budget is spent', () => {
    const r = recommend(plate, 100, 1);
    expect(r.lowBudget).toBe(true);
    expect(r.budget).toBe(350);
    for (const p of r.portions) expect(p.units).toBeGreaterThanOrEqual(p.food.step);
  });
  it('caps snacks and never flags them as low budget', () => {
    const r = recommend(plate, 1000, 2, true);
    expect(r.budget).toBe(250);
    expect(r.lowBudget).toBe(false);
  });
  it('rounds every portion to the food step', () => {
    for (const p of recommend(plate, 900, 2).portions) expect(p.units / p.food.step % 1).toBe(0);
  });
});

describe('compareToBudget', () => {
  it('calls small differences near, larger ones over or under', () => {
    expect(compareToBudget(270, 250)).toEqual({ diff: 20, state: 'near' });
    expect(compareToBudget(330, 250)).toEqual({ diff: 80, state: 'over' });
    expect(compareToBudget(150, 250)).toEqual({ diff: -100, state: 'under' });
    expect(compareToBudget(660, 600)).toEqual({ diff: 60, state: 'near' }); // 10% of 600
  });
});

describe('bmi (Asian cut-offs)', () => {
  it('computes and bands', () => {
    expect(bmi(68, 163)).toBeCloseTo(25.59, 2);
    expect(bmiBand(18.4)).toBe('under');
    expect(bmiBand(18.5)).toBe('normal');
    expect(bmiBand(22.9)).toBe('normal');
    expect(bmiBand(23)).toBe('over');
    expect(bmiBand(27.5)).toBe('obese');
  });
  it('gives the normal weight range for a height', () => {
    expect(healthyRange(163)).toEqual({ min: 50, max: 60 });
  });
});

describe('format', () => {
  it('speaks portions the everyday way', () => {
    expect(qty(1.5, 'কাপ')).toBe('দেড় কাপ');
    expect(qty(0.5, 'বাটি')).toBe('আধা বাটি');
    expect(qty(2, 'টি')).toBe('২টি');
  });
  it('parses Bangla and English digits', () => {
    expect(parseNum('৩৫')).toBe(35);
    expect(parseNum('5.5')).toBe(5.5);
    expect(parseNum('')).toBeNaN();
  });
  it('uses the local calendar day, not UTC', () => {
    expect(dayKey(new Date(2026, 0, 5, 1, 30))).toBe('2026-01-05');
  });
});

describe('search', () => {
  it.each([
    ['misti kumra', 'মিষ্টি কুমড়া'], ['mishti kumro', 'মিষ্টি কুমড়া'], ['kichuri', 'খিচুড়ি'],
    ['vorta', 'বেগুন ভর্তা'], ['masoor', 'মসুর ডাল'], ['ডাল', 'মসুর ডাল'],
  ])('%s finds %s', (q, name) => expect(matchScore(q, [name])).toBeGreaterThanOrEqual(0));
  it('rejects unrelated words', () => expect(matchScore('fish', ['মসুর ডাল'])).toBe(-1));
});

describe('parseBackup', () => {
  const good: Backup = {
    app: 'amala-lifestyle', version: 1, exportedAt: '2026-10-17T10:00:00.000Z', profile: woman,
    favourites: ['rui'], recent: [],
    meals: [{ day: '2026-10-17', slot: 'lunch', foodId: 'rui', units: 1 }],
    prayers: { '2026-10-17': ['fajr', 'isha'] }, workouts: { '2026-10-17': ['walk'] },
    sets: { '2026-10-17': { walk: ['0-0', '1-0'] } },
    books: [{ id: 'b1', title: 'পথের পাঁচালী', pages: 300, read: 40 }], tasks: [{ id: 't1', text: 'বাজার', done: false, priority: 'medium' }],
    reading: { '2026-10-17': { b1: 12 } },
    customWorkouts: [{ id: 'w1', name: 'পায়ের দিন', place: 'gym', minutes: 40, rest: 60, exercises: [{ name: 'স্কোয়াট', sets: 3, reps: '১০টি' }] }],
  };
  it('accepts its own export', () => {
    const r = parseBackup(JSON.stringify(good));
    expect(r.ok && r.backup).toEqual(good);
  });
  it('still imports a file saved before prayers, books and tasks existed', () => {
    const { prayers, workouts, sets, books, tasks, reading, customWorkouts, ...old } = good;
    const r = parseBackup(JSON.stringify(old));
    expect(r.ok && r.backup).toEqual({ ...old, prayers: {}, workouts: {}, sets: {}, books: [], tasks: [], reading: {}, customWorkouts: [] });
  });
  it('drops meals for unknown foods and counts them', () => {
    const r = parseBackup(JSON.stringify({ ...good, meals: [...good.meals, { ...good.meals[0], foodId: 'pizza' }] }));
    expect(r.ok && r.skipped).toBe(1);
  });
  it('rejects junk and foreign files', () => {
    expect(parseBackup('not json')).toEqual({ ok: false, reason: 'json' });
    expect(parseBackup(JSON.stringify({ app: 'other' }))).toEqual({ ok: false, reason: 'format' });
    expect(parseBackup(JSON.stringify({ ...good, meals: [{ ...good.meals[0], units: -1 }] })).ok).toBe(false);
  });
});

describe('lastDays', () => {
  it('ends today and crosses month boundaries', () => {
    expect(lastDays(3, new Date(2026, 9, 2))).toEqual(['2026-09-30', '2026-10-01', '2026-10-02']);
  });
});

describe('prayer streak', () => {
  const five = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
  const today = new Date(2026, 9, 3);
  it('counts back from yesterday while today is unfinished', () => {
    const log = { '2026-10-01': [...five], '2026-10-02': [...five], '2026-10-03': ['fajr' as const] };
    expect(streak(log, today)).toBe(2);
  });
  it('includes today once all five are done, and nafl do not count', () => {
    const log = { '2026-10-02': [...five], '2026-10-03': [...five, 'witr' as const], '2026-09-30': [...five] };
    expect(streak(log, today)).toBe(2);
    expect(streak({ '2026-10-03': ['tahajjud', 'witr'] }, today)).toBe(0);
  });
});

describe('tasks', () => {
  const t = (id: string, extra: Partial<Task> = {}): Task => ({ id, text: id, done: false, priority: 'medium', ...extra });
  const tasks = [
    t('later', { due: '2026-10-25' }), t('undated'), t('late', { due: '2026-10-18' }),
    t('urgent', { due: '2026-10-20', priority: 'high' }), t('done', { done: true, due: '2026-10-20' }),
  ];
  const ids = (v: View) => inView(tasks, v, '2026-10-20').map((x) => x.id);
  it('filters each view', () => {
    expect(ids('today')).toEqual(['urgent', 'late', 'undated']);
    expect(ids('late')).toEqual(['late']);
    expect(ids('upcoming')).toEqual(['later']);
    expect(ids('done')).toEqual(['done']);
    expect(ids('all')).toEqual(['urgent', 'late', 'later', 'undated', 'done']);
  });
  it('labels dates the everyday way', () => {
    expect(dueLabel('2026-10-20', '2026-10-20')).toBe('আজ');
    expect(dueLabel('2026-10-21', '2026-10-20')).toBe('আগামীকাল');
    expect(dueLabel('2026-10-25', '2026-10-20')).toContain('২৫');
  });
  it('loads tasks saved before dates and priority existed', () => {
    const r = parseBackup(JSON.stringify({ app: 'amala-lifestyle', version: 1, exportedAt: '', profile: null,
      favourites: [], recent: [], meals: [], tasks: [{ id: 't1', text: 'বাজার', done: false }] }));
    expect(r.ok && r.backup.tasks[0].priority).toBe('medium');
  });
});

describe('english', () => {
  it('switches digits, portions and dates with the language', () => {
    i18n.lang = 'en';
    try {
      expect(num(1480)).toBe('1,480');
      expect(qty(1.5, 'কাপ')).toBe('1.5 cup');
      expect(dueLabel('2026-10-21', '2026-10-20')).toBe('tomorrow');
    } finally {
      i18n.lang = 'bn';
    }
    expect(num(1480)).toBe('১,৪৮০');
  });
});

describe('date ranges', () => {
  it('lists every day, across a month end, inclusive', () => {
    expect(daysOf({ start: '2026-09-29', end: '2026-10-02' })).toEqual(['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
  });
  it('last 7 days ends today and has seven days', () => {
    const r = lastN(7, new Date(2026, 9, 20));
    expect(r).toEqual({ start: '2026-10-14', end: '2026-10-20' });
    expect(daysOf(r)).toHaveLength(7);
  });
  it('no range means every day', () => {
    expect(inRange('2020-01-01')).toBe(true);
    expect(inRange('2026-10-21', { start: '2026-10-14', end: '2026-10-20' })).toBe(false);
  });
  it('sums prayers over a range', () => {
    const five = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
    const log = { '2026-10-01': [...five, 'witr' as const], '2026-10-02': ['fajr' as const], '2026-09-01': [...five] };
    const s = summary(log, daysOf({ start: '2026-10-01', end: '2026-10-03' }));
    expect(s.full).toBe(1);
    expect(s.per.fajr).toBe(2);
    expect(s.per.witr).toBe(1);
  });
});

describe('phonetic typing', () => {
  it('converts finished words and keeps the caret in place', () => {
    expect(convertWords('ami bhalo', 9)).toEqual({ text: 'আমি bhalo', caret: 9 - 3 + 3 });
    expect(convertWords('ami bhalo', 9, true).text).toBe('আমি ভালো');
  });
  it('leaves Bangla, digits and spacing alone', () => {
    expect(convertWords('বাজার 2 dal ', 12).text).toBe('বাজার 2 ডাল ');
    expect(convertWords('বাজার', 5, true).text).toBe('বাজার');
  });
});

describe('food list', () => {
  it('has unique ids, and every unit has an English name', () => {
    expect(new Set(foods.map((f) => f.id)).size).toBe(foods.length);
    i18n.lang = 'en';
    try {
      for (const f of foods) expect(unitName(f.unit)).toMatch(/^[a-z ]+$/);
    } finally {
      i18n.lang = 'bn';
    }
  });
  it('finds the new foods by their everyday names', () => {
    for (const [q, id] of [['shosha', 'shosha'], ['tomato', 'tomato'], ['oats', 'oats'], ['শসা', 'shosha'], ['pauruti', 'bread']]) {
      expect(foods.filter((f) => matchScore(q, [f.bn, f.en, ...f.aliases]) >= 0).map((f) => f.id)).toContain(id);
    }
  });
});
