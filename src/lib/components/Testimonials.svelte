<script lang="ts">
	import { testimonials } from '$lib/data/site';
</script>

<ul class="quotes">
	{#each testimonials as t (t.quote)}
		<li class="quotes__item">
			<figure>
				<blockquote class="quotes__text">{t.quote}</blockquote>
				<figcaption class="quotes__by">
					<span class="quotes__name">{t.name}</span>
					<span class="t-label">{t.detail}</span>
				</figcaption>
			</figure>
		</li>
	{/each}
</ul>

<style>
	.quotes {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		margin-top: 48px;
	}

	@media (min-width: 860px) {
		.quotes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.quotes__item {
		background: var(--paper);
		padding: 32px 30px;
	}

	.quotes__item figure {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.quotes__text {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: 19px;
		line-height: 1.42;
		letter-spacing: -0.014em;
		font-stretch: 96%;
	}

	.quotes__text::before {
		content: '“';
	}

	.quotes__text::after {
		content: '”';
	}

	.quotes__by {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: auto;
		padding-top: 28px;
	}

	.quotes__name {
		font-size: 15px;
		color: var(--muted);
	}
</style>
