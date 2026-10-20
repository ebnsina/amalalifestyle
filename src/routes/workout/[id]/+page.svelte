<script lang="ts">
	import { Tick02Icon, TickDouble02Icon, Timer02Icon } from '@hugeicons/core-free-icons';
	import { page } from '$app/state';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import ToggleGroup from '#lib/sinaui/ui/ToggleGroup.svelte';
	import { setCount, workoutById } from '#lib/data/workouts.js';
	import { num, clock, dayKey } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const w = $derived(workoutById[page.params.id ?? '']);
	const finished = $derived(!!w && (store.workouts[dayKey()] ?? []).includes(w.id));
	const done = $derived((w && store.sets[dayKey()]?.[w.id]) || []);
	const total = $derived(w ? setCount(w) : 0);
	const keys = (i: number, sets: number) => Array.from({ length: sets }, (_, j) => `${i}-${j}`);

	// Rest timer: when it ends, and the clock it counts down against.
	let until = $state(0);
	let now = $state(Date.now());
	const left = $derived(Math.max(0, Math.ceil((until - now) / 1000)));
	$effect(() => {
		if (!until) return;
		const t = setInterval(() => {
			now = Date.now();
			if (now >= until) until = 0;
		}, 250);
		return () => clearInterval(t);
	});

	// A newly ticked set restarts the rest timer from full.
	function setDone(i: number, sets: number, on: string[]) {
		const mine = keys(i, sets);
		const next = [...done.filter((k) => !mine.includes(k)), ...on];
		const added = next.length > done.length;
		store.setSets(w.id, next);
		if (added && w.rest && next.length < total) {
			now = Date.now();
			until = now + w.rest * 1000;
		}
	}
	function finish() {
		if (!finished) store.toggleWorkout(w.id);
		history.back();
	}
</script>

{#if !w}
	<Screen title="">
		<EmptyState title={t('এই ব্যায়ামটি খুঁজে পাওয়া যায়নি', 'This workout wasn’t found')} />
	</Screen>
{:else}
	<Screen title="">
		<div class="head">
			<Plate emoji={w.emoji} />
			<h2 class="big">{name(w)}</h2>
			<p class="small muted">{t(`প্রায় ${num(w.minutes)} মিনিট`, `About ${w.minutes} min`)}{w.rest ? t(` · সেটের মাঝে ${num(w.rest)} সেকেন্ড বিশ্রাম`, ` · ${w.rest} s rest between sets`) : ''}</p>
		</div>

		<div>
			<div class="row between">
				<b class="small">{finished ? t('আজ শেষ করেছেন ✓', 'Finished today ✓') : done.length ? t('চলছে', 'In progress') : t('যেটা করবেন, টিক দিন', 'Tick each set as you do it')}</b>
				<span class="small muted">{num(done.length)} / {num(total)} {t('সেট', 'sets')}</span>
			</div>
			<div class="bar"><span style:width="{(done.length / total) * 100}%"></span></div>
		</div>

		{#each w.exercises as e, i (i)}
			{@const mine = keys(i, e.sets)}
			<Card class="enter" style="--i: {i}">
				<div class="exercise">
					<span class="num" class:complete={mine.every((k) => done.includes(k))}>{num(i + 1)}</span>
					<div class="grow">
						<div class="row between"><b>{name(e)}</b><b class="small accent">{e.sets > 1 ? `${num(e.sets)} ${t('সেট', 'sets')} × ${t(e.repsBn, e.repsEn)}` : t(e.repsBn, e.repsEn)}</b></div>
						<p class="small muted">{t(e.tipBn, e.tipEn)}</p>
						<ToggleGroup size="sm" label={t(`${e.bn}: শেষ হওয়া সেট`, `${e.en}: sets done`)}
							items={mine.map((k, j) => ({ value: k, label: e.sets > 1 ? t(`সেট ${num(j + 1)}`, `Set ${j + 1}`) : t('করেছি', 'Done') }))}
							bind:value={() => done.filter((k) => mine.includes(k)), (on) => setDone(i, e.sets, on)} />
					</div>
				</div>
			</Card>
		{/each}

		<Alert title={t('ভঙ্গি আগে', 'Form first')}>{t('ওজনের চেয়ে সঠিক ভঙ্গি বেশি জরুরি। সব সেট না পারলে যতটুকু পেরেছেন ততটুকুই শেষ করুন — সেটাও গোনা হবে।', 'Good form matters more than weight. If you can’t do every set, finish with what you did — it still counts.')}</Alert>

		{#snippet footer()}
			{#if until}
				<div class="rest" role="timer" aria-live="off">
					<Icon icon={Timer02Icon} size={20} />
					<span class="grow"><span class="xs muted">{t('বিশ্রাম', 'Rest')}</span><br /><b class="num">{clock(left)}</b></span>
					<Button variant="ghost" size="sm" onclick={() => (until += 15000)}>{t('+১৫ সে.', '+15 s')}</Button>
					<Button variant="secondary" size="sm" onclick={() => (until = 0)}>{t('বাদ দিন', 'Skip')}</Button>
				</div>
			{:else if finished}
				<Button size="lg" variant="ghost" onclick={() => store.toggleWorkout(w.id)}>{t('শেষ হয়নি — আবার চালু করুন', 'Not finished — reopen')}</Button>
			{:else}
				{#if done.length < total}
					<Button size="lg" variant="secondary" onclick={() => store.setSets(w.id, w.exercises.flatMap((e, i) => keys(i, e.sets)))}>
						<Icon icon={TickDouble02Icon} size={20} /> {t('সব টিক দিন', 'Tick all')}
					</Button>
				{/if}
				<Button size="lg" disabled={!done.length} onclick={finish}><Icon icon={Tick02Icon} size={20} /> {t('শেষ করুন', 'Finish')}</Button>
			{/if}
		{/snippet}
	</Screen>
{/if}

<style>
	.head {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		text-align: center;
	}
	.between {
		justify-content: space-between;
	}
	b {
		font-weight: 600;
	}
	.accent {
		color: var(--ui-accent);
		flex: none;
	}
	.exercise {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}
	.exercise .grow {
		display: grid;
		gap: 0.5rem;
	}
	.num {
		flex: none;
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--ui-accent);
		font-size: 0.875rem;
		font-weight: 600;
	}
	.num.complete {
		background: var(--ui-accent);
		color: var(--ui-on-accent);
	}
	.rest {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 5px 5px 5px 1rem;
		border-radius: 999px;
		background: var(--blue-soft);
		color: var(--blue);
	}
</style>
