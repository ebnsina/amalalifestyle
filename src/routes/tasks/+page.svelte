<script lang="ts">
	import { Add01Icon, Calendar03Icon, Cancel01Icon, CheckListIcon } from '@hugeicons/core-free-icons';
	import { getLocalTimeZone, today as todayDate, type CalendarDate } from '@internationalized/date';
	import * as v from 'valibot';
	import Screen from '#lib/components/Screen.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Checkbox from '#lib/sinaui/ui/Checkbox.svelte';
	import ConfirmButton from '#lib/sinaui/ui/ConfirmButton.svelte';
	import DatePicker from '#lib/sinaui/ui/DatePicker.svelte';
	import Drawer from '#lib/sinaui/ui/Drawer.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import Segmented from '#lib/sinaui/ui/Segmented.svelte';
	import CustomSelect from '#lib/sinaui/ui/CustomSelect.svelte';
	import { num, dayKey } from '#lib/format.js';
	import { locale, name, t } from '#lib/i18n.svelte.js';
	import { TaskSchema } from '#lib/schema.js';
	import { store } from '#lib/store.svelte.js';
	import { rowToggle } from '#lib/row-toggle.js';
	import { dueLabel, inView, priorities, views, type View } from '#lib/tasks.js';
	import RangeFilter from '#lib/components/RangeFilter.svelte';
	import { inRange, type DayRange } from '#lib/range.js';

	const today = dayKey();
	let text = $state('');
	let due = $state<CalendarDate | undefined>(todayDate(getLocalTimeZone()));
	let priority = $state<string>('medium');
	let view = $state<View>('today');
	let adding = $state(false);

	// A date range keeps only tasks due in it; undated tasks drop out while it's set.
	let range = $state<DayRange>();
	const shown = $derived(range ? store.tasks.filter((x) => x.due && inRange(x.due, range)) : store.tasks);
	const list = $derived(inView(shown, view, today));
	const count = (id: View) => inView(shown, id, today).length;
	const doneCount = $derived(store.tasks.filter((x) => x.done).length);
	const empty = $derived<Record<View, string>>({
		today: t('আজকের সব কাজ শেষ, বা এখনো কিছু লেখা হয়নি।', 'Everything for today is done, or nothing is added yet.'),
		late: t('দেরি হওয়া কোনো কাজ নেই।', 'Nothing is overdue.'),
		upcoming: t('সামনের কোনো কাজ নেই। তারিখ বদলে আগামী দিনের কাজ লিখে রাখুন।', 'Nothing coming up. Pick a later date to plan ahead.'),
		done: t('এখনো কোনো কাজ শেষ হয়নি।', 'Nothing finished yet.'),
		all: t('যা যা করবেন লিখে ফেলুন। শেষ হলে টিক দিন।', 'Write down what you’ll do. Tick it when it’s done.'),
	});

	function add(e: SubmitEvent) {
		e.preventDefault();
		const parsed = v.safeParse(TaskSchema, { id: Date.now().toString(36), text, done: false, due: due?.toString(), priority });
		if (!parsed.success) return;
		store.setTasks([...store.tasks, parsed.output]);
		text = '';
		adding = false;
		// Show the new task where it landed.
		if (!views.find((x) => x.id === view)!.show(parsed.output, today)) view = 'all';
	}
	const toggle = (id: string) => store.setTasks(store.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
	const remove = (id: string) => store.setTasks(store.tasks.filter((x) => x.id !== id));
	const tone = { high: 'danger', medium: 'neutral', low: 'neutral' } as const;
</script>

<Screen title={t('আজকের কাজ', 'Today’s tasks')}>
	{#snippet action()}
		<Button size="sm" onclick={() => (adding = true)}><Icon icon={Add01Icon} size={16} /> {t('নতুন কাজ', 'New task')}</Button>
	{/snippet}

	<Drawer bind:open={adding} title={t('নতুন কাজ', 'New task')} closeLabel={t('বন্ধ করুন', 'Close')}>
		<form id="task-form" class="add" onsubmit={add}>
			<Input label={t('কী করবেন', 'What to do')} placeholder={t('যেমন: বাজার করা', 'e.g. Buy groceries')} bind:value={text}
				maxlength={200} enterkeyhint="done" />
			<div class="row when">
				<div class="grow">
					<DatePicker label={t('কবে করবেন', 'When')} locale={locale()} placeholder={t('তারিখ ছাড়া', 'No date')} bind:value={due} />
				</div>
				{#if due}<Button variant="ghost" size="sm" onclick={() => (due = undefined)}>{t('তারিখ সরান', 'Clear date')}</Button>{/if}
			</div>
			<Segmented label={t('কতটা জরুরি', 'Priority')} bind:value={priority} options={priorities.map((p) => ({ value: p.id, label: name(p) }))} />
		</form>
		{#snippet footer()}
			<Button variant="ghost" onclick={() => (adding = false)}>{t('বাতিল', 'Cancel')}</Button>
			<Button type="submit" form="task-form" disabled={!text.trim()}>{t('যোগ করুন', 'Add')}</Button>
		{/snippet}
	</Drawer>

	<div class="row toolbar">
		<div class="view">
			<CustomSelect label={t('দেখান', 'Show')} bind:value={() => view, (v) => (view = v as View)}
				options={views.map((x) => ({ value: x.id, label: `${name(x)} (${num(count(x.id))})` }))} />
		</div>
		<div class="grow">
			<RangeFilter label={t('কোন তারিখের', 'Due between')} clearable future bind:value={range} />
		</div>
	</div>

	<div class="stack">{@render tasks()}</div>

	{#if view === 'done' && doneCount}
		<div class="actions"><ConfirmButton size="sm" onconfirm={() => store.setTasks(store.tasks.filter((x) => !x.done))}
			confirm={t('সব মুছবেন?', 'Delete all?')} done={t('মোছা হয়েছে', 'Deleted')}>{t('শেষ হওয়া সব কাজ মুছুন', 'Delete finished tasks')}</ConfirmButton></div>
	{/if}
</Screen>

{#snippet tasks()}
	{#each list as task (task.id)}
		{@const late = !task.done && !!task.due && task.due < today}
		<div class="task" class:done={task.done} class:high={task.priority === 'high' && !task.done} {@attach rowToggle}>
			<Checkbox class="grow" checked={task.done} onchange={() => toggle(task.id)}>
				{task.text}
				<span class="meta">
					{#if task.priority !== 'medium'}
						<Badge tone={tone[task.priority]} icon={false}>{name(priorities.find((p) => p.id === task.priority)!)}</Badge>
					{/if}
					{#if task.due}
						<span class="xs" class:late class:muted={!late}>
							<Icon icon={Calendar03Icon} size={14} /> {dueLabel(task.due, today)}{late ? ` · ${t('দেরি হয়েছে', 'overdue')}` : ''}
						</span>
					{/if}
				</span>
			</Checkbox>
			<Button variant="ghost" size="sm" square aria-label={t(`${task.text} মুছুন`, `Delete ${task.text}`)} onclick={() => remove(task.id)}>
				<Icon icon={Cancel01Icon} size={18} />
			</Button>
		</div>
	{:else}
		<EmptyState title={t('এখানে কিছু নেই', 'Nothing here')} icon={CheckListIcon}>{empty[view]}</EmptyState>
	{/each}
{/snippet}

<style>
	.add {
		display: grid;
		gap: 0.75rem;
	}
	.toolbar {
		align-items: end;
		gap: 0.5rem;
	}
	.view {
		width: 9.5rem;
		flex: none;
	}
	.when {
		align-items: end;
	}
	.task {
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 52px;
		padding: 0.5rem 0.25rem 0.5rem 1rem;
		border-radius: var(--ui-radius);
		background: var(--ui-surface);
		outline: 1px solid var(--line);
	}
	.task.high {
		outline-color: color-mix(in srgb, var(--ui-danger) 45%, transparent);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}
	.meta span {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
	.late {
		color: var(--ui-danger);
	}
	.done :global(label) {
		color: var(--ui-muted);
		text-decoration: line-through;
	}
</style>
