<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import JournalCard from '$lib/components/JournalCard.svelte';
	import Newsletter from '$lib/components/Newsletter.svelte';
	import { journal } from '$lib/data/site';
</script>

<Seo
	title="Journal"
	description="Training and nutrition written plainly by the coaches at Amala Lifestyle. No listicles and nothing to buy at the end."
	image="/images/nutrition-plate.jpg"
/>

<PageHeader
	eyebrow="Journal"
	title="Reading, if you want it"
	standfirst="Written by the coaches, about the things members actually ask. No listicles, no supplements at the end of the article, and nothing you have to sign up for to finish reading."
/>

<Section label="All articles" ruled={false}>
	<div class="posts">
		{#each journal as post (post.slug)}
			<JournalCard {...post} />
		{/each}
	</div>
</Section>

<Newsletter />

<style>
	.posts {
		display: grid;
		gap: 48px 32px;
	}

	@media (min-width: 680px) {
		.posts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1060px) {
		.posts {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
