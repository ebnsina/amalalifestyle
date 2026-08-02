<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	let {
		title,
		description,
		image = '/images/hero-deadlift.jpg',
		type = 'website',
		noindex = false,
		publishedAt
	}: {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		publishedAt?: string;
	} = $props();

	const fullTitle = $derived(title === site.name ? title : `${title} — ${site.name}`);
	const canonical = $derived(new URL(page.url.pathname, page.url.origin).href);
	const imageUrl = $derived(new URL(image, page.url.origin).href);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}<meta name="robots" content="noindex" />{/if}

	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="en_GB" />
	{#if publishedAt}<meta property="article:published_time" content={publishedAt} />{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
