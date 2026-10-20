<script lang="ts">
	import { Calendar03Icon } from '@hugeicons/core-free-icons';
	import { getLocalTimeZone, startOfMonth, today } from '@internationalized/date';
	import type { DateRange } from '#lib/sinaui/ui/Calendar.svelte';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import DateRangePicker from '#lib/sinaui/ui/DateRangePicker.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import { num, dateLabel, parseDay } from '#lib/format.js';
	import { dailyTarget, kcalOf } from '#lib/nutrition.js';
	import { locale, name, t } from '#lib/i18n.svelte.js';
	import { slotName, store } from '#lib/store.svelte.js';

	const target = $derived(store.profile ? dailyTarget(store.profile) : 0);
	const now = today(getLocalTimeZone());
	const presets = $derived([
		{ label: t('গত ৭ দিন', 'Last 7 days'), start: now.subtract({ days: 7 }), end: now },
		{ label: t('গত ৩০ দিন', 'Last 30 days'), start: now.subtract({ days: 30 }), end: now },
		{ label: t('এই মাস', 'This month'), start: startOfMonth(now), end: now },
	]);
	let range = $state<DateRange>();

	// Day keys are YYYY-MM-DD, so plain string comparison orders them by date.
	const days = $derived(range
		? store.history.filter((d) => d.date >= range!.start.toString() && d.date <= range!.end.toString())
		: store.history);
	const totalOf = (d: (typeof days)[number]) => Math.round(d.meals.reduce((s, m) => s + kcalOf(m.portions), 0));
	const average = $derived(days.length ? Math.round(days.reduce((s, d) => s + totalOf(d), 0) / days.length) : 0);
</script>

<Screen title={t('আগের দিনগুলো', 'Past days')}>
	{#if store.history.length}
		<div class="row range">
			<div class="grow">
				<DateRangePicker label={t('কোন সময়ের হিসাব', 'Date range')} locale={locale()} max={now} months={1} {presets}
					placeholder={t('সব দিন', 'All days')} bind:value={range} />
			</div>
			{#if range}<Button variant="ghost" size="sm" onclick={() => (range = undefined)}>{t('সব দিন', 'All days')}</Button>{/if}
		</div>
		{#if days.length}
			<p class="small muted">
				{t(`${num(days.length)} দিন · গড়ে দিনে ${num(average)} ক্যালরি (লক্ষ্য ${num(target)})`,
					`${days.length} ${days.length === 1 ? 'day' : 'days'} · ${num(average)} kcal a day on average (target ${num(target)})`)}
			</p>
		{/if}
	{/if}
	{#each days as d, i (d.date)}
		{@const total = totalOf(d)}
		<Card class="enter" style="--i: {i}">
			<div class="day">
				<div class="row">
					<Progress shape="circle" size={64} label={t('লক্ষ্যের কতটুকু', 'Share of target')} hideLabel value={Math.min(total, target)} max={target || 1}
						locale={locale()} style="--ui-accent: var({total > target ? '--warm' : '--ui-accent'})" />
					<div class="grow">
						<b>{dateLabel(parseDay(d.date))}</b>
						<p class="small muted">{num(total)} / {num(target)} {t('ক্যালরি', 'kcal')}</p>
					</div>
				</div>
				{#each d.meals as m (m.slot)}
					<div class="row">
						<Plate emoji={m.portions[0].food.emoji} size={36} />
						<div class="grow">
							<b class="small">{slotName(m.slot)}</b>
							<p class="xs muted line">{m.portions.map((p) => name(p.food)).join(', ')}</p>
						</div>
						<span class="small muted">{num(Math.round(kcalOf(m.portions)))}</span>
					</div>
				{/each}
			</div>
		</Card>
	{:else}
		{#if range}
			<EmptyState title={t('এই সময়ে কিছু নেই', 'Nothing in these dates')} icon={Calendar03Icon}>{t('অন্য তারিখ বেছে দেখুন।', 'Try other dates.')}</EmptyState>
		{:else}
			<EmptyState title={t('এখনো কিছু নেই', 'Nothing yet')} icon={Calendar03Icon}>{t('আগের কোনো দিনের হিসাব এখনো নেই।', 'No earlier days are logged yet.')}</EmptyState>
		{/if}
	{/each}
</Screen>

<style>
	.range {
		align-items: end;
	}
	.day {
		display: grid;
		gap: 0.75rem;
	}
	b {
		font-weight: 600;
	}
	.line {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
