<script lang="ts">
	import { page } from '$app/state';
	import Wordmark from './Wordmark.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { nav, site, type NavItem } from '$lib/data/site';

	let open = $state(false);

	// Solid by default: an inner page starts on white, where light-on-light
	// would be invisible. Only a dark hero underneath earns the transparent bar.
	let solid = $state(true);

	// Which section's flyout is showing. Pointer and keyboard both drive it, so
	// it cannot be pure :hover — tabbing into a panel has to open it too.
	let openSection = $state<string | null>(null);

	const tel = site.phone.replace(/\s/g, '');

	// Close the sheet and any flyout whenever the route changes.
	$effect(() => {
		page.url.pathname;
		open = false;
		openSection = null;
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

	// A hash link is a place on a page, not a page — it never claims the mark,
	// or "Pricing" would read as the current page for the whole of the home page.
	function matches(href: string) {
		if (href.includes('#')) return false;
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}

	// A section is current when you are on it *or on anything under it*, so the
	// bar still tells you where you are on the seven pages that have no label
	// of their own.
	function isCurrent(item: NavItem) {
		return matches(item.href) || (item.under?.some((c) => matches(c.href)) ?? false);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		if (openSection) openSection = null;
		else if (open) open = false;
	}
</script>

<svelte:window on:keydown={onKeydown} />

<!-- One row. Seven links sit beside the wordmark and the button, and the three
	 that own deeper pages open a panel rather than hiding them in the footer. -->
<header class="site-header" class:is-solid={solid || open || !!openSection}>
	<div class="container site-header__inner">
		<Wordmark tone={solid || open || openSection ? 'ink' : 'light'} />

		<nav
			class="site-nav"
			aria-label="Primary"
			onmouseleave={() => (openSection = null)}
			onfocusout={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node)) openSection = null;
			}}
		>
			{#each nav as item (item.href)}
				{@const current = isCurrent(item)}
				<div class="site-nav__item">
					<!-- Pointer and keyboard open it the same way; the panel then hangs
						 off the bar with no gap, so travelling into it keeps it open and
						 leaving the whole nav is what closes it. -->
					<a
						href={item.href}
						class="site-nav__link"
						class:is-current={current}
						class:is-open={openSection === item.href}
						aria-current={current ? 'page' : undefined}
						aria-expanded={item.under ? openSection === item.href : undefined}
						title={item.blurb}
						onmouseenter={() => (openSection = item.under ? item.href : null)}
						onfocus={() => (openSection = item.under ? item.href : null)}
					>
						{item.label}
						{#if item.under}
							<span class="site-nav__caret" aria-hidden="true">
								<Icon name="chevron-down" size={12} />
							</span>
						{/if}
					</a>

					{#if item.under && openSection === item.href}
						<!--
							The panel hangs off the bottom edge of the bar with no gap, so
							the pointer can travel from the label into it without the
							hover dropping out from under it halfway.
						-->
						<div class="flyout">
							{#each item.under as child (child.href)}
								<a href={child.href} class="flyout__link" class:is-current={matches(child.href)}>
									<span class="flyout__text">
										<span class="flyout__label">{child.label}</span>
										<span class="flyout__blurb">{child.blurb}</span>
									</span>
									<Icon name="arrow-right" size={15} />
								</a>
							{/each}
						</div>
					{/if}
				</div>
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
						<a href={item.href} class="menu__link" class:is-current={isCurrent(item)}>
							<span class="menu__text">
								<span class="t-h3 menu__label">{item.label}</span>
								<!-- The line that makes a list of labels navigable rather than a wall. -->
								<span class="menu__blurb">{item.blurb}</span>
							</span>
							<Icon name="arrow-right" size={18} />
						</a>

						<!--
							Open, not behind an accordion. Every one of these pages was
							footer-only, and a tap to find out a page exists is a tap most
							people never make.
						-->
						{#if item.under}
							<ul class="submenu">
								{#each item.under as child (child.href)}
									<li>
										<a
											href={child.href}
											class="submenu__link"
											class:is-current={matches(child.href)}
										>
											{child.label}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
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
		flex: none;
		white-space: nowrap;
		color: var(--muted);
		transition: color 160ms ease;
	}

	.site-header__tel:hover {
		color: var(--ink);
	}

	/* Takes the space left between the wordmark and the actions and centres in
	   it, rather than bunching up against the wordmark. Stretched to the full
	   bar height so a flyout can hang off the bar's bottom edge with no gap for
	   the pointer to fall through. */
	.site-nav {
		flex: 1;
		align-self: stretch;
		align-items: stretch;
		justify-content: center;
		gap: clamp(14px, 1.9vw, 30px);
	}

	.site-nav__item {
		position: relative;
		display: flex;
		align-items: center;
	}

	.site-nav__link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.008em;
		color: var(--muted);
		padding-block: 7px;
		border-bottom: 2px solid transparent;
		white-space: nowrap;
		transition:
			color 160ms ease,
			border-color 160ms ease;
	}

	.site-nav__link:hover,
	.site-nav__link.is-open {
		color: var(--ink);
	}

	/* Lime marks the page you are on — a fill under the label, never the label.
	   A section counts as current for every page under it, so the bar answers
	   "where am I" on the pages that have no label of their own. */
	.site-nav__link.is-current {
		color: var(--ink);
		border-bottom-color: var(--sun);
	}

	.site-nav__caret {
		display: inline-flex;
		color: var(--faint);
		transition: transform 160ms ease;
	}

	.site-nav__link.is-open .site-nav__caret {
		transform: rotate(180deg);
	}

	/* --- The flyout ------------------------------------------------------- */

	/*
		Hangs off the bar's own bottom rule, so that rule is the panel's top edge
		and the boundary is still marked exactly once.
	*/
	.flyout {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: max-content;
		min-width: 300px;
		max-width: 360px;
		padding-block: 8px;
		background: var(--paper);
		border: 1px solid var(--rule);
		border-top: none;
		/* Square where it meets the bar, rounded where it ends — it is hanging
		   off the header, not floating beside it. */
		border-radius: 0 0 var(--r-md) var(--r-md);
	}

	.flyout__link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		padding: 11px 20px;
		color: var(--ink);
		transition: background-color 160ms ease;
	}

	.flyout__link:hover {
		background: var(--sun-wash);
	}

	.flyout__link :global(svg) {
		flex: none;
		color: var(--faint);
		transition: transform 160ms ease;
	}

	.flyout__link:hover :global(svg) {
		transform: translateX(3px);
		color: var(--ink);
	}

	.flyout__text {
		display: grid;
		gap: 2px;
		justify-items: start;
	}

	.flyout__label {
		font-size: 15px;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.01em;
		border-bottom: 2px solid transparent;
	}

	.flyout__link.is-current .flyout__label {
		border-bottom-color: var(--sun);
	}

	.flyout__blurb {
		font-size: 13px;
		line-height: 1.4;
		color: var(--muted);
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
		color: var(--band-ink);
	}

	.site-header:not(.is-solid) .site-header__menu {
		border-color: rgb(245 245 243 / 0.38);
		color: var(--band-ink);
	}

	.site-header:not(.is-solid) .site-header__menu:hover {
		border-color: var(--band-ink);
	}

	@media (min-width: 1120px) {
		.site-nav,
		.site-header__cta {
			display: flex;
		}

		.site-header__menu {
			display: none;
		}
	}

	/*
		The number is the least-used thing in the bar and the seventh nav item is
		worth more than it, so it only appears once there is room for both without
		the nav bunching up. It is still in the sheet, the footer and on /contact.
	*/
	@media (min-width: 1500px) {
		.site-header__tel {
			display: flex;
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
		background: var(--sun-wash);
	}

	.menu__text {
		display: grid;
		gap: 3px;
	}

	.menu__link.is-current .menu__label {
		border-bottom: 2px solid var(--sun);
	}

	/*
		Shown open rather than behind an accordion. Every page in here used to be
		footer-only, and a tap taken to find out whether a page exists is a tap
		most people never make. The hairline down the left is the rail that says
		these belong to the label above them; the current one lights it lime.
	*/
	.menu__list li:has(.submenu) .menu__link {
		border-bottom: none;
	}

	.submenu {
		display: grid;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--rule);
	}

	.submenu__link {
		padding: 9px 0 9px 18px;
		border-left: 2px solid var(--rule);
		font-size: 15px;
		color: var(--muted);
		transition:
			color 160ms ease,
			border-color 160ms ease;
	}

	.submenu__link:hover {
		color: var(--ink);
		border-left-color: var(--rule-strong);
	}

	.submenu__link.is-current {
		color: var(--ink);
		border-left-color: var(--sun);
	}

	.menu__label {
		justify-self: start;
	}

	/* Fainter than the sub-links below it. Three things in a row at the same
	   weight — label, description, sub-page — and the description reads as
	   another destination you could tap. */
	.menu__blurb {
		font-size: 13px;
		line-height: 1.4;
		color: var(--faint);
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
		.menu__link,
		.submenu__link,
		.flyout__link,
		.site-nav__caret {
			transition: none;
		}
	}
</style>
