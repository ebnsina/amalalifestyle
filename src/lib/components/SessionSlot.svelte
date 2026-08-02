<script lang="ts">
	let {
		time,
		name,
		coach = '',
		length,
		women = false
	}: { time: string; name: string; coach?: string; length: string; women?: boolean } = $props();

	// The chip carries the women-only signal, so the name does not repeat it.
	const label = $derived(name.replace(' — women only', ''));
</script>

<div class="slot" class:slot--women={women}>
	<span class="t-num slot__time">{time}</span>

	<span class="slot__body">
		<span class="slot__name">{label}</span>
		{#if women}<span class="chip">Women only</span>{/if}
		<span class="t-label slot__meta">
			{#if coach}{coach} · {/if}<span class="t-num">{length}</span>
		</span>
	</span>
</div>

<style>
	.slot {
		display: grid;
		grid-template-columns: 52px minmax(0, 1fr);
		gap: 12px;
		padding-block: 14px;
		border-bottom: 1px solid var(--rule);
		position: relative;
	}

	.slot:last-child {
		border-bottom: 0;
	}

	.slot__time {
		font-size: 13px;
		padding-top: 1px;
		color: var(--ink);
	}

	.slot__body {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 6px 8px;
	}

	.slot__name {
		font-size: 15px;
		line-height: 1.35;
	}

	.slot__meta {
		flex-basis: 100%;
	}

	/* A chip states the rule outright — clearer at a glance than an edge marker,
	   and it survives a narrow column where a border reads as an artefact. */
	.chip {
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: var(--lime);
		color: #0b0b0d;
		padding: 3px 7px;
		white-space: nowrap;
	}

	.slot--women .slot__name {
		font-weight: 500;
	}
</style>
