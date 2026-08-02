<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { site } from '$lib/data/site';

	let {
		name,
		price,
		period,
		summary,
		includes,
		excludes = [],
		featured = false,
		cta
	}: {
		name: string;
		price: string;
		period: string;
		summary: string;
		includes: string[];
		excludes?: string[];
		featured?: boolean;
		cta: string;
	} = $props();
</script>

<article class="plan" class:plan--featured={featured}>
	<!--
		The flag's row is claimed on every card, empty or not. Without the
		placeholder the unflagged cards would start their name a row early and
		the whole comparison would sit one step out of line.
	-->
	{#if featured}
		<p class="plan__flag t-label-sm">Most people start here</p>
	{:else}
		<span class="plan__flag-spacer" aria-hidden="true"></span>
	{/if}

	<h3 class="t-h3">{name}</h3>
	<p class="t-body plan__summary">{summary}</p>

	<p class="plan__price">
		<span class="plan__currency">{site.currency}</span><span class="t-num plan__amount">{price}</span>
		<span class="t-label plan__period">{period}</span>
	</p>

	<ul class="plan__list">
		{#each includes as item (item)}
			<li class="plan__item"><Icon name="check" size={15} /> <span>{item}</span></li>
		{/each}
		{#each excludes as item (item)}
			<li class="plan__item plan__item--out"><Icon name="close" size={15} /> <span>{item}</span></li>
		{/each}
	</ul>

	<div class="plan__cta">
		<Button href="/contact" variant={featured ? 'solid' : 'ghost'} arrow>{cta}</Button>
	</div>
</article>

<style>
	/* Lime laid down thin on the outer two, at full strength on the one most
	   people take. Same hue throughout, so the recommendation reads as a step
	   up in the same system rather than a different kind of card. */
	.plan {
		display: flex;
		flex-direction: column;
		background: var(--lime-wash);
		padding: 34px 30px 36px;
	}

	.plan--featured {
		background: var(--lime);
		color: #0b0b0d;
	}

	/* Each card claims the six rows its parent declares, so every band of
	   content lines up across the three. */
	@media (min-width: 900px) {
		.plan {
			display: grid;
			grid-row: span 6;
			grid-template-rows: subgrid;
		}
	}

	/*
		Both axes, because the card switches layout mode at 900px: align-self
		holds the chip to its own width while the card is a flex column, and
		justify-self does it once the card becomes a grid. With only the first
		of the two, the flag stretched into a full-width bar on desktop.
	*/
	.plan__flag {
		align-self: flex-start;
		justify-self: start;
		background: #0b0b0d;
		color: var(--lime);
		padding: 6px 9px;
		margin-bottom: 18px;
	}

	.plan__summary {
		margin-top: 12px;
		color: var(--muted);
	}

	.plan__price {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 4px 8px;
		margin-top: 28px;
		padding-bottom: 28px;
		border-bottom: 1px solid var(--rule);
	}

	.plan__currency {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 700;
	}

	.plan__amount {
		font-size: 48px;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.plan__period {
		margin-left: 2px;
		white-space: nowrap;
	}

	.plan__list {
		display: grid;
		gap: 12px;
		margin-top: 28px;
		margin-bottom: 32px;
	}

	.plan__item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		font-size: 15px;
		line-height: 1.5;
	}

	.plan__item :global(svg) {
		flex: none;
		margin-top: 3px;
	}

	/* What a plan leaves out is set in muted text — struck-through or greyed to
	   the point of illegibility would make it look like a mistake. */
	.plan__item--out {
		color: var(--faint);
	}

	.plan__cta {
		display: flex;
		justify-content: center;
		margin-top: auto;
	}

	/* No outline on either tint — the fill is the button. A hairline as well
	   would mark the same edge twice. */
	.plan__cta :global(.btn) {
		border-color: transparent;
		background: var(--paper);
		color: var(--ink);
	}

	.plan__cta :global(.btn:hover) {
		background: #0b0b0d;
		color: #f5f5f3;
	}

	/* On full lime the neutral greys lose their contrast, so the secondary text
	   is re-cut from the ink instead. */
	.plan--featured .plan__summary {
		color: rgb(11 11 13 / 0.74);
	}

	.plan--featured .plan__item--out {
		color: rgb(11 11 13 / 0.52);
	}

	.plan--featured .plan__price {
		border-bottom-color: rgb(11 11 13 / 0.24);
	}

	/* A pale button on full lime would read as the quieter option, which is the
	   opposite of what this card is for — so the featured one inverts. */
	.plan--featured .plan__cta :global(.btn) {
		background: #0b0b0d;
		color: #f5f5f3;
	}

	.plan--featured .plan__cta :global(.btn:hover) {
		background: #2a2b31;
	}
</style>
