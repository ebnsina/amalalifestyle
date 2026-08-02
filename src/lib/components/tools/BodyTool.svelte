<script lang="ts">
	import './tools.css';
	import { formatNumber as n } from '$lib/format';
	import ProfileForm from './ProfileForm.svelte';
	import Icon from '../Icon.svelte';
	import { profile, profileValid } from '$lib/state/profile.svelte';
	import {
		advisoryFor,
		bmi,
		bmiCategory,
		healthyWeightRange,
		navyBodyFat,
		whtr,
		whtrCategory
	} from '$lib/fitness';

	const valid = $derived(profileValid());
	const bmiValue = $derived(valid ? bmi(profile.weightKg, profile.heightCm) : 0);
	const cat = $derived(bmiCategory(bmiValue, profile.standard));
	const range = $derived(healthyWeightRange(profile.heightCm, profile.standard));
	const advisory = $derived(
		advisoryFor({ age: profile.age, bmiValue, pregnant: profile.pregnant })
	);

	const ratio = $derived(profile.waistCm ? whtr(profile.waistCm, profile.heightCm) : null);
	const ratioCat = $derived(ratio ? whtrCategory(ratio) : null);

	const fat = $derived(
		profile.waistCm && profile.neckCm && (profile.sex === 'male' || profile.hipCm)
			? navyBodyFat(
					profile.sex,
					profile.heightCm,
					profile.neckCm,
					profile.waistCm,
					profile.hipCm ?? undefined
				)
			: null
	);
</script>

<div class="tool-layout">
	<ProfileForm tape />

	<div class="results">
		{#if !valid}
			<p class="t-body notice">Enter a height and weight to see your numbers.</p>
		{:else}
			<div class="stat-grid stat-grid--2">
				<div class="stat stat--key stat--wide">
					<p class="t-label">Body mass index</p>
					<p class="stat__value">{n(bmiValue, 1)}</p>
					<p class="tag tag--{cat.tone}">{cat.label}</p>
					<p class="hint">
						A healthy weight at {profile.heightCm} cm is {n(range.min, 1)}–{n(range.max, 1)} kg,
						using the {profile.standard === 'asian' ? 'South Asian' : 'international'} cut-offs.
					</p>
				</div>

				{#if ratio && ratioCat}
					<div class="stat">
						<p class="t-label">Waist to height</p>
						<p class="stat__value">{n(ratio, 2)}</p>
						<p class="tag tag--{ratioCat.tone}">{ratioCat.label}</p>
						<p class="hint">Keep your waist under half your height.</p>
					</div>
				{/if}

				{#if fat !== null}
					<div class="stat">
						<p class="t-label">Body fat (estimate)</p>
						<p class="stat__value">{n(fat, 1)}<span class="stat__unit">%</span></p>
						<p class="hint">US Navy tape method — roughly ±3–4% against a scan.</p>
					</div>
				{/if}
			</div>

			{#if advisory}
				<div class="advisory" class:advisory--block={advisory.level === 'block'}>
					<Icon name="target" size={18} />
					<p class="t-body">{advisory.text}</p>
				</div>
			{/if}

			{#if !ratio}
				<p class="hint">
					Add a waist measurement in the panel and you will also get your waist-to-height ratio,
					which predicts health risk better than BMI does.
				</p>
			{/if}

			<div class="explain">
				<h3 class="t-h3">What BMI cannot tell you</h3>
				<p class="t-body explain__body">
					BMI is your weight divided by your height squared, and that is all it is. It cannot tell
					muscle from fat, so a trained lifter often reads as overweight while being nothing of the
					sort. Use it as one number among several, not as a verdict.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.explain {
		border-top: 1px solid var(--rule);
		padding-top: 24px;
	}

	.explain__body {
		margin-top: 12px;
		color: var(--muted);
	}
</style>
