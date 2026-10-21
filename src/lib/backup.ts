import * as v from 'valibot';

import { foodById, foodId } from '#lib/data/foods.js';
import { dayKey } from '#lib/format.js';
import { BackupSchema, type Backup } from '#lib/schema.js';

export const backupFileName = (d = new Date()) => `amala-backup-${dayKey(d)}.json`;

export type ParseResult = { ok: true; backup: Backup; skipped: number } | { ok: false; reason: 'json' | 'format' };

// Validates an imported file; meals for foods this app version doesn't know are dropped and counted.
export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'json' };
  }
  const parsed = v.safeParse(BackupSchema, raw);
  if (!parsed.success) return { ok: false, reason: 'format' };
  const own = new Set(parsed.output.customFoods.map((c) => foodId(c.id)));
  const meals = parsed.output.meals.filter((m) => foodById[m.foodId] || own.has(m.foodId));
  return { ok: true, backup: { ...parsed.output, meals }, skipped: parsed.output.meals.length - meals.length };
}
