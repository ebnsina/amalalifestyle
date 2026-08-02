<script lang="ts">
	import Icon from './Icon.svelte';
	import { nextUp } from '$lib/data/site';
	import { page } from '$app/state';

	/*
		Every page on the site used to end the same way: one dark band asking for
		a booking, with a single secondary link beside it. That is a fine ending
		for someone who has decided and a dead end for everyone else — and most
		people reading a gym's website at 11pm have not decided.

		So this sits between the page and that band: two or three named places to
		go on, chosen for the question a reader of *this* page is most likely to
		have next. The reader always has a way forward that is not "book now".
	*/
	const items = $derived(nextUp[page.url.pathname] ?? []);
</script>

{#if items.length}
	<section class="section section--ruled">
		<div class="container">
			<h2 class="t-h2">Where to next</h2>

			<div class="next" data-count={items.length}>
				{#each items as item (item.href)}
					<a class="next__card tile-hover" href={item.href}>
						<h3 class="t-h3 next__label">{item.label}</h3>
						<p class="t-body next__blurb">{item.blurb}</p>
						<span class="next__go t-label">
							{item.cta}
							<Icon name="arrow-right" size={15} />
						</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	/* Built as 1px gaps over a rule-coloured parent, the same construction as the
	   routing grid on the home page — so the two read as the same device in two
	   places rather than two components that happen to look alike. */
	.next {
		display: grid;
		gap: 1px;
		margin-top: 48px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 720px) {
		.next[data-count='2'] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 900px) {
		.next[data-count='3'] {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.next__card {
		display: flex;
		flex-direction: column;
		padding: 30px 28px 32px;
		color: var(--ink);
	}

	.next__blurb {
		margin-top: 12px;
		margin-bottom: 26px;
		color: var(--muted);
	}

	/* Pushed to the bottom so the prompts line up however long the sentence
	   above them runs. */
	.next__go {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: auto;
		color: var(--ink);
	}

	.next__card:hover .next__go {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
