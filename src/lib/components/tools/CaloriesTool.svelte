<script lang="ts">
	import './tools.css';
	import { formatNumber as n } from '$lib/format';
	import ProfileForm from './ProfileForm.svelte';
	import Icon from '../Icon.svelte';
	import { profile, profileValid } from '$lib/state/profile.svelte';
	import {
		activityLevels,
		advisoryFor,
		bmi,
		bmr,
		goalCalories,
		goals,
		macrosFor,
		proteinPerMeal,
		tdee,
		waterMl,
		weeklyWeightChangeKg
	} from '$lib/fitness';

	const valid = $derived(profileValid());
	const bmiValue = $derived(valid ? bmi(profile.weightKg, profile.heightCm) : 0);
	const advisory = $derived(
		advisoryFor({ age: profile.age, bmiValue, pregnant: profile.pregnant })
	);
	const blocked = $derived(advisory?.level === 'block');

	const bmrValue = $derived(
		valid ? bmr(profile.weightKg, profile.heightCm, profile.age, profile.sex) : 0
	);
	const factor = $derived(activityLevels.find((a) => a.id === profile.activity)!.factor);
	const maintenance = $derived(tdee(bmrValue, factor));
	const target = $derived(goalCalories(maintenance, profile.goal));
	const macros = $derived(macrosFor(profile.weightKg, target, profile.goal));
	const perMeal = $derived(proteinPerMeal(profile.weightKg, profile.mealCount, macros.protein));
	const drift = $derived(weeklyWeightChangeKg(target, maintenance));
	const water = $derived(waterMl(profile.weightKg));
</script>

<div class="tool-layout">
	<ProfileForm energy meals />

	<div class="results">
		{#if !valid}
			<p class="t-body notice">Enter a height and weight to see your numbers.</p>
		{:else if blocked}
			<div class="advisory advisory--block">
				<Icon name="target" size={18} />
				<p class="t-body">{advisory?.text}</p>
			</div>
		{:else}
			{#if advisory}
				<div class="advisory">
					<Icon name="target" size={18} />
					<p class="t-body">{advisory.text}</p>
				</div>
			{/if}

			<div class="stat-grid stat-grid--3">
				<div class="stat">
					<p class="t-label">Resting burn</p>
					<p class="stat__value">{n(bmrValue)}</p>
					<p class="hint">kcal a day doing nothing at all</p>
				</div>
				<div class="stat">
					<p class="t-label">Maintenance</p>
					<p class="stat__value">{n(maintenance)}</p>
					<p class="hint">kcal to stay the same weight</p>
				</div>
				<div class="stat stat--key">
					<p class="t-label">Your target</p>
					<p class="stat__value">{n(target)}</p>
					<p class="hint">{goals.find((g) => g.id === profile.goal)!.note}</p>
				</div>
			</div>

			{#if Math.abs(drift) > 0.01}
				<p class="hint drift">
					At that gap you would expect to {drift < 0 ? 'lose' : 'gain'}
					roughly <strong>{n(Math.abs(drift), 2)} kg a week</strong>. Real rates run slower than the
					arithmetic as you get leaner — treat it as a direction, not a schedule.
				</p>
			{/if}

			<div class="macros">
				<h3 class="t-h3">Daily macros</h3>
				<div class="macro-row">
					{#each [['Protein', macros.protein, 'g'], ['Carbs', macros.carbs, 'g'], ['Fat', macros.fat, 'g'], ['Water', water / 1000, 'L']] as [label, value, unit] (label)}
						<div class="macro">
							<p class="t-label">{label}</p>
							<p class="macro__value">
								{n(Number(value), unit === 'L' ? 1 : 0)}<span class="stat__unit">{unit}</span>
							</p>
						</div>
					{/each}
				</div>
				<p class="hint macros__note">
					Around <strong>{n(perMeal)}g of protein per meal</strong> across {profile.mealCount} meals.
					Protein is set from your bodyweight, fat is held steady for hormonal health, and
					carbohydrate takes whatever energy is left over.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.macros h3 {
		padding-bottom: 18px;
	}

	.macro-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		background: var(--rule);
		border-block: 1px solid var(--rule);
	}

	@media (min-width: 560px) {
		.macro-row {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.macro {
		background: var(--paper);
		padding: 18px 16px 20px 0;
	}

	.macro:not(:first-child) {
		padding-inline-start: 16px;
	}

	.macro__value {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 28px;
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		margin-top: 10px;
	}

	.macros__note,
	.drift {
		margin-top: 18px;
	}

	.macros__note strong,
	.drift strong {
		color: var(--ink);
		font-weight: 500;
	}
</style>
