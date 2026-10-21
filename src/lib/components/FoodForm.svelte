<script lang="ts">
	import * as v from 'valibot';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Drawer from '#lib/sinaui/ui/Drawer.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import NumberField from '#lib/sinaui/ui/NumberField.svelte';
	import CustomSelect from '#lib/sinaui/ui/CustomSelect.svelte';
	import { categories, foodId } from '#lib/data/foods.js';
	import { locale, name as nameOf, t } from '#lib/i18n.svelte.js';
	import { num } from '#lib/format.js';
	import { kcalFromMacros } from '#lib/nutrition.js';
	import { CustomFoodSchema, type CustomFood } from '#lib/schema.js';
	import { store } from '#lib/store.svelte.js';

	// editing: the food to change; without it the form adds a new one. onsaved gets the food's id in the list.
	let { open = $bindable(false), editing, onsaved }: {
		open?: boolean; editing?: CustomFood; onsaved?: (id: string) => void;
	} = $props();

	let name = $state('');
	let category = $state<string>('meat');
	let unit = $state('');
	let grams = $state(0);
	let kcal = $state(0);
	let protein = $state(0);
	let carbs = $state(0);
	let fat = $state(0);
	let fiber = $state(0);
	let error = $state(false);
	const estimate = $derived(kcalFromMacros(protein, carbs, fat));

	// Each opening starts from the food being edited, or from an empty one.
	$effect(() => {
		if (!open) return;
		name = editing?.name ?? '';
		category = editing?.category ?? 'meat';
		unit = editing?.unit ?? '';
		grams = editing?.grams ?? 0;
		kcal = editing?.kcal ?? 0;
		protein = editing?.protein ?? 0;
		carbs = editing?.carbs ?? 0;
		fat = editing?.fat ?? 0;
		fiber = editing?.fiber ?? 0;
		error = false;
	});

	function save(e: SubmitEvent) {
		e.preventDefault();
		const parsed = v.safeParse(CustomFoodSchema, {
			// Calories left at 0 take the figure the nutrients add up to.
			id: editing?.id ?? Date.now().toString(36), name, category, unit, grams, kcal: kcal || estimate, protein, carbs, fat, fiber,
		});
		if (!parsed.success) return (error = true);
		const food = parsed.output;
		store.setCustomFoods(editing
			? store.customFoods.map((x) => (x.id === food.id ? food : x))
			: [...store.customFoods, food]);
		open = false;
		onsaved?.(foodId(food.id));
	}

	const grams$ = $derived({ locale: locale(), min: 0, max: 500, step: 1, format: { maximumFractionDigits: 1 } });
</script>

<Drawer bind:open title={editing ? t('খাবার বদলান', 'Edit food') : t('নতুন খাবার', 'New food')} closeLabel={t('বন্ধ করুন', 'Close')}>
	<form id="food-form" class="form" onsubmit={save}>
		<Input label={t('খাবারের নাম', 'Food name')} placeholder={t('যেমন: চিকেন স্যালাড', 'e.g. Chicken salad')} bind:value={name} maxlength={60} />
		<CustomSelect label={t('ধরন', 'Kind')} bind:value={category}
			options={categories.filter((k) => k.id !== 'all').map((k) => ({ value: k.id, label: `${k.emoji} ${nameOf(k)}` }))} />

		<div class="row two">
			<div class="grow">
				<Input label={t('পরিমাপ', 'Measure')} placeholder={t('বাটি, কাপ, টি…', 'bowl, cup, piece…')} bind:value={unit} maxlength={20} />
			</div>
			<div class="grow">
				<NumberField fill label={t('এক পরিমাপে কত গ্রাম', 'Grams per measure')} locale={locale()} min={0} max={2000} step={10} bind:value={grams} />
			</div>
		</div>
		<p class="xs muted note">{t('গ্রাম শুধু তথ্যের জন্য, জানা না থাকলে ০ রাখুন। এতে ক্যালরি বদলায় না।', 'Grams are just for reference; leave 0 if unsure. They don’t change the calories.')}</p>

		<p class="label">{t('পুষ্টি, এক পরিমাপে কত গ্রাম (জানা না থাকলে ০)', 'Nutrition per measure, in grams (0 if unknown)')}</p>
		<div class="grid">
			<NumberField fill label={t('আমিষ', 'Protein')} {...grams$} bind:value={protein} />
			<NumberField fill label={t('শর্করা', 'Carbs')} {...grams$} bind:value={carbs} />
			<NumberField fill label={t('চর্বি', 'Fat')} {...grams$} bind:value={fat} />
			<NumberField fill label={t('আঁশ', 'Fiber')} {...grams$} bind:value={fiber} />
		</div>

		<div class="kcal">
			<NumberField fill label={t('ক্যালরি (এক পরিমাপে)', 'Calories (per measure)')} locale={locale()} min={0} max={3000} step={10} bind:value={kcal} />
			{#if estimate}
				<div class="row suggest">
					<p class="small muted grow">{t(`আমিষ-শর্করা-চর্বি থেকে প্রায় ${num(estimate)} ক্যালরি`, `About ${estimate} kcal from protein, carbs and fat`)}</p>
					{#if kcal !== estimate}<Button size="sm" variant="secondary" onclick={() => (kcal = estimate)}>{t('এটা বসান', 'Use this')}</Button>{/if}
				</div>
			{/if}
			<p class="xs muted note">{t('প্যাকেটে ক্যালরি লেখা থাকলে সেটাই দিন। খালি (০) রাখলে ওপরের হিসাবটাই বসবে।', 'If the packet lists calories, use that. Left at 0, the figure above is used.')}</p>
		</div>

		{#if error}
			<Alert tone="warning" title={t('কিছু তথ্য বাকি', 'Something is missing')} live>
				{t('খাবারের নাম, পরিমাপ আর ক্যালরি (বা আমিষ-শর্করা-চর্বি) লিখুন।', 'Add a name, a measure and the calories (or protein, carbs and fat).')}
			</Alert>
		{/if}
	</form>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>{t('বাতিল', 'Cancel')}</Button>
		<Button type="submit" form="food-form">{t('সেভ করুন', 'Save')}</Button>
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
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.note {
		margin-top: -0.5rem;
	}
	.kcal {
		display: grid;
		gap: 0.5rem;
	}
	.kcal .note {
		margin-top: 0;
	}
	.suggest {
		gap: 0.5rem;
	}
	.label {
		margin-bottom: -0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
</style>
