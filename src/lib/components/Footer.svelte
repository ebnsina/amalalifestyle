<script lang="ts">
	import Wordmark from './Wordmark.svelte';
	import Icon from './Icon.svelte';
	import { site, socials, footerNav } from '$lib/data/site';

	const year = new Date().getFullYear();
	const tel = site.phone.replace(/\s/g, '');
</script>

<!--
	Three columns, and no call to action. The page above already ends on one,
	the header carries a button, and on a phone the fixed bar carries another —
	a fourth ask here was only ever noise.
-->
<footer class="site-footer band">
	<div class="container">
		<div class="site-footer__top">
			<div class="site-footer__col">
				<Wordmark tone="light" />
				<p class="t-body site-footer__tagline">{site.tagline}</p>
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

			{#each footerNav as col (col.title)}
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

				<dl class="hours">
					{#each site.hours as [days, time] (days)}
						<div class="hours__row">
							<dt>{days}</dt>
							<dd class="t-num">{time}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<div class="site-footer__bottom">
			<p class="t-label">© {year} {site.name}</p>
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
			gap: 48px 40px;
		}
	}

	@media (min-width: 1080px) {
		.site-footer__top {
			grid-template-columns: 1.5fr 1fr 1fr 1.1fr 1.1fr;
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
		margin-top: 10px;
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
		background: var(--sun);
		border-color: var(--sun);
		color: var(--ink);
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
		margin-top: 8px;
	}

	.hours__row {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 14px;
		color: var(--band-muted);
	}

	.site-footer__bottom {
		margin-top: clamp(48px, 6vw, 72px);
		padding-top: 24px;
		border-top: 1px solid var(--band-rule);
	}
</style>
