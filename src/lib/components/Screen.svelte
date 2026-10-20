<script lang="ts">
	import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { t } from '#lib/i18n.svelte.js';

	// title: a pushed screen with a back button. Without it, the page draws its own heading (tab screens).
	let { title, tabs = false, footer, children }: {
		title?: string; tabs?: boolean; footer?: Snippet; children: Snippet;
	} = $props();

	// Opened straight from a link or the home screen, there is no page to go back to.
	const back = () => (history.length > 1 ? history.back() : goto('/'));
</script>

<svelte:head>
	{#if title}<title>{title} · AMALA</title>{/if}
</svelte:head>

{#if title !== undefined}
	<header>
		<Button variant="ghost" square aria-label={t('ফিরে যান', 'Go back')} onclick={back}><Icon icon={ArrowLeft01Icon} size={22} /></Button>
		<h1>{title}</h1>
	</header>
{/if}
<main class={{ tabs, footed: !!footer }}>
	{@render children()}
</main>
{#if footer}
	<footer>{@render footer()}</footer>
{/if}

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: calc(env(safe-area-inset-top) + 0.5rem) 1rem 0.5rem 0.5rem;
		background: var(--ui-bg);
	}
	h1 {
		font-size: 1.0625rem;
		font-weight: 600;
	}
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem 1rem 2rem;
	}
	.tabs {
		padding-top: calc(env(safe-area-inset-top) + 1rem);
		padding-bottom: 7.5rem;
	}
	.footed {
		padding-bottom: 6rem;
	}
	footer {
		position: fixed;
		inset-inline: 0;
		bottom: 0;
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem calc(env(safe-area-inset-bottom) + 0.75rem);
		background: var(--ui-bg);
	}
	footer > :global(*) {
		flex: 1;
	}
	@media (min-width: 42rem) {
		footer {
			left: 50%;
			width: 40rem;
			transform: translateX(-50%);
			box-sizing: border-box;
		}
	}
</style>
