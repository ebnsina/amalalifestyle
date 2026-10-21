<script lang="ts">
	import { Add01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { setCount, type Workout } from '#lib/data/workouts.js';
	import WorkoutForm from '#lib/components/WorkoutForm.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import { num, dayKey } from '#lib/format.js';
	import RangeFilter from '#lib/components/RangeFilter.svelte';
	import { daysOf, lastN, type DayRange } from '#lib/range.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const today = dayKey();
	let range = $state<DayRange | undefined>(lastN(7));
	const days = $derived(daysOf(range ?? lastN(7)));
	const workouts = $derived(store.allWorkouts);
	let adding = $state(false);
	// Finished workouts in the range: one entry per workout per day.
	const done = $derived(days.flatMap((d) => store.workouts[d] ?? []).filter((id) => workouts.some((w) => w.id === id)));
	const activeDays = $derived(days.filter((d) => store.workouts[d]?.length).length);
	const minutes = $derived(done.reduce((m, id) => m + workouts.find((w) => w.id === id)!.minutes, 0));
	const times = (id: string) => done.filter((x) => x === id).length;
</script>

{#snippet row(w: Workout, i: number)}
	{@const n = store.sets[today]?.[w.id]?.length ?? 0}
	<a class="workout enter" style="--i: {i}" href={resolve('/workout/[id]', { id: w.id })}>
		<span class="top">
			<Plate emoji={w.emoji} size={36} />
			{#if store.workouts[today]?.includes(w.id)}<Badge tone="accent">{t('আজ শেষ', 'Done today')}</Badge>
			{:else if n}<Badge tone="warning" icon={false}>{num(n)}/{num(setCount(w))} {t('সেট', 'sets')}</Badge>
			{:else}<Icon icon={ArrowRight01Icon} size={16} />{/if}
		</span>
		<b>{name(w)}</b>
		<span class="xs muted">{num(w.minutes)} {t('মিনিট', 'min')} · {t(w.subBn, w.subEn)}</span>
	</a>
{/snippet}

<Screen title={t('ফিটনেস গাইড', 'Fitness guide')}>
	<div class="actions">
		<Button onclick={() => (adding = true)}><Icon icon={Add01Icon} size={18} /> {t('নতুন রুটিন', 'New routine')}</Button>
	</div>
	<WorkoutForm bind:open={adding} />

	<Card title={t('হিসাব', 'Summary')} level={2}>
		<div class="stack">
			<RangeFilter label={t('কোন সময়ের হিসাব', 'Dates')} bind:value={range} />
			<div class="stats">
				<div><b>{num(activeDays)}/{num(days.length)}</b><span class="xs muted">{t('দিন ব্যায়াম', 'days active')}</span></div>
				<div><b>{num(minutes)}</b><span class="xs muted">{t('মিনিট', 'minutes')}</span></div>
				<div><b>{num(done.length)}</b><span class="xs muted">{t('বার শেষ করেছেন', 'workouts done')}</span></div>
			</div>
			{#each workouts.filter((w) => times(w.id)) as w (w.id)}
				<div class="row">
					<span class="grow small">{w.emoji} {name(w)}</span>
					<b class="small num">{t(`${num(times(w.id))} বার`, `${times(w.id)}×`)}</b>
				</div>
			{/each}
		</div>
	</Card>

	<h2 class="section">{t('ঘরে', 'At home')}</h2>
	<div class="wgrid">{#each workouts.filter((w) => w.place === 'home') as w, i (w.id)}{@render row(w, i)}{/each}</div>
	<h2 class="section">{t('জিমে', 'At the gym')}</h2>
	<div class="wgrid">{#each workouts.filter((w) => w.place === 'gym') as w, i (w.id)}{@render row(w, i + 3)}{/each}</div>

	<Alert title={t('নিরাপদে ব্যায়াম', 'Exercise safely')}>
		{t('সপ্তাহে অন্তত ১৫০ মিনিট হাঁটা বা হালকা ব্যায়াম ভালো। নতুন হলে হালকা দিয়ে শুরু করুন। বুকে ব্যথা, মাথা ঘোরা বা শ্বাসকষ্ট হলে থামুন। হার্ট, ডায়াবেটিস বা অন্য অসুখ থাকলে আগে ডাক্তারের পরামর্শ নিন।', 'Aim for at least 150 minutes of walking or light exercise a week. If you’re new, start easy. Stop if you feel chest pain, dizziness or shortness of breath. With heart disease, diabetes or another condition, ask your doctor first.')}
	</Alert>
</Screen>

<style>
	/* Two routines a row on phones, three when there's room. */
	.wgrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.5rem;
	}
	.workout {
		display: grid;
		align-content: start;
		gap: 0.25rem;
		padding: 0.75rem;
		border-radius: var(--ui-radius);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		color: inherit;
		text-decoration: none;
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}
	.workout b {
		font-weight: 600;
	}
</style>
