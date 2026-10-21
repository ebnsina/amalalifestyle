<script lang="ts">
	import * as v from 'valibot';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Drawer from '#lib/sinaui/ui/Drawer.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import NumberField from '#lib/sinaui/ui/NumberField.svelte';
	import RadioCards from '#lib/sinaui/ui/RadioCards.svelte';
	import { categories, foodId } from '#lib/data/foods.js';
	import { locale, name as nameOf, t } from '#lib/i18n.svelte.js';
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
			id: editing?.id ?? Date.now().toString(36), name, category, unit, grams, kcal, protein, carbs, fat, fiber,
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
		<RadioCards legend={t('ধরন', 'Kind')} bind:value={category}
			options={categories.filter((k) => k.id !== 'all').map((k) => ({ value: k.id, label: `${k.emoji} ${nameOf(k)}` }))} />

		<div class="row two">
			<div class="grow">
				<Input label={t('পরিমাপ', 'Measure')} placeholder={t('বাটি, কাপ, টি…', 'bowl, cup, piece…')} bind:value={unit} maxlength={20} />
			</div>
			<div class="grow">
				<NumberField label={t('গ্রাম (জানা থাকলে)', 'Grams (if known)')} locale={locale()} min={0} max={2000} step={10} bind:value={grams} />
			</div>
		</div>
		<NumberField label={t('ক্যালরি (এক পরিমাপে)', 'Calories (per measure)')} locale={locale()} min={0} max={3000} step={10} bind:value={kcal} />

		<p class="label">{t('পুষ্টি, গ্রামে (জানা না থাকলে ০)', 'Nutrition in grams (0 if unknown)')}</p>
		<div class="grid">
			<NumberField label={t('আমিষ', 'Protein')} {...grams$} bind:value={protein} />
			<NumberField label={t('শর্করা', 'Carbs')} {...grams$} bind:value={carbs} />
			<NumberField label={t('চর্বি', 'Fat')} {...grams$} bind:value={fat} />
			<NumberField label={t('আঁশ', 'Fiber')} {...grams$} bind:value={fiber} />
		</div>

		{#if error}
			<Alert tone="warning" title={t('কিছু তথ্য বাকি', 'Something is missing')} live>
				{t('খাবারের নাম, পরিমাপ আর ক্যালরি লিখুন।', 'Add a name, a measure and the calories.')}
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
	.label {
		margin-bottom: -0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
</style>
