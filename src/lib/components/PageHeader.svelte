<script lang="ts">
	import { image as img } from '$lib/images';
	import { page } from '$app/state';
	import { trailFor } from '$lib/data/site';
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

	/*
		Read off the menu rather than passed in per page, so a page can never
		claim to be somewhere the bar disagrees with.

		Shown only when there is an actual trail. A single step above the heading
		is not a breadcrumb, it is the eyebrow label this site deliberately got
		rid of — and on a top-level page it says nothing the lime mark in the bar
		has not already said. The seven pages that sit *under* a section are the
		ones with no label anywhere, and those are exactly the ones this fires on.
	*/
	const trail = $derived(trailFor(page.url.pathname));
	const showTrail = $derived(trail.length > 1);
</script>

<header class="page-header">
	<div class="container">
		<div class="page-header__grid" class:page-header__grid--split={!!image}>
			<div>
				<!--
					Not an eyebrow: it does not restate the heading, it says where in the
					site you are standing, and every step but the last is a link out.
				-->
				{#if showTrail}
					<nav class="crumbs" aria-label="Breadcrumb">
						<ol class="crumbs__list">
							{#each trail as crumb, i (crumb.label)}
								<li class="crumbs__item">
									{#if i > 0}
										<span class="crumbs__sep" aria-hidden="true">/</span>
									{/if}
									{#if crumb.href}
										<a href={crumb.href} class="crumbs__link">{crumb.label}</a>
									{:else}
										<span aria-current="page">{crumb.label}</span>
									{/if}
								</li>
							{/each}
						</ol>
					</nav>
				{/if}

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

	.crumbs {
		margin-bottom: 22px;
	}

	.crumbs__list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.crumbs__item {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.crumbs__sep {
		color: var(--rule-strong);
	}

	.crumbs__link {
		color: var(--muted);
		transition: color 160ms ease;
	}

	.crumbs__link:hover {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		.crumbs__link {
			transition: none;
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
