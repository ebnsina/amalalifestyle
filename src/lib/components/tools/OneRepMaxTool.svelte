<script lang="ts">
	import './tools.css';
	import { formatPlateWeight as kg } from '$lib/format';
	import { oneRepMax, trainingPercentages } from '$lib/fitness';

	let weight = $state(60);
	let reps = $state(5);

	const max = $derived(oneRepMax(weight, Math.min(Math.max(reps, 1), 12)));
</script>

<div class="tool-layout">
	<form class="tool-panel tool-panel--sticky" onsubmit={(e) => e.preventDefault()}>
		<h2 class="t-h3">A set you have done</h2>

		<div class="pair">
			<label class="field-row">
				<span class="t-label">Weight (kg)</span>
				<input class="field" type="number" min="1" max="500" step="2.5" bind:value={weight} />
			</label>
			<label class="field-row">
				<span class="t-label">Reps</span>
				<input class="field" type="number" min="1" max="12" bind:value={reps} />
			</label>
		</div>

		<div class="stat stat--key">
			<p class="t-label">Estimated one-rep max</p>
			<p class="stat__value">{kg(max)}<span class="stat__unit">kg</span></p>
			<p class="hint">Average of the Epley and Brzycki formulas.</p>
		</div>

		<p class="hint">
			Use a set you finished with good technique and a rep or two left in you. Above about eight
			reps the estimate drifts high, and above twelve it is guessing — so the input stops there.
		</p>
	</form>

	<div class="results">
		<table class="pct">
			<caption class="t-label pct__caption">Working weights off that max</caption>
			<thead>
				<tr>
					<th scope="col" class="t-label">%</th>
					<th scope="col" class="t-label">Weight</th>
					<th scope="col" class="t-label">Reps</th>
					<th scope="col" class="t-label">What it is for</th>
				</tr>
			</thead>
			<tbody>
				{#each trainingPercentages as row (row.pct)}
					<tr>
						<td class="t-num pct__pct">{row.pct}%</td>
						<td class="t-num pct__kg">{kg((max * row.pct) / 100)} kg</td>
						<td class="t-num pct__reps">{row.reps}</td>
						<td class="pct__use">{row.use}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<p class="hint">
			Most useful work sits between 70% and 85%. If every session lives at 90% and above, you are
			testing your strength rather than building it.
		</p>
	</div>
</div>

<style>
	.pct {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	.pct__caption {
		text-align: left;
		padding-bottom: 14px;
	}

	.pct th,
	.pct td {
		padding: 14px;
		border-top: 1px solid var(--rule);
	}

	.pct :is(th, td):first-child {
		padding-inline-start: 12px;
	}

	.pct thead th {
		border-top: 0;
		padding-bottom: 10px;
	}

	.pct tbody tr {
		transition: background-color 160ms ease;
	}

	.pct tbody tr:hover {
		background: var(--surface);
	}

	.pct tbody tr:last-child td {
		border-bottom: 1px solid var(--rule);
	}

	.pct__pct {
		font-size: 13px;
		color: var(--faint);
	}

	.pct__kg {
		font-size: 16px;
		font-weight: 500;
		white-space: nowrap;
	}

	.pct__reps {
		font-size: 13px;
		color: var(--muted);
		white-space: nowrap;
	}

	.pct__use {
		font-size: 15px;
		color: var(--muted);
	}
</style>
