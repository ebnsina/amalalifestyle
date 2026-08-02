<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MobileBar from '$lib/components/MobileBar.svelte';

	let { children } = $props();

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

<MobileBar />

<style>
	/* Clears the fixed bar so the footer is never trapped underneath it. */
	@media (max-width: 899px) {
		:global(body) {
			padding-bottom: calc(74px + env(safe-area-inset-bottom));
		}
	}

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
