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
	{#if featured}
		<p class="plan__flag t-label-sm">Most people start here</p>
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
	.plan {
		display: flex;
		flex-direction: column;
		background: var(--paper);
		padding: 34px 30px 36px;
	}

	/* The recommended plan is marked by a lime edge and a flag, not by a
	   different size — the comparison only works if the columns stay equal. */
	.plan--featured {
		background: var(--paper);
		border-top: 3px solid var(--lime);
	}

	.plan__flag {
		color: var(--ink);
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
		margin-top: auto;
	}
</style>
