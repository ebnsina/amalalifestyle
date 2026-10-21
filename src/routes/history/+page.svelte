<script lang="ts">
	import Guide from '#lib/components/Guide.svelte';
	import { Calendar03Icon } from '@hugeicons/core-free-icons';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import RangeFilter from '#lib/components/RangeFilter.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import { num, dateLabel, parseDay } from '#lib/format.js';
	import { dailyTarget, kcalOf } from '#lib/nutrition.js';
	import { locale, name, t } from '#lib/i18n.svelte.js';
	import { inRange, type DayRange } from '#lib/range.js';
	import { slotName, store } from '#lib/store.svelte.js';

	const target = $derived(store.profile ? dailyTarget(store.profile) : 0);
	let range = $state<DayRange>();
	const days = $derived(store.history.filter((d) => inRange(d.date, range)));
	const totalOf = (d: (typeof days)[number]) => Math.round(d.meals.reduce((s, m) => s + kcalOf(m.portions), 0));
	const average = $derived(days.length ? Math.round(days.reduce((s, d) => s + totalOf(d), 0) / days.length) : 0);
</script>

<Screen title={t('আগের দিনগুলো', 'Past days')}>
	<Guide id="history" steps={[
		t('আগের প্রতিটি দিনের খাওয়ার হিসাব এখানে জমা থাকে।', 'Every earlier day’s meals are kept here.'),
		t('তারিখ বেছে নিলে সেই সময়ের দিনগুলো আর গড় ক্যালরি দেখাবে।', 'Pick dates to see just those days and their average calories.'),
	]} />

	{#if store.history.length}
		<RangeFilter label={t('কোন সময়ের হিসাব', 'Date range')} clearable bind:value={range} />
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
						<p class="small muted num">{num(total)} / {num(target)} {t('ক্যালরি', 'kcal')}</p>
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
