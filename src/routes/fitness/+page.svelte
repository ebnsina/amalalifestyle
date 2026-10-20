<script lang="ts">
	import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { setCount, workouts, type Workout } from '#lib/data/workouts.js';
	import { num, dayKey, lastDays } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const today = dayKey();
	const activeDays = $derived(lastDays(7).filter((d) => store.workouts[d]?.length).length);
</script>

{#snippet row(w: Workout, i: number)}
	{@const n = store.sets[today]?.[w.id]?.length ?? 0}
	<a class="workout enter" style="--i: {i}" href={resolve('/workout/[id]', { id: w.id })}>
		<Plate emoji={w.emoji} size={44} />
		<span class="grow"><b>{name(w)}</b><br /><span class="small muted">{num(w.minutes)} {t('মিনিট', 'min')} · {t(w.subBn, w.subEn)}</span></span>
		{#if store.workouts[today]?.includes(w.id)}<Badge tone="accent">{t('আজ শেষ', 'Done today')}</Badge>
		{:else if n}<Badge tone="warning" icon={false}>{num(n)}/{num(setCount(w))} {t('সেট', 'sets')}</Badge>
		{:else}<Icon icon={ArrowRight01Icon} size={18} />{/if}
	</a>
{/snippet}

<Screen title={t('ফিটনেস গাইড', 'Fitness guide')}>
	<Card class="center">
		<p class="big num" style:color="var(--ui-accent)">{num(activeDays)} / {num(7)} {t('দিন', 'days')}</p>
		<p class="small muted">{t('গত সাত দিনে ব্যায়াম করেছেন', 'with exercise in the last seven days')}</p>
	</Card>

	<h2 class="section">{t('ঘরে', 'At home')}</h2>
	{#each workouts.filter((w) => w.place === 'home') as w, i (w.id)}{@render row(w, i)}{/each}
	<h2 class="section">{t('জিমে', 'At the gym')}</h2>
	{#each workouts.filter((w) => w.place === 'gym') as w, i (w.id)}{@render row(w, i + 3)}{/each}

	<Alert title={t('নিরাপদে ব্যায়াম', 'Exercise safely')}>
		{t('সপ্তাহে অন্তত ১৫০ মিনিট হাঁটা বা হালকা ব্যায়াম ভালো। নতুন হলে হালকা দিয়ে শুরু করুন। বুকে ব্যথা, মাথা ঘোরা বা শ্বাসকষ্ট হলে থামুন। হার্ট, ডায়াবেটিস বা অন্য অসুখ থাকলে আগে ডাক্তারের পরামর্শ নিন।', 'Aim for at least 150 minutes of walking or light exercise a week. If you’re new, start easy. Stop if you feel chest pain, dizziness or shortness of breath. With heart disease, diabetes or another condition, ask your doctor first.')}
	</Alert>
</Screen>

<style>
	.workout {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: calc(var(--ui-radius) * 1.5);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		color: inherit;
		text-decoration: none;
	}
	.workout b {
		font-weight: 600;
	}
</style>
