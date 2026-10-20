import { dayKey, parseDay } from '#lib/format.js';

// Inclusive, as YYYY-MM-DD day keys, which order correctly as plain strings.
export type DayRange = { start: string; end: string };

export const inRange = (day: string, r?: DayRange) => !r || (day >= r.start && day <= r.end);

// Every day from start to end, inclusive.
export function daysOf(r: DayRange) {
	const days: string[] = [];
	for (let d = parseDay(r.start); dayKey(d) <= r.end; d.setDate(d.getDate() + 1)) days.push(dayKey(d));
	return days;
}

// The last n days ending today, the default for the summaries.
export function lastN(n: number, today = new Date()): DayRange {
	const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (n - 1));
	return { start: dayKey(start), end: dayKey(today) };
}
