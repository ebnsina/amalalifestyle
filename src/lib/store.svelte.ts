import { foods as builtInFoods, toFood, type Food } from '#lib/data/foods.js';
import * as db from '#lib/db.js';
import { dayKey } from '#lib/format.js';
import { i18n, name, type Lang } from '#lib/i18n.svelte.js';
import type { Portion } from '#lib/nutrition.js';
import { workouts as builtIn, type Workout } from '#lib/data/workouts.js';
import {
	BACKUP_APP, type Backup, type Book, type CustomFood, type CustomWorkout, type MealItem, type Prayer, type Profile, type Slot, type Task,
} from '#lib/schema.js';

export type { Slot };
export const slots: { id: Slot; bn: string; en: string }[] = [
	{ id: 'breakfast', bn: 'সকালের নাস্তা', en: 'Breakfast' },
	{ id: 'lunch', bn: 'দুপুরের খাবার', en: 'Lunch' },
	{ id: 'snack', bn: 'বিকেলের নাস্তা', en: 'Afternoon snack' },
	{ id: 'dinner', bn: 'রাতের খাবার', en: 'Dinner' },
];
export const slotName = (s: Slot) => name(slots.find((x) => x.id === s)!);

export function nextSlot(h = new Date().getHours()): Slot {
	if (h < 11) return 'breakfast';
	if (h < 16) return 'lunch';
	if (h < 19) return 'snack';
	return 'dinner';
}

export type Meal = { slot: Slot; portions: Portion[] };
export type Day = { date: string; meals: Meal[] };

// Foods removed from a later food list are skipped instead of crashing old logs.
const toMeals = (items: MealItem[], foodById: Record<string, Food>): Meal[] =>
	slots.flatMap(({ id }) => {
		const portions = items.filter((i) => i.slot === id && foodById[i.foodId])
			.map((i) => ({ food: foodById[i.foodId], units: i.units }));
		return portions.length ? [{ slot: id, portions }] : [];
	});

// Own routines carry one name, used in both languages; their ids can't clash with the built-in ones.
export const toWorkout = (c: CustomWorkout): Workout => ({
	id: `my-${c.id}`, bn: c.name, en: c.name, subBn: 'নিজের রুটিন', subEn: 'Your routine', emoji: '⭐',
	minutes: c.minutes, place: c.place, rest: c.rest, custom: true,
	exercises: c.exercises.map((e) => ({ bn: e.name, en: e.name, sets: e.sets, repsBn: e.reps, repsEn: e.reps, tipBn: '', tipEn: '', kg: e.kg || undefined })),
});

// ponytail: prefills setup during UI review; start blank before release.
export const dummyProfile: Profile = {
	age: 34, heightCm: 163, weightKg: 68, sex: 'female', activity: 'medium', goal: 'lose', mealsPerDay: 3, avoid: [],
};

const flip = <T>(xs: T[] = [], x: T) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);

// Memory is what the screens read; every change is written to SQLite right behind it.
class Store {
	status = $state<'loading' | 'ready' | 'failed'>('loading');
	// A write that didn't reach the database; the screen shows it until the next one succeeds.
	saveFailed = $state(false);

	profile = $state<Profile | null>(null);
	items = $state<MealItem[]>([]);
	favourites = $state<string[]>([]);
	recent = $state<string[]>([]);
	prayers = $state<Record<string, Prayer[]>>({});
	workouts = $state<Record<string, string[]>>({});
	sets = $state<Record<string, Record<string, string[]>>>({});
	books = $state<Book[]>([]);
	reading = $state<Record<string, Record<string, number>>>({});
	customWorkouts = $state<CustomWorkout[]>([]);
	// Built-in routines first, then the person's own, all in the same shape.
	allWorkouts = $derived<Workout[]>([...builtIn, ...this.customWorkouts.map(toWorkout)]);
	tasks = $state<Task[]>([]);

	// The meal being written right now: which meal, and the foods ticked for it.
	slot = $state<Slot>(nextSlot());
	cooked = $state<string[]>([]);

	customFoods = $state<CustomFood[]>([]);
	// Built-in foods first, then the person's own, all in the same shape.
	allFoods = $derived<Food[]>([...builtInFoods, ...this.customFoods.map(toFood)]);
	foodById = $derived<Record<string, Food>>(Object.fromEntries(this.allFoods.map((f) => [f.id, f])));

	today = $derived(toMeals(this.items.filter((i) => i.day === dayKey()), this.foodById));
	history = $derived(
		[...new Set(this.items.map((i) => i.day))].filter((d) => d !== dayKey())
			.map((d): Day => ({ date: d, meals: toMeals(this.items.filter((i) => i.day === d), this.foodById) })),
	);

	async init() {
		try {
			await db.migrate();
			this.#apply(await db.loadAll());
			this.status = 'ready';
			// Asks the browser not to clear this site's storage when the phone runs low on space.
			navigator.storage?.persist?.();
		} catch (e) {
			console.error(e);
			this.status = 'failed';
		}
	}

	#apply(d: Omit<Awaited<ReturnType<typeof db.loadAll>>, 'lang'> & { lang?: Lang | null }) {
		this.profile = d.profile;
		this.items = d.items;
		this.favourites = d.favourites ?? [];
		this.recent = d.recent ?? [];
		this.prayers = d.prayers ?? {};
		this.workouts = d.workouts ?? {};
		this.sets = d.sets ?? {};
		this.books = d.books ?? [];
		this.reading = d.reading ?? {};
		this.customWorkouts = d.customWorkouts ?? [];
		this.customFoods = d.customFoods ?? [];
		this.tasks = d.tasks ?? [];
		if (d.lang) i18n.lang = d.lang;
	}

	#write(p: Promise<unknown>) {
		p.then(() => (this.saveFailed = false), (e) => { console.error(e); this.saveFailed = true; });
	}

	#save<K extends 'profile' | 'favourites' | 'prayers' | 'workouts' | 'sets' | 'books' | 'tasks' | 'reading' | 'customWorkouts' | 'customFoods'>(key: K, value: Store[K]) {
		(this as Store)[key] = value;
		this.#write(db.setSetting(key, $state.snapshot(value)));
	}

	setProfile = (p: Profile) => this.#save('profile', p);
	toggleFavourite = (id: string) => this.#save('favourites', flip(this.favourites, id));
	togglePrayer = (day: string, p: Prayer) => this.#save('prayers', { ...this.prayers, [day]: flip(this.prayers[day], p) });
	toggleWorkout = (id: string) => this.#save('workouts', { ...this.workouts, [dayKey()]: flip(this.workouts[dayKey()], id) });
	setSets = (id: string, done: string[]) => this.#save('sets', { ...this.sets, [dayKey()]: { ...this.sets[dayKey()], [id]: done } });
	setBooks = (b: Book[]) => this.#save('books', b);
	// Moving forward logs the pages to today; moving back only fixes the page, since nothing was read.
	setPage = (id: string, read: number) => {
		const was = this.books.find((b) => b.id === id)?.read ?? read;
		this.setBooks(this.books.map((b) => (b.id === id ? { ...b, read } : b)));
		if (read <= was) return;
		const day = dayKey(), today = this.reading[day] ?? {};
		this.#save('reading', { ...this.reading, [day]: { ...today, [id]: (today[id] ?? 0) + read - was } });
	};
	setTasks = (t: Task[]) => this.#save('tasks', t);
	setCustomWorkouts = (w: CustomWorkout[]) => this.#save('customWorkouts', w);
	setCustomFoods = (f: CustomFood[]) => this.#save('customFoods', f);
	setLang = (l: Lang) => {
		i18n.lang = l;
		this.#write(db.setSetting('lang', l));
	};

	saveMeal = (m: Meal) => {
		const day = dayKey();
		const items = m.portions.map((p) => ({ day, slot: m.slot, foodId: p.food.id, units: p.units }));
		this.items = [...this.items.filter((i) => !(i.day === day && i.slot === m.slot)), ...items];
		this.recent = [...new Set([...m.portions.map((p) => p.food.id), ...this.recent])].slice(0, 8);
		this.#write(db.replaceMeal(day, m.slot, items, $state.snapshot(this.recent)));
	};

	exportData = (): Backup => $state.snapshot({
		app: BACKUP_APP, version: 1, exportedAt: new Date().toISOString(), profile: this.profile,
		favourites: this.favourites, recent: this.recent, meals: this.items, prayers: this.prayers,
		workouts: this.workouts, sets: this.sets, books: this.books, tasks: this.tasks, reading: this.reading, customWorkouts: this.customWorkouts, customFoods: this.customFoods,
	});

	// Unlike everyday saves, an import waits for the database: the screen says whether it worked.
	importData = async (b: Backup) => {
		await db.replaceAll(b);
		this.#apply({ ...b, items: b.meals });
		this.cooked = [];
	};
}

export const store = new Store();
