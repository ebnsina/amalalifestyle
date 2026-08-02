<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	/*
		Pricing and the FAQ live on the home page, so links to them from another
		route arrive as /#pricing. The router scrolls before the view transition
		finishes and before the lazily-sized images settle, which lands the page
		at the top instead of the section — so the anchor is re-targeted once a
		frame has passed and the layout is final.
	*/
	afterNavigate(({ to }) => {
		const hash = to?.url.hash;
		if (!hash || hash === '#') return;
		const target = document.querySelector(hash);
		if (!target) return;
		// Two frames, not one: the router's own scroll restoration runs after
		// the first, so a single frame gets overwritten and lands at the top.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
		});
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.documentElement.classList.add('vt-page');
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => document.documentElement.classList.remove('vt-page'));
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a class="skip" href="#main">Skip to content</a>

<Header />

<main id="main">
	{@render children()}
</main>

<Footer />

<style>
	.skip {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 100;
		background: var(--lime);
		color: #0b0b0d;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 14px 22px;
	}

	.skip:focus {
		left: 0;
	}
</style>
