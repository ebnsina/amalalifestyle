<script lang="ts">
	import { image as img } from '$lib/images';
	import { formatDate } from '$lib/format';
	import Seo from '$lib/components/Seo.svelte';
	import Section from '$lib/components/Section.svelte';
	import JournalCard from '$lib/components/JournalCard.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();
	const post = $derived(data.post);

	const formatted = $derived(formatDate(post.date, 'long'));
</script>

<Seo
	title={post.title}
	description={post.excerpt}
	image={post.image}
	type="article"
	publishedAt={post.date}
/>

<article>
	<header class="container head">
		<a href="/journal" class="t-label back">
			<Icon name="arrow-right" size={13} class="back__icon" />
			All articles
		</a>

		<p class="t-label head__meta">
			{post.category}
			<span aria-hidden="true">·</span>
			<time datetime={post.date}>{formatted}</time>
			<span aria-hidden="true">·</span>
			{post.read} read
		</p>

		<h1 class="t-h1 head__title">{post.title}</h1>
		<p class="t-body-lg head__excerpt">{post.excerpt}</p>
		<p class="t-label head__author">Written by {post.author}</p>
	</header>

	<div class="container">
		<div class="media media--wide media--muted hero">
			<enhanced:img
				src={img(post.image)}
				alt={post.alt}
				sizes="(min-width: 900px) 900px, 100vw"
				fetchpriority="high"
			/>
		</div>
	</div>

	<div class="container">
		<div class="body">
			{#each post.body as block, i (i)}
				{#if block.type === 'h2'}
					<h2 class="t-h2 body__h2">{block.text}</h2>
				{:else if block.type === 'p'}
					<p class="body__p">{block.text}</p>
				{:else if block.type === 'quote'}
					<blockquote class="body__quote">{block.text}</blockquote>
				{:else if block.type === 'list'}
					<ul class="body__list">
						{#each block.items as item (item)}
							<li><Icon name="check" size={16} /> <span>{item}</span></li>
						{/each}
					</ul>
				{/if}
			{/each}
		</div>
	</div>
</article>

<Section>
	<div class="more">
		{#each data.more as p (p.slug)}
			<JournalCard {...p} />
		{/each}
	</div>
</Section>

<CtaBand
	title="Reading about it is not the same as doing it."
	body="The first session is free, takes ninety minutes and commits you to nothing at all."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/timetable', text: 'See the timetable' }}
	image="/images/equipment.jpg"
/>

<style>
	.head {
		padding-block: clamp(40px, 5vw, 64px) clamp(32px, 4vw, 48px);
		max-width: 900px;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
	}

	.back:hover {
		color: var(--ink);
	}

	.back :global(.back__icon) {
		transform: rotate(180deg);
	}

	.head__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 32px;
	}

	.head__title {
		margin-top: 18px;
		max-width: 18ch;
	}

	.head__excerpt {
		margin-top: 24px;
		color: var(--muted);
	}

	.head__author {
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
		max-width: 30ch;
	}

	.hero {
		max-width: 900px;
	}

	/* One column, held to a comfortable measure. An article is the one place on
	   this site where the grid gets out of the way entirely. */
	.body {
		max-width: 68ch;
		padding-block: clamp(40px, 5vw, 64px) clamp(56px, 7vw, 96px);
	}

	.body__p {
		font-size: 18px;
		line-height: 1.7;
		letter-spacing: -0.011em;
	}

	.body__p + .body__p {
		margin-top: 22px;
	}

	.body__h2 {
		margin-top: 52px;
		margin-bottom: 20px;
		max-width: 24ch;
	}

	.body__quote {
		margin-block: 44px;
		padding-block: 28px;
		border-block: 1px solid var(--rule);
		font-family: var(--font-display);
		font-size: 23px;
		line-height: 1.35;
		letter-spacing: -0.018em;
		font-stretch: 94%;
	}

	.body__list {
		display: grid;
		gap: 2px;
		margin-block: 32px;
	}

	.body__list li {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding-block: 14px;
		border-top: 1px solid var(--rule);
		font-size: 17px;
		line-height: 1.5;
		color: var(--muted);
	}

	.body__list li:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.body__list :global(svg) {
		flex: none;
		margin-top: 3px;
	}

	.more {
		display: grid;
		gap: 40px 32px;
	}

	@media (min-width: 760px) {
		.more {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
