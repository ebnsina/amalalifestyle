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
		macrosFor,
		mealPlan,
		tdee
	} from '$lib/fitness';

	const valid = $derived(profileValid());
	const bmiValue = $derived(valid ? bmi(profile.weightKg, profile.heightCm) : 0);
	const advisory = $derived(
		advisoryFor({ age: profile.age, bmiValue, pregnant: profile.pregnant })
	);
	const blocked = $derived(advisory?.level === 'block');

	const macros = $derived.by(() => {
		const b = bmr(profile.weightKg, profile.heightCm, profile.age, profile.sex);
		const f = activityLevels.find((a) => a.id === profile.activity)!.factor;
		return macrosFor(profile.weightKg, goalCalories(tdee(b, f), profile.goal), profile.goal);
	});

	const plan = $derived(mealPlan(macros, profile.mealCount));
</script>

<div class="tool-layout">
	<ProfileForm energy meals />

	<div class="results">
		{#if !valid}
			<p class="t-body notice">Enter a height and weight to build a day.</p>
		{:else if blocked}
			<div class="advisory advisory--block">
				<Icon name="target" size={18} />
				<p class="t-body">{advisory?.text}</p>
			</div>
		{:else}
			<p class="t-body intro">
				Your protein and carbohydrate split across {profile.mealCount} meals and turned into portions
				of food you can buy locally. Swap any item for something similar — the amount is the part that
				matters, not the ingredient.
			</p>

			<div class="meals">
				{#each plan as m (m.slot)}
					<article class="meal">
						<p class="t-num meal__time">{m.time}</p>
						<h3 class="t-h3 meal__slot">{m.slot}</h3>

						<dl class="meal__items">
							{#each [...m.protein, ...m.carbs] as item (item.name)}
								<div class="meal__item">
									<dt>{item.name}</dt>
									<dd class="t-num">{n(item.grams)}g</dd>
								</div>
							{/each}
							<div class="meal__item meal__item--sum">
								<dt>Protein · carbs</dt>
								<dd class="t-num">{n(m.proteinTotal)}g · {n(m.carbTotal)}g</dd>
							</div>
						</dl>

						<p class="hint meal__note">{m.note}</p>
					</article>
				{/each}
			</div>

			<p class="hint">
				Plus vegetables at every meal. They barely move these numbers and they are the thing most
				people are genuinely short of. Carbohydrate is weighted towards the meals around training and
				eased off at the one furthest from it.
			</p>
		{/if}
	</div>
</div>

<style>
	.intro {
		color: var(--muted);
	}

	.meals {
		display: grid;
		gap: 12px;
	}

	@media (min-width: 620px) {
		.meals {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.meal {
		background: var(--paper);
		border: 1px solid var(--rule);
		padding: 22px 20px 26px;
	}

	.meal__time {
		font-size: 12px;
		color: var(--faint);
	}

	.meal__slot {
		margin-top: 8px;
	}

	.meal__items {
		margin-top: 20px;
	}

	.meal__item {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		padding-block: 11px;
		border-top: 1px solid var(--rule-strong);
		font-size: 15px;
	}

	.meal__item--sum {
		color: var(--faint);
		font-size: 13px;
	}

	.meal__note {
		margin-top: 16px;
	}
</style>
