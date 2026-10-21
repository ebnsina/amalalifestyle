<script lang="ts">
	import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
	import * as v from 'valibot';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Drawer from '#lib/sinaui/ui/Drawer.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import NumberField from '#lib/sinaui/ui/NumberField.svelte';
	import Segmented from '#lib/sinaui/ui/Segmented.svelte';
	import { locale, t } from '#lib/i18n.svelte.js';
	import { CustomWorkoutSchema, type CustomWorkout } from '#lib/schema.js';
	import { store } from '#lib/store.svelte.js';

	// editing: the routine to change; without it the form makes a new one.
	let { open = $bindable(false), editing, onsaved }: {
		open?: boolean; editing?: CustomWorkout; onsaved?: (w: CustomWorkout) => void;
	} = $props();

	const blank = () => ({ name: '', sets: 3, reps: '', kg: 0 });
	let name = $state('');
	let place = $state('gym');
	let minutes = $state(30);
	let rest = $state(60);
	let exercises = $state([blank()]);
	let error = $state(false);

	// Each opening starts from the routine being edited, or from an empty one.
	$effect(() => {
		if (!open) return;
		name = editing?.name ?? '';
		place = editing?.place ?? 'gym';
		minutes = editing?.minutes ?? 30;
		rest = editing?.rest ?? 60;
		exercises = editing ? editing.exercises.map((e) => ({ ...e, kg: e.kg ?? 0 })) : [blank()];
		error = false;
	});

	function save(e: SubmitEvent) {
		e.preventDefault();
		const parsed = v.safeParse(CustomWorkoutSchema, {
			id: editing?.id ?? Date.now().toString(36), name, place, minutes, rest,
			// 0 kg means bodyweight or not tracked, so it isn't saved.
			exercises: exercises.filter((x) => x.name.trim() || x.reps.trim()).map((x) => ({ ...x, kg: x.kg || undefined })),
		});
		if (!parsed.success) return (error = true);
		const w = parsed.output;
		store.setCustomWorkouts(editing
			? store.customWorkouts.map((x) => (x.id === w.id ? w : x))
			: [...store.customWorkouts, w]);
		open = false;
		onsaved?.(w);
	}
</script>

<Drawer bind:open title={editing ? t('রুটিন বদলান', 'Edit routine') : t('নতুন রুটিন', 'New routine')} closeLabel={t('বন্ধ করুন', 'Close')}>
	<form id="workout-form" class="form" onsubmit={save}>
		<Input label={t('রুটিনের নাম', 'Routine name')} placeholder={t('যেমন: পায়ের দিন', 'e.g. Leg day')} bind:value={name} maxlength={60} />
		<Segmented label={t('কোথায়', 'Where')} bind:value={place}
			options={[{ value: 'gym', label: t('জিমে', 'At the gym') }, { value: 'home', label: t('ঘরে', 'At home') }]} />
		<div class="row two">
			<div class="grow"><NumberField label={t('মোট সময় (মিনিট)', 'Total time (min)')} locale={locale()} min={5} max={180} step={5} bind:value={minutes} /></div>
			<div class="grow"><NumberField label={t('বিশ্রাম (সেকেন্ড)', 'Rest (sec)')} locale={locale()} min={0} max={300} step={15} bind:value={rest} /></div>
		</div>

		<p class="label">{t('ব্যায়ামগুলো', 'Exercises')}</p>
		{#each exercises as ex, i (i)}
			<div class="exercise">
				<div class="row">
					<Input class="grow" label={t(`ব্যায়াম ${i + 1}`, `Exercise ${i + 1}`)} hideLabel
						placeholder={t('যেমন: বেঞ্চ প্রেস', 'e.g. Bench press')} bind:value={ex.name} maxlength={60} />
					{#if exercises.length > 1}
						<Button variant="ghost" size="sm" square aria-label={t('এই ব্যায়ামটি সরান', 'Remove this exercise')}
							onclick={() => (exercises = exercises.filter((_, j) => j !== i))}><Icon icon={Cancel01Icon} size={16} /></Button>
					{/if}
				</div>
				<div class="row two">
					<div class="grow"><NumberField label={t('সেট', 'Sets')} locale={locale()} min={1} max={10} bind:value={ex.sets} /></div>
					<div class="grow"><Input label={t('প্রতি সেটে', 'Per set')} placeholder={t('যেমন: ১০টি', 'e.g. 10 reps')} bind:value={ex.reps} maxlength={20} /></div>
				</div>
				<NumberField label={t('ওজন (কেজি, না থাকলে ০)', 'Weight (kg, 0 if none)')} locale={locale()} min={0} max={500} step={2.5}
					format={{ maximumFractionDigits: 1 }} bind:value={ex.kg} />
			</div>
		{/each}
		{#if exercises.length < 20}
			<div class="actions">
				<Button variant="secondary" size="sm" onclick={() => (exercises = [...exercises, blank()])}>
					<Icon icon={Add01Icon} size={16} /> {t('আরেকটি ব্যায়াম', 'Another exercise')}
				</Button>
			</div>
		{/if}

		{#if error}
			<Alert tone="warning" title={t('কিছু তথ্য বাকি', 'Something is missing')} live>
				{t('রুটিনের নাম, আর প্রতিটি ব্যায়ামের নাম ও প্রতি সেটে কতবার লিখুন।', 'Add a routine name, and a name and amount per set for each exercise.')}
			</Alert>
		{/if}
	</form>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>{t('বাতিল', 'Cancel')}</Button>
		<Button type="submit" form="workout-form">{t('সেভ করুন', 'Save')}</Button>
	{/snippet}
</Drawer>

<style>
	.form {
		display: grid;
		gap: 1rem;
	}
	.two {
		align-items: end;
	}
	.exercise {
		display: grid;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: var(--ui-radius);
		background: var(--ui-bg);
	}
	.label {
		margin-bottom: -0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
</style>
