<script lang="ts">
	import { formatDate } from '$lib/format';
	import Icon from './Icon.svelte';

	let {
		slug,
		title,
		excerpt,
		category,
		date,
		read,
		image,
		alt
	}: {
		slug: string;
		title: string;
		excerpt: string;
		category: string;
		date: string;
		read: string;
		image: string;
		alt: string;
	} = $props();

	const formatted = $derived(formatDate(date, 'short'));
	const vivid = $derived(category === 'Nutrition');
</script>

<article class="post">
	<a class="post__link" href="/journal/{slug}">
		<div class="media media--wide {vivid ? 'media--vivid' : 'media--muted'}">
			<img src={image} {alt} width="900" height="506" loading="lazy" decoding="async" />
		</div>

		<div class="post__body">
			<p class="t-label post__meta">
				{category} · <time datetime={date}>{formatted}</time> · {read}
			</p>
			<h3 class="t-h3 post__title">{title}</h3>
			<p class="t-body post__excerpt">{excerpt}</p>
			<span class="post__more t-label-sm">Read <Icon name="arrow-right" size={13} /></span>
		</div>
	</a>
</article>

<style>
	.post__link {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: var(--ink);
	}

	.post__body {
		padding-top: 22px;
	}

	.post__meta {
		display: block;
	}

	.post__title {
		margin-top: 12px;
	}

	.post__excerpt {
		margin-top: 10px;
		color: var(--muted);
	}

	.post__more {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 20px;
		padding-bottom: 3px;
		border-bottom: 2px solid var(--lime);
	}

	.post__link:hover .post__more {
		border-bottom-color: var(--ink);
	}
</style>
