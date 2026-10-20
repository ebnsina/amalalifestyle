import wasm from '@sqlite.org/sqlite-wasm/sqlite3.wasm?url';
import * as v from 'valibot';

import type { Reply, Request, Stmt } from '#lib/db.worker.js';
import {
	BookSchema, MealItemSchema, PrayersSchema, ProfileSchema, ReadingSchema, SetsSchema, TaskSchema, WorkoutsSchema, type Backup,
	type MealItem, type Slot,
} from '#lib/schema.js';

const waiting = new Map<number, { resolve: (rows: Record<string, unknown>[]) => void; reject: (e: Error) => void }>();
let next = 0;
let worker: Worker;

function start() {
	worker = new Worker(new URL('./db.worker.ts', import.meta.url), { type: 'module' });
	worker.postMessage({ wasm } satisfies Request);
	worker.onmessage = ({ data }: MessageEvent<Reply>) => {
		const w = waiting.get(data.id);
		waiting.delete(data.id);
		if (data.error) w?.reject(new Error(data.error));
		else w?.resolve(data.rows ?? []);
	};
}
start();

// Runs the statements in one transaction; resolves with the rows of the last one.
function run(...stmts: Stmt[]) {
	const id = next++;
	return new Promise<Record<string, unknown>[]>((resolve, reject) => {
		waiting.set(id, { resolve, reject });
		worker.postMessage({ id, stmts } satisfies Request);
	});
}

const VERSION = 1;

// Same schema as the phone app. Bump VERSION and add a step for every change; never edit a shipped step.
export async function migrate() {
	// Right after a reload the old page's worker may still hold the file; another open tab holds it for good.
	// sqlite-wasm remembers a failed open, so each try needs a fresh worker.
	let row: Record<string, unknown> | undefined;
	for (let tries = 0; ; tries++) {
		try {
			[row] = await run({ sql: 'PRAGMA user_version' });
			break;
		} catch (e) {
			if (tries === 10) throw e;
			worker.terminate();
			await new Promise((r) => setTimeout(r, 300));
			start();
		}
	}
	const current = Number(row?.user_version ?? 0);
	if (current > VERSION) throw new Error(`Database v${current} is newer than this app (v${VERSION})`);
	if (current === VERSION) return;
	const steps: Stmt[] = [];
	if (current < 1) {
		steps.push(
			{ sql: 'CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)' },
			{
				sql: `CREATE TABLE meal_items (
					id INTEGER PRIMARY KEY NOT NULL,
					day TEXT NOT NULL,
					slot TEXT NOT NULL CHECK (slot IN ('breakfast', 'lunch', 'snack', 'dinner')),
					food_id TEXT NOT NULL,
					units REAL NOT NULL CHECK (units > 0)
				)`,
			},
			{ sql: 'CREATE INDEX meal_items_day ON meal_items (day)' },
		);
	}
	await run(...steps, { sql: `PRAGMA user_version = ${VERSION}` });
}

const ids = v.array(v.string());
const schemas = {
	profile: ProfileSchema, favourites: ids, recent: ids, prayers: PrayersSchema, workouts: WorkoutsSchema,
	sets: SetsSchema, books: v.array(BookSchema), tasks: v.array(TaskSchema), reading: ReadingSchema, lang: v.picklist(['bn', 'en']),
};
type Settings = { [K in keyof typeof schemas]: v.InferOutput<(typeof schemas)[K]> | null };

// Corrupt or outdated values are treated as unset rather than crashing on launch.
function parse<T>(schema: v.GenericSchema<unknown, T>, text: string | undefined): T | null {
	if (text === undefined) return null;
	try {
		const parsed = v.safeParse(schema, JSON.parse(text));
		return parsed.success ? parsed.output : null;
	} catch {
		return null;
	}
}

export async function loadAll() {
	const rows = await run({ sql: 'SELECT key, value FROM settings' });
	const raw = Object.fromEntries(rows.map((r) => [r.key as string, r.value as string]));
	const settings = Object.fromEntries(
		Object.entries(schemas).map(([k, s]) => [k, parse(s as v.GenericSchema, raw[k])]),
	) as Settings;
	const items = (await run({ sql: 'SELECT day, slot, food_id, units FROM meal_items ORDER BY day DESC, id' }))
		.flatMap((r) => {
			const parsed = v.safeParse(MealItemSchema, { day: r.day, slot: r.slot, foodId: r.food_id, units: r.units });
			return parsed.success ? [parsed.output] : [];
		});
	return { ...settings, items };
}

const setting = (key: string, value: unknown): Stmt =>
	({ sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', bind: [key, JSON.stringify(value)] });

const insertItem = (i: MealItem): Stmt =>
	({ sql: 'INSERT INTO meal_items (day, slot, food_id, units) VALUES (?, ?, ?, ?)', bind: [i.day, i.slot, i.foodId, i.units] });

export const setSetting = (key: string, value: unknown) => run(setting(key, value));

// Replaces whatever was logged for that meal, so re-saving a meal edits it instead of duplicating.
export const replaceMeal = (day: string, slot: Slot, items: MealItem[], recent: string[]) =>
	run({ sql: 'DELETE FROM meal_items WHERE day = ? AND slot = ?', bind: [day, slot] }, ...items.map(insertItem),
		setting('recent', recent));

export const replaceAll = (b: Backup) =>
	run(
		{ sql: 'DELETE FROM meal_items' },
		{ sql: "DELETE FROM settings WHERE key != 'lang'" },
		...(b.profile ? [setting('profile', b.profile)] : []),
		...(['favourites', 'recent', 'prayers', 'workouts', 'sets', 'books', 'tasks', 'reading'] as const).map((k) => setting(k, b[k])),
		...b.meals.map(insertItem),
	);
