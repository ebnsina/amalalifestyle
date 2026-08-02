<script lang="ts">
	import Wordmark from './Wordmark.svelte';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';
	import { site, socials, footerNav } from '$lib/data/site';

	const year = new Date().getFullYear();
	const tel = site.phone.replace(/\s/g, '');
	const columns = [footerNav.train, footerNav.about];
</script>

<footer class="site-footer band">
	<div class="container">
		<!-- A last, quiet prompt. The loud one is the CTA band above it. -->
		<div class="site-footer__top">
			<div>
				<Wordmark tone="light" />
				<p class="t-body site-footer__tagline">{site.tagline}</p>
			</div>

			{#each columns as col (col.title)}
				<nav class="site-footer__col" aria-label={col.title}>
					<p class="t-label">{col.title}</p>
					{#each col.links as link (link.href)}
						<a href={link.href} class="site-footer__link">{link.label}</a>
					{/each}
				</nav>
			{/each}

			<div class="site-footer__col">
				<p class="t-label">Visit</p>
				<address class="site-footer__address">
					{#each site.addressLines as line (line)}
						<span>{line}</span>
					{/each}
				</address>
				<a href="mailto:{site.email}" class="site-footer__link">
					<Icon name="mail" size={14} />
					{site.email}
				</a>
				<a href="tel:{tel}" class="site-footer__link t-num">
					<Icon name="phone" size={14} />
					{site.phone}
				</a>
			</div>

			<div class="site-footer__col">
				<p class="t-label">Opening hours</p>
				<dl class="hours">
					{#each site.hours as [days, time] (days)}
						<div class="hours__row">
							<dt>{days}</dt>
							<dd class="t-num">{time}</dd>
						</div>
					{/each}
				</dl>
				<p class="site-footer__note-small">Closed Friday until 16:00 for Jumu‘ah.</p>
			</div>
		</div>

		<div class="site-footer__cta">
			<p class="t-h3 site-footer__cta-text">Not signed up yet? The first session is free.</p>
			<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		</div>

		<div class="site-footer__bottom">
			<p class="t-label">© {year} {site.name}</p>

			<ul class="socials">
				{#each socials as s (s.label)}
					<li>
						<a
							class="socials__link"
							href={s.href}
							aria-label={s.label}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Icon name={s.icon} size={17} />
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		padding-block: clamp(56px, 7vw, 96px) 32px;
	}

	.site-footer__top {
		display: grid;
		gap: 44px;
	}

	@media (min-width: 720px) {
		.site-footer__top {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1100px) {
		.site-footer__top {
			grid-template-columns: 1.5fr 1fr 1fr 1.3fr 1.2fr;
			gap: 40px;
		}
	}

	.site-footer__tagline {
		margin-top: 18px;
		color: var(--band-muted);
		max-width: 26ch;
	}

	.socials {
		display: flex;
		gap: 10px;
	}

	/* Bordered box: these are controls, not decorative marks. */
	.socials__link {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--band-rule);
		color: var(--band-muted);
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	.socials__link:hover {
		background: var(--lime);
		border-color: var(--lime);
		color: #0b0b0d;
	}

	.site-footer__col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.site-footer__link {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		font-size: 15px;
		color: var(--band-muted);
		transition: color 160ms ease;
	}

	.site-footer__link:hover {
		color: var(--band-ink);
	}

	.site-footer__address {
		display: grid;
		gap: 2px;
		font-style: normal;
		font-size: 15px;
		color: var(--band-muted);
		max-width: 24ch;
	}

	.hours {
		display: grid;
		gap: 8px;
		width: 100%;
		max-width: 26ch;
	}

	.hours__row {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 14px;
		color: var(--band-muted);
	}

	.site-footer__note-small {
		font-size: 13px;
		color: #7c7d84;
		max-width: 26ch;
	}

	.site-footer__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px 32px;
		margin-top: clamp(48px, 6vw, 72px);
		padding-top: 36px;
		border-top: 1px solid var(--band-rule);
	}

	.site-footer__cta-text {
		max-width: 26ch;
	}

	.site-footer__bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px 32px;
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid var(--band-rule);
	}
</style>
