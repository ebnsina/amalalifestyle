<script lang="ts">
	import './tools.css';
	import { formatNumber } from '$lib/format';
	import { plateBreakdown } from '$lib/fitness';

	let target = $state(100);
	let bar = $state(20);

	const plates = $derived(plateBreakdown(target, bar));
	const totalPerSide = $derived((target - bar) / 2);
</script>

<div class="tool-layout">
	<form class="tool-panel tool-panel--sticky" onsubmit={(e) => e.preventDefault()}>
		<h2 class="t-h3">Load the bar</h2>

		<div class="pair">
			<label class="field-row">
				<span class="t-label">Target (kg)</span>
				<input class="field" type="number" min="10" max="400" step="2.5" bind:value={target} />
			</label>
			<label class="field-row">
				<span class="t-label">Bar (kg)</span>
				<select class="field" bind:value={bar}>
					<option value={20}>20 — men’s bar</option>
					<option value={15}>15 — women’s bar</option>
					<option value={10}>10 — technique bar</option>
				</select>
			</label>
		</div>

		<p class="hint">
			Plates available: 25, 20, 15, 10, 5, 2.5 and 1.25 kg. Everything loads in pairs, so the total
			has to land on a 2.5 kg step above the bar.
		</p>
	</form>

	<div class="results">
		{#if plates}
			<div class="stat stat--key">
				<p class="t-label">Per side</p>
				<p class="stat__value">{formatNumber(totalPerSide)}<span class="stat__unit">kg</span></p>
				<p class="hint">Plus the {bar} kg bar = {formatNumber(target)} kg total.</p>
			</div>

			<ul class="plates">
				{#each plates as p (p.plate)}
					<li class="plate">
						<span class="plate__size">{formatNumber(p.plate)}</span>
						<span class="t-label">kg × {p.count}</span>
					</li>
				{/each}
			</ul>

			<p class="hint">
				Load largest first, closest to the collar. Same on both ends — the list above is one side.
			</p>
		{:else}
			<p class="t-body notice">
				{target < bar
					? 'That is lighter than the bar on its own. Pick a heavier target or a lighter bar.'
					: 'That weight cannot be made from the plates on the floor. Try the nearest 2.5 kg step.'}
			</p>
		{/if}
	</div>
</div>

<style>
	.plates {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.plate {
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: var(--paper);
		border: 1px solid var(--rule);
		padding: 16px 18px 18px;
		min-width: 88px;
	}

	.plate__size {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 26px;
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}
</style>
