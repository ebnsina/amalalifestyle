<script lang="ts">
	import { page } from '$app/state';
	import Wordmark from './Wordmark.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { nav, site } from '$lib/data/site';

	let open = $state(false);

	// Solid by default: an inner page starts on white, where light-on-light
	// would be invisible. Only a dark hero underneath earns the transparent bar.
	let solid = $state(true);

	const tel = site.phone.replace(/\s/g, '');

	// Close the sheet whenever the route changes.
	$effect(() => {
		page.url.pathname;
		open = false;
	});

	// The sheet covers the viewport, so the page behind it should not scroll.
	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	/*
		The bar blends into the hero only while the page is at rest at the top.
		The moment anything scrolls it takes its surface back — otherwise the
		headline slides underneath and white labels cross white type and the
		lime mark, which is unreadable for the entire length of the hero. Pages
		without a hero start on white and are solid from the first paint.
	*/
	$effect(() => {
		page.url.pathname;
		if (!document.querySelector('[data-hero]')) {
			solid = true;
			return;
		}
		const onScroll = () => (solid = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function isCurrent(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<!-- One row. Six links sit beside the wordmark and the button with room to
	 spare, so a second tier would only add height for nothing. -->
<header class="site-header" class:is-solid={solid || open}>
	<div class="container site-header__inner">
		<Wordmark tone={solid || open ? 'ink' : 'light'} />

		<nav class="site-nav" aria-label="Primary">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="site-nav__link"
					class:is-current={isCurrent(item.href)}
					aria-current={isCurrent(item.href) ? 'page' : undefined}
					title={item.blurb}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="site-header__actions">
			<a class="site-header__tel t-label" href="tel:{tel}">
				<Icon name="phone" size={14} />
				<span>{site.phone}</span>
			</a>
			<span class="site-header__cta">
				<Button href="/contact" variant="solid">Book a free session</Button>
			</span>
			<button
				class="icon-box site-header__menu"
				type="button"
				onclick={() => (open = !open)}
				aria-expanded={open}
				aria-controls="main-menu"
				aria-label={open ? 'Close menu' : 'Open menu'}
			>
				<Icon name={open ? 'close' : 'menu'} size={16} />
			</button>
		</div>
	</div>
</header>

<!--
	Outside the header on purpose: its backdrop-filter makes it a containing
	block for fixed children, which trapped this sheet inside the bar.
-->
{#if open}
	<nav id="main-menu" class="menu" aria-label="Primary">
		<div class="container">
			<ul class="menu__list">
				{#each nav as item (item.href)}
					<li>
						<a href={item.href} class="menu__link" class:is-current={isCurrent(item.href)}>
							<span class="menu__text">
								<span class="t-h3 menu__label">{item.label}</span>
								<!-- The line that makes eleven items navigable rather than a wall. -->
								<span class="menu__blurb">{item.blurb}</span>
							</span>
							<Icon name="arrow-right" size={18} />
						</a>
					</li>
				{/each}
			</ul>

			<div class="menu__foot">
				<Button href="/contact" variant="solid" arrow>Book a free session</Button>
				<a class="menu__tel t-label" href="tel:{tel}">
					<Icon name="phone" size={14} />
					{site.phone}
				</a>
			</div>
		</div>
	</nav>
{/if}

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: transparent;
		border-bottom: 1px solid transparent;
		transition:
			background-color 200ms ease,
			border-color 200ms ease;
	}

	.site-header.is-solid {
		/* The vendor-prefixed property is written first, or a minifier that keeps
		   only the last of a duplicate pair drops the blur silently. */
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		background: rgb(255 255 255 / 0.92);
		border-bottom-color: var(--rule);
	}

	.site-header__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		height: var(--header-h);
	}

	.site-header__actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.site-nav,
	.site-header__tel,
	.site-header__cta {
		display: none;
	}

	.site-header__tel {
		align-items: center;
		gap: 8px;
		color: var(--muted);
		transition: color 160ms ease;
	}

	.site-header__tel:hover {
		color: var(--ink);
	}

	/* Takes the space left between the wordmark and the actions and centres in
	   it, rather than bunching up against the wordmark. */
	.site-nav {
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: clamp(16px, 2.2vw, 34px);
	}

	.site-nav__link {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding-block: 7px;
		border-bottom: 2px solid transparent;
		white-space: nowrap;
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

	/* Over the hero photograph the bar carries no surface of its own, so the
	   labels and the menu box switch to the light set. */
	.site-header:not(.is-solid) .site-nav__link,
	.site-header:not(.is-solid) .site-header__tel {
		color: rgb(245 245 243 / 0.8);
	}

	.site-header:not(.is-solid) .site-nav__link:hover,
	.site-header:not(.is-solid) .site-nav__link.is-current,
	.site-header:not(.is-solid) .site-header__tel:hover {
		color: #f5f5f3;
	}

	.site-header:not(.is-solid) .site-header__menu {
		border-color: rgb(245 245 243 / 0.38);
		color: #f5f5f3;
	}

	.site-header:not(.is-solid) .site-header__menu:hover {
		border-color: #f5f5f3;
	}

	@media (min-width: 1120px) {
		.site-nav,
		.site-header__tel,
		.site-header__cta {
			display: flex;
		}

		.site-header__menu {
			display: none;
		}
	}

	/* --- The sheet -------------------------------------------------------- */

	.menu {
		position: fixed;
		inset: var(--header-h) 0 0 0;
		z-index: 55;
		border-top: 1px solid var(--rule);
		background: var(--paper);
		padding-block: 8px calc(40px + env(safe-area-inset-bottom));
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.menu__link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding-block: 16px;
		border-bottom: 1px solid var(--rule);
		color: var(--ink);
		transition: background-color 160ms ease;
	}

	.menu__link:hover,
	.menu__link:active {
		background: var(--lime-wash);
	}

	.menu__text {
		display: grid;
		gap: 3px;
	}

	.menu__link.is-current .menu__label {
		border-bottom: 2px solid var(--lime);
	}

	.menu__label {
		justify-self: start;
	}

	.menu__blurb {
		font-size: 14px;
		line-height: 1.4;
		color: var(--muted);
	}

	.menu__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px 24px;
		padding-top: 28px;
	}

	.menu__tel {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.site-header,
		.menu__link {
			transition: none;
		}
	}
</style>
