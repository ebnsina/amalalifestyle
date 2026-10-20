<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import RadioCards from '#lib/sinaui/ui/RadioCards.svelte';
	import Segmented from '#lib/sinaui/ui/Segmented.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import ToggleGroup from '#lib/sinaui/ui/ToggleGroup.svelte';
	import { num, parseNum } from '#lib/format.js';
	import { activityOptions, avoidOptions, goalOptions, sexOptions } from '#lib/labels.js';
	import { dailyTarget, type Profile } from '#lib/nutrition.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { dummyProfile, store } from '#lib/store.svelte.js';

	const steps = $derived([
		{ label: t('আপনার সম্পর্কে', 'About you'), description: t('দিনে কতটুকু খাওয়া দরকার, তা আন্দাজ করতে লাগবে।', 'We need this to estimate how much you should eat in a day.') },
		{ label: t('চলাফেরা ও লক্ষ্য', 'Activity & goal'), description: t('সারাদিন কেমন কাটে আর কী চান?', 'How active are your days, and what do you want?') },
		{ label: t('খাওয়ার অভ্যাস', 'Eating habits'), description: t('প্রায় শেষ!', 'Almost done!') },
	]);

	// ponytail: prefilled with dummy values while we review the UI; start blank once data is real.
	const first = !store.profile;
	const p = store.profile ?? dummyProfile;
	const inches = Math.round(p.heightCm / 2.54);
	let step = $state(0);
	let age = $state(num(p.age));
	let ft = $state(num(Math.floor(inches / 12)));
	let inch = $state(num(inches % 12));
	let kg = $state(num(p.weightKg));
	let sex = $state<string>(p.sex);
	let activity = $state<string>(p.activity);
	let goal = $state<string>(p.goal);
	let meals = $state(String(p.mealsPerDay));
	let avoid = $state(p.avoid);
	let tried = $state(false);

	const nAge = $derived(parseNum(age)), nFt = $derived(parseNum(ft)), nIn = $derived(parseNum(inch || '0')),
		nKg = $derived(parseNum(kg));
	const errors = $derived({
		age: !(nAge >= 18 && nAge <= 90) ? t('বয়স ১৮ থেকে ৯০ বছরের মধ্যে লিখুন', 'Enter an age from 18 to 90') : undefined,
		height: !(nFt >= 4 && nFt <= 7 && nIn >= 0 && nIn < 12) ? t('উচ্চতা ঠিকমতো লিখুন (যেমন ৫ ফুট ৪ ইঞ্চি)', 'Enter your height, e.g. 5 ft 4 in') : undefined,
		weight: !(nKg >= 30 && nKg <= 250) ? t('ওজন ৩০ থেকে ২৫০ কেজির মধ্যে লিখুন', 'Enter a weight from 30 to 250 kg') : undefined,
	});
	const next = $derived({
		age: nAge, heightCm: Math.round((nFt * 12 + nIn) * 2.54), weightKg: nKg, sex, activity, goal,
		mealsPerDay: Number(meals), avoid,
	} as Profile);

	function onNext() {
		tried = true;
		if (step === 0 && (errors.age || errors.height || errors.weight)) return;
		if (step < steps.length - 1) return void step++;
		store.setProfile(next);
		if (first) goto(resolve('/(tabs)'), { replace: true });
		else history.back();
	}

	const numeric = { inputmode: 'decimal', autocomplete: 'off' } as const;
</script>

<Screen title="">
	<Progress label={t(`ধাপ ${num(step + 1)} / ${num(steps.length)}`, `Step ${step + 1} of ${steps.length}`)} value={step + 1} max={steps.length} format={() => ''} />
	{#key step}
		<div class="step enter">
			<div>
				<h2 class="big">{steps[step].label}</h2>
				<p class="muted">{steps[step].description}</p>
			</div>

			{#if step === 0}
				<Segmented label={t('আপনি', 'You are')} options={sexOptions.map((o) => ({ value: o.id, label: name(o) }))} bind:value={sex} />
				<Input label={t('বয়স', 'Age')} placeholder={t('যেমন ৩৫', 'e.g. 35')} bind:value={age} {...numeric} error={tried ? errors.age : undefined}>
					{#snippet end()}<span class="muted">{t('বছর', 'years')}</span>{/snippet}
				</Input>
				<fieldset>
					<legend>{t('উচ্চতা', 'Height')}</legend>
					<div class="row">
						<Input class="grow" label={t('ফুট', 'Feet')} hideLabel placeholder={t('ফুট', 'ft')} bind:value={ft} {...numeric}>
							{#snippet end()}<span class="muted">{t('ফুট', 'ft')}</span>{/snippet}
						</Input>
						<Input class="grow" label={t('ইঞ্চি', 'Inches')} hideLabel placeholder={t('ইঞ্চি', 'in')} bind:value={inch} {...numeric}>
							{#snippet end()}<span class="muted">{t('ইঞ্চি', 'in')}</span>{/snippet}
						</Input>
					</div>
					{#if tried && errors.height}<p class="error small">{errors.height}</p>{/if}
				</fieldset>
				<Input label={t('ওজন', 'Weight')} placeholder={t('যেমন ৬৫', 'e.g. 65')} bind:value={kg} {...numeric} error={tried ? errors.weight : undefined}>
					{#snippet end()}<span class="muted">{t('কেজি', 'kg')}</span>{/snippet}
				</Input>
			{:else if step === 1}
				<RadioCards legend={t('সারাদিন কেমন চলাফেরা করেন?', 'How active are you during the day?')} layout="list" bind:value={activity}
					options={activityOptions.map((o) => ({ value: o.id, label: `${o.emoji} ${name(o)}`, description: t(o.hintBn, o.hintEn) }))} />
				<RadioCards legend={t('আপনার লক্ষ্য', 'Your goal')} layout="list" bind:value={goal}
					options={goalOptions.map((o) => ({ value: o.id, label: `${o.emoji} ${name(o)}` }))} />
			{:else}
				<Segmented label={t('দিনে কয়বার ভরপেট খান?', 'How many full meals a day?')} bind:value={meals}
					options={[2, 3, 4, 5].map((n) => ({ value: String(n), label: t(`${num(n)} বার`, `${n}×`) }))} />
				<div class="field">
					<p class="label">{t('কিছু খান না? (না থাকলে বাদ দিন)', 'Anything you don’t eat? (skip if none)')}</p>
					<ToggleGroup label={t('যা খান না', 'Foods you avoid')} items={avoidOptions.map((o) => ({ value: o.id, label: name(o) }))} bind:value={avoid} />
				</div>
				<div class="hero">
					<p>{t('আপনার দিনের আনুমানিক লক্ষ্য', 'Your estimated daily target')}</p>
					<p class="target">{num(dailyTarget(next))}</p>
					<p>{t('ক্যালরি', 'kcal')}</p>
				</div>
				<Alert title={t('মনে রাখবেন', 'Keep in mind')}>
					{t('গর্ভবতী বা বুকের দুধ খাওয়ালে, কিংবা ডায়াবেটিস বা কিডনির সমস্যা থাকলে ডাক্তারের পরামর্শ মেনে চলুন।', 'If you are pregnant or breastfeeding, or have diabetes or kidney problems, follow your doctor’s advice.')}
				</Alert>
			{/if}
		</div>
	{/key}

	{#snippet footer()}
		{#if step > 0}<Button size="lg" variant="secondary" onclick={() => step--}>{t('আগে', 'Back')}</Button>{/if}
		<Button size="lg" onclick={onNext}>{step < steps.length - 1 ? t('পরের ধাপ', 'Next') : t('সেভ করুন', 'Save')}</Button>
	{/snippet}
</Screen>

<style>
	.step {
		display: grid;
		gap: 1.25rem;
	}
	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
		display: grid;
		gap: 0.375rem;
	}
	legend, .label {
		padding: 0;
		margin-bottom: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
	.error {
		color: var(--ui-danger);
	}
	.target {
		font-size: 2rem;
		font-weight: 600;
	}
</style>
