<script lang="ts">
	import { Calendar03Icon } from '@hugeicons/core-free-icons';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import { num, dateLabel, parseDay } from '#lib/format.js';
	import { dailyTarget, kcalOf } from '#lib/nutrition.js';
	import { locale, name, t } from '#lib/i18n.svelte.js';
	import { slotName, store } from '#lib/store.svelte.js';

	const target = $derived(store.profile ? dailyTarget(store.profile) : 0);
</script>

<Screen title={t('আগের দিনগুলো', 'Past days')}>
	{#each store.history as d, i (d.date)}
		{@const total = Math.round(d.meals.reduce((s, m) => s + kcalOf(m.portions), 0))}
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
		<EmptyState title={t('এখনো কিছু নেই', 'Nothing yet')} icon={Calendar03Icon}>{t('আগের কোনো দিনের হিসাব এখনো নেই।', 'No earlier days are logged yet.')}</EmptyState>
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
