<script lang="ts">
	import { page } from '$app/state';
	import Wordmark from './Wordmark.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { nav } from '$lib/data/site';
	import { menu } from '$lib/state/nav.svelte';

	// Close the sheet whenever the route changes.
	$effect(() => {
		page.url.pathname;
		menu.open = false;
	});

	// The sheet covers the viewport, so the page behind it should not scroll.
	$effect(() => {
		document.body.style.overflow = menu.open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function isCurrent(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<header class="site-header">
	<div class="container site-header__inner">
		<Wordmark />

		<nav class="site-nav" aria-label="Primary">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="site-nav__link"
					class:is-current={isCurrent(item.href)}
					aria-current={isCurrent(item.href) ? 'page' : undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="site-header__actions">
			<span class="site-header__cta">
				<Button href="/contact" variant="solid">Book a session</Button>
			</span>
			<button
				class="icon-box site-header__menu"
				type="button"
				onclick={() => (menu.open = !menu.open)}
				aria-expanded={menu.open}
				aria-controls="mobile-nav"
				aria-label={menu.open ? 'Close menu' : 'Open menu'}
			>
				<Icon name={menu.open ? 'close' : 'menu'} size={16} />
			</button>
		</div>
	</div>
</header>

<!--
	Outside the header on purpose: its backdrop-filter makes it a containing
	block for fixed children, which trapped this sheet inside the 72px bar.
-->
{#if menu.open}
	<nav id="mobile-nav" class="mobile-nav" aria-label="Primary">
		<div class="container">
			{#each nav as item (item.href)}
				<a href={item.href} class="mobile-nav__link" class:is-current={isCurrent(item.href)}>
					<span class="t-h3">{item.label}</span>
					<Icon name="arrow-up-right" size={18} />
				</a>
			{/each}
			<div class="mobile-nav__cta">
				<Button href="/contact" variant="solid" arrow>Book a session</Button>
			</div>
		</div>
	</nav>
{/if}

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		/* The vendor-prefixed property is written first, or a minifier that keeps
		   only the last of a duplicate pair drops the blur silently. */
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		background: rgb(255 255 255 / 0.86);
		border-bottom: 1px solid var(--rule);
	}

	.site-header__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		height: 72px;
	}

	.site-nav {
		display: none;
		gap: 24px;
	}

	.site-nav__link {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		padding-block: 6px;
		border-bottom: 2px solid transparent;
		transition:
			color 160ms ease,
			border-color 160ms ease;
	}

	.site-nav__link:hover {
		color: var(--ink);
	}

	/* Lime marks the page you are on — a fill under the label, never the label. */
	.site-nav__link.is-current {
		color: var(--ink);
		border-bottom-color: var(--lime);
	}

	.site-header__actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.site-header__cta {
		display: none;
	}

	/* A full-height sheet with thumb-sized rows, not a dropdown. */
	.mobile-nav {
		position: fixed;
		inset: 72px 0 0 0;
		z-index: 55;
		border-top: 1px solid var(--rule);
		background: var(--paper);
		padding-bottom: calc(96px + env(safe-area-inset-bottom));
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.mobile-nav__link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 60px;
		padding-block: 16px;
		border-bottom: 1px solid var(--rule);
		color: var(--muted);
	}

	.mobile-nav__link:active {
		background: var(--surface);
	}

	.mobile-nav__link.is-current {
		color: var(--ink);
	}

	.mobile-nav__cta {
		padding-top: 28px;
	}

	/* Seven nav items plus a wordmark and a button need more room than the usual
	   900px breakpoint gives them, so the sheet stays until 1220px. */
	@media (min-width: 1220px) {
		.site-nav,
		.site-header__cta {
			display: flex;
		}
		.site-header__menu {
			display: none;
		}
	}
</style>
