<script lang="ts">
	import { image as img } from '$lib/images';
	import type { Snippet } from 'svelte';

	let {
		title,
		standfirst,
		image,
		alt = '',
		vivid = false,
		actions
	}: {
		title: string;
		standfirst?: string;
		image?: string;
		alt?: string;
		vivid?: boolean;
		actions?: Snippet;
	} = $props();
</script>

<header class="page-header">
	<div class="container">
		<div class="page-header__grid" class:page-header__grid--split={!!image}>
			<div>
				<h1 class="t-h1 page-header__title">{title}</h1>
				{#if standfirst}
					<p class="t-body-lg page-header__standfirst">{standfirst}</p>
				{/if}
				{#if actions}
					<div class="page-header__actions">{@render actions()}</div>
				{/if}
			</div>

			{#if image}
				<div class="media media--card {vivid ? 'media--vivid' : 'media--muted'}">
					<!-- Above the fold on every inner page, so it loads eagerly. -->
					<enhanced:img
						src={img(image)}
						{alt}
						sizes="(min-width: 980px) 46vw, 100vw"
						fetchpriority="high"
					/>
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.page-header {
		padding-block: clamp(48px, 7vw, 88px) clamp(40px, 5vw, 72px);
	}

	.page-header__grid {
		display: grid;
		gap: 40px;
	}

	@media (min-width: 980px) {
		.page-header__grid--split {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
			align-items: center;
			gap: 64px;
		}
	}

	.page-header__title {
		max-width: 15ch;
	}

	.page-header__standfirst {
		margin-top: 24px;
		color: var(--muted);
	}

	.page-header__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 34px;
	}
</style>
