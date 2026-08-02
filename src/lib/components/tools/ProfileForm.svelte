<script lang="ts">
	import { profile } from '$lib/state/profile.svelte';
	import { activityLevels, goals, type ActivityId, type BmiStandard, type Goal, type Sex } from '$lib/fitness';

	/** Which blocks this tool actually needs — no tool asks for more than it uses. */
	let {
		energy = false,
		tape = false,
		meals = false
	}: { energy?: boolean; tape?: boolean; meals?: boolean } = $props();
</script>

<form class="tool-panel tool-panel--sticky" onsubmit={(e) => e.preventDefault()}>
	<h2 class="t-h3">Your details</h2>

	<div class="field-row">
		<span class="t-label" id="sex-label">Sex</span>
		<div class="choice" role="group" aria-labelledby="sex-label">
			{#each [['male', 'Male'], ['female', 'Female']] as [id, label] (id)}
				<button
					type="button"
					class="choice__btn"
					class:is-on={profile.sex === id}
					aria-pressed={profile.sex === id}
					onclick={() => (profile.sex = id as Sex)}>{label}</button
				>
			{/each}
		</div>
	</div>

	<div class="pair">
		<label class="field-row">
			<span class="t-label">Age</span>
			<input class="field" type="number" min="12" max="100" bind:value={profile.age} />
		</label>
		<label class="field-row">
			<span class="t-label">Height (cm)</span>
			<input class="field" type="number" min="100" max="230" bind:value={profile.heightCm} />
		</label>
		<label class="field-row">
			<span class="t-label">Weight (kg)</span>
			<input
				class="field"
				type="number"
				min="25"
				max="300"
				step="0.5"
				bind:value={profile.weightKg}
			/>
		</label>
		{#if meals}
			<label class="field-row">
				<span class="t-label">Meals a day</span>
				<select class="field" bind:value={profile.mealCount}>
					<option value={3}>3 meals</option>
					<option value={4}>4 meals</option>
				</select>
			</label>
		{/if}
	</div>

	{#if energy}
		<label class="field-row">
			<span class="t-label">How active are you</span>
			<select class="field" bind:value={profile.activity}>
				{#each activityLevels as a (a.id)}
					<option value={a.id}>{a.label}</option>
				{/each}
			</select>
		</label>

		<div class="field-row">
			<span class="t-label" id="goal-label">Goal</span>
			<div class="choice" role="group" aria-labelledby="goal-label">
				{#each goals as g (g.id)}
					<button
						type="button"
						class="choice__btn"
						class:is-on={profile.goal === g.id}
						aria-pressed={profile.goal === g.id}
						onclick={() => (profile.goal = g.id as Goal)}>{g.label}</button
					>
				{/each}
			</div>
		</div>
	{/if}

	{#if !energy}
		<div class="field-row">
			<span class="t-label" id="std-label">BMI cut-offs</span>
			<div class="choice" role="group" aria-labelledby="std-label">
				<button
					type="button"
					class="choice__btn"
					class:is-on={profile.standard === 'asian'}
					aria-pressed={profile.standard === 'asian'}
					onclick={() => (profile.standard = 'asian' as BmiStandard)}>South Asian</button
				>
				<button
					type="button"
					class="choice__btn"
					class:is-on={profile.standard === 'who'}
					aria-pressed={profile.standard === 'who'}
					onclick={() => (profile.standard = 'who' as BmiStandard)}>International</button
				>
			</div>
			<p class="hint">
				Risk rises at a lower BMI in South Asian populations, so the WHO puts overweight at 23 rather
				than 25.
			</p>
		</div>
	{/if}

	<label class="check">
		<input type="checkbox" bind:checked={profile.pregnant} />
		<span>I am pregnant or breastfeeding</span>
	</label>

	{#if tape}
		<div class="tape">
			<p class="t-label">Tape measurements</p>
			<p class="hint tape__hint">
				Optional. Measure the waist at the navel and the neck just below the larynx.
			</p>
			<div class="pair">
				<label class="field-row">
					<span class="t-label">Waist (cm)</span>
					<input class="field" type="number" min="40" max="200" bind:value={profile.waistCm} />
				</label>
				<label class="field-row">
					<span class="t-label">Neck (cm)</span>
					<input class="field" type="number" min="20" max="80" bind:value={profile.neckCm} />
				</label>
				{#if profile.sex === 'female'}
					<label class="field-row">
						<span class="t-label">Hip (cm)</span>
						<input class="field" type="number" min="50" max="200" bind:value={profile.hipCm} />
					</label>
				{/if}
			</div>
		</div>
	{/if}

	<p class="hint">Nothing is sent anywhere. These numbers stay in this browser tab.</p>
</form>

<style>
	.check {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 15px;
		color: var(--muted);
	}

	.check input {
		width: 20px;
		height: 20px;
		accent-color: var(--lime);
	}

	.tape {
		border-top: 1px solid var(--rule-strong);
		padding-top: 20px;
		display: grid;
		gap: 14px;
	}

	.tape__hint {
		margin-top: -4px;
	}
</style>
