<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import { site } from '$lib/data/site';

	// Nothing to prompt on the page that already is the prompt.
	const hidden = $derived(page.url.pathname.startsWith('/contact'));
	const tel = site.phone.replace(/\s/g, '');
</script>

{#if !hidden}
	<div class="bar">
		<a class="bar__call" href="tel:{tel}" aria-label="Call the gym">
			<Icon name="phone" size={19} />
		</a>
		<a class="bar__cta" href="/contact">
			Book a free session
			<Icon name="arrow-right" size={16} />
		</a>
	</div>
{/if}

<style>
	.bar {
		position: fixed;
		inset: auto 0 0 0;
		z-index: 60;
		display: none;
		gap: 10px;
		padding: 10px var(--gutter) calc(10px + env(safe-area-inset-bottom));
		background: rgb(255 255 255 / 0.9);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		border-top: 1px solid var(--rule);
	}

	.bar__call {
		display: grid;
		place-items: center;
		width: 54px;
		height: 54px;
		flex: none;
		border: 1px solid var(--rule-strong);
		color: var(--ink);
	}

	.bar__cta {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 54px;
		background: var(--lime);
		color: #0b0b0d;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.bar__cta:active {
		background: var(--lime-deep);
	}

	@media (max-width: 899px) {
		.bar {
			display: flex;
		}
	}
</style>
