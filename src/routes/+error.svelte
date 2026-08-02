<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { friendlyError } from '$lib/errors';
	import { nav } from '$lib/data/site';

	const detail = $derived(friendlyError(page.status));
</script>

<svelte:head>
	<title>{detail.heading} — Amala Lifestyle</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="wrap">
	<div class="container">
		<p class="t-num code">{page.status}</p>
		<h1 class="t-h1 heading">{detail.heading}</h1>
		<p class="t-body-lg body">{detail.body}</p>

		<div class="actions">
			<Button href="/" variant="solid" arrow>Back to the home page</Button>
			<Button href="/contact" variant="ghost">Contact the gym</Button>
		</div>

		<nav class="links" aria-label="Popular pages">
			<p class="t-label">Try one of these</p>
			<ul>
				{#each nav as item (item.href)}
					<li>
						<a href={item.href} class="link">
							{item.label}
							<Icon name="arrow-up-right" size={15} />
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</section>

<style>
	.wrap {
		padding-block: clamp(64px, 10vw, 140px);
	}

	.code {
		font-size: 12px;
		letter-spacing: 0.16em;
		color: var(--faint);
	}

	.heading {
		margin-top: 22px;
		max-width: 16ch;
	}

	.body {
		margin-top: 24px;
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 36px;
	}

	.links {
		margin-top: clamp(48px, 6vw, 72px);
		padding-top: 28px;
		border-top: 1px solid var(--rule);
	}

	.links ul {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 18px;
	}

	.link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 11px 16px;
		border: 1px solid var(--rule-strong);
		font-size: 15px;
		color: var(--muted);
		transition:
			border-color 160ms ease,
			color 160ms ease;
	}

	.link:hover {
		border-color: var(--ink);
		color: var(--ink);
	}
</style>
