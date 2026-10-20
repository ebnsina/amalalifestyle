import { dayKey, parseDay, relativeDay, shortDate } from '#lib/format.js';
import type { Task } from '#lib/schema.js';

export type Priority = Task['priority'];
export const priorities: { id: Priority; bn: string; en: string }[] = [
	{ id: 'high', bn: 'জরুরি', en: 'Urgent' },
	{ id: 'medium', bn: 'সাধারণ', en: 'Normal' },
	{ id: 'low', bn: 'পরে হলেও চলবে', en: 'Can wait' },
];

export type View = 'today' | 'upcoming' | 'late' | 'done' | 'all';
// today: due today, overdue or undated; what to do now.
export const views: { id: View; bn: string; en: string; show: (t: Task, today: string) => boolean }[] = [
	{ id: 'today', bn: 'আজ', en: 'Today', show: (t, today) => !t.done && (!t.due || t.due <= today) },
	{ id: 'late', bn: 'দেরি হয়েছে', en: 'Overdue', show: (t, today) => !t.done && !!t.due && t.due < today },
	{ id: 'upcoming', bn: 'সামনে', en: 'Upcoming', show: (t, today) => !t.done && !!t.due && t.due > today },
	{ id: 'done', bn: 'শেষ', en: 'Done', show: (t) => t.done },
	{ id: 'all', bn: 'সব', en: 'All', show: () => true },
];

const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// Open before done, urgent first, then soonest date; undated after dated.
export function inView(tasks: Task[], view: View, today = dayKey()) {
	const show = views.find((v) => v.id === view)!.show;
	return tasks.filter((t) => show(t, today)).sort((a, b) =>
		Number(a.done) - Number(b.done) || rank[a.priority] - rank[b.priority]
		|| (a.due ?? '9999').localeCompare(b.due ?? '9999'));
}

// "আজ", "আগামীকাল", "গতকাল", else "২৫ অক্টো".
export function dueLabel(due: string, today = dayKey()) {
	const days = Math.round((parseDay(due).getTime() - parseDay(today).getTime()) / 86_400_000);
	return Math.abs(days) <= 1 ? relativeDay(days) : shortDate(due);
}
