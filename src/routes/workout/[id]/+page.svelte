<script lang="ts">
	import Guide from '#lib/components/Guide.svelte';
	import { PencilEdit02Icon, Tick02Icon, TickDouble02Icon, Timer02Icon } from '@hugeicons/core-free-icons';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import WorkoutForm from '#lib/components/WorkoutForm.svelte';
	import ConfirmButton from '#lib/sinaui/ui/ConfirmButton.svelte';
	import { page } from '$app/state';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import ToggleGroup from '#lib/sinaui/ui/ToggleGroup.svelte';
	import { setCount } from '#lib/data/workouts.js';
	import { num, clock, dayKey } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const w = $derived(store.allWorkouts.find((x) => x.id === page.params.id));
	// The saved routine behind one of the person's own workouts, for editing and removing.
	const mine = $derived(w?.custom ? store.customWorkouts.find((c) => `my-${c.id}` === w.id) : undefined);
	let editing = $state(false);
	function remove() {
		store.setCustomWorkouts(store.customWorkouts.filter((c) => c.id !== mine?.id));
		goto(resolve('/fitness'), { replace: true });
	}
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
		if (!w) return;
		const these = keys(i, sets);
		const next = [...done.filter((k) => !these.includes(k)), ...on];
		const added = next.length > done.length;
		store.setSets(w.id, next);
		if (added && w.rest && next.length < total) {
			now = Date.now();
			until = now + w.rest * 1000;
		}
	}
	function finish() {
		if (w && !finished) store.toggleWorkout(w.id);
		history.back();
	}
</script>

{#if !w}
	<Screen title="">
		<EmptyState title={t('এই ব্যায়ামটি খুঁজে পাওয়া যায়নি', 'This workout wasn’t found')} />
	</Screen>
{:else}
	<Screen title="">
		<Guide id="workout" steps={[
			t('প্রতিটি সেট শেষ হলে তার বোতামে চাপ দিন। বিশ্রামের টাইমার শুরু হবে।', 'Tap a set’s button when you finish it. The rest timer starts.'),
			t('সব সেট না পারলেও সমস্যা নেই। যতটুকু করেছেন, “শেষ করুন” চাপলে সেটাই গোনা হবে।', 'Couldn’t do every set? Tap “Finish” and what you did still counts.'),
		]} />

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
			{@const these = keys(i, e.sets)}
			<Card class="enter" style="--i: {i}">
				<div class="exercise">
					<span class="num" class:complete={these.every((k) => done.includes(k))}>{num(i + 1)}</span>
					<div class="grow">
						<div class="row between"><b>{name(e)}</b><b class="small accent">{e.sets > 1 ? `${num(e.sets)} ${t('সেট', 'sets')} × ${t(e.repsBn, e.repsEn)}` : t(e.repsBn, e.repsEn)}{e.kg ? ` · ${num(e.kg)} ${t('কেজি', 'kg')}` : ''}</b></div>
						{#if e.tipBn}<p class="small muted">{t(e.tipBn, e.tipEn)}</p>{/if}
						<ToggleGroup size="sm" label={t(`${e.bn}: শেষ হওয়া সেট`, `${e.en}: sets done`)}
							items={these.map((k, j) => ({ value: k, label: e.sets > 1 ? t(`সেট ${num(j + 1)}`, `Set ${j + 1}`) : t('করেছি', 'Done') }))}
							bind:value={() => done.filter((k) => these.includes(k)), (on) => setDone(i, e.sets, on)} />
					</div>
				</div>
			</Card>
		{/each}

		{#if mine}
			<div class="actions">
				<ConfirmButton size="sm" onconfirm={remove} confirm={t('সত্যিই মুছবেন?', 'Delete it?')} done={t('মোছা হয়েছে', 'Deleted')}>{t('রুটিনটা মুছুন', 'Delete routine')}</ConfirmButton>
				<Button size="sm" variant="secondary" onclick={() => (editing = true)}><Icon icon={PencilEdit02Icon} size={16} /> {t('বদলান', 'Edit')}</Button>
			</div>
			<WorkoutForm bind:open={editing} editing={mine} />
		{/if}

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
