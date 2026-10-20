<script lang="ts">
	import { resolve } from '$app/paths';
	import LangSwitch from '#lib/components/LangSwitch.svelte';
	import Plate from '#lib/components/Plate.svelte';
	import { t } from '#lib/i18n.svelte.js';
	import Button from '#lib/sinaui/ui/Button.svelte';
</script>

<svelte:head><title>{t('স্বাগতম · আমালা লাইফস্টাইল', 'Welcome · AMALA Lifestyle')}</title></svelte:head>

<div class="page">
	<div class="lang"><LangSwitch /></div>
	<div class="art" aria-hidden="true">
		<span class="dish">🍛</span>
		<span class="float" style="top: 18%; right: 10%; --d: 300ms"><Plate emoji="🐟" /></span>
		<span class="float" style="bottom: 18%; left: 10%; --d: 450ms"><Plate emoji="🥬" size={56} /></span>
		<span class="float tag" style="top: 22%; left: 8%; --d: 600ms">{t('ভাত-মাছ', 'Rice & fish')}</span>
		<span class="float tag" style="bottom: 14%; right: 8%; --d: 750ms">{t('মসুর ডাল', 'Lentil dal')}</span>
	</div>

	<div class="copy">
		<p class="brand heading enter" style="--i: 2">{t('আমালা', 'AMALA')}</p>
		<h1 class="heading enter" style="--i: 3">{t('জীবনকে পরিশুদ্ধ করুন,', 'Purify Your Life,')}<br /><span>{t('ভবিষ্যৎ বদলে দিন।', 'Transform Your Future.')}</span></h1>
		<p class="muted enter" style="--i: 5">{t('খাবার, নামাজ, ব্যায়াম, বই আর রোজকার কাজ — ভালো অভ্যাস গড়ার সব এক জায়গায়।', 'Food, prayer, exercise, reading and daily tasks — everything for better habits in one place.')}</p>
		<div class="enter" style="--i: 7"><Button size="lg" href={resolve('/onboarding')}>{t('শুরু করি', 'Get started')}</Button></div>
	</div>
</div>

<style>
	.page {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		max-width: 32rem;
		margin: 0 auto;
		background: var(--ui-surface);
	}
	.lang {
		padding: calc(env(safe-area-inset-top) + 1rem) 1.5rem 0;
	}
	.art {
		position: relative;
		flex: 1;
		min-height: 320px;
		display: grid;
		place-items: center;
	}
	.dish {
		display: grid;
		place-items: center;
		width: 260px;
		height: 260px;
		border-radius: 50%;
		background: var(--accent-soft);
		font-size: 130px;
		animation: pop 600ms var(--ui-ease-spring) both;
	}
	.float {
		position: absolute;
		animation:
			fade 500ms var(--d) both,
			bob calc(1600ms + var(--d)) var(--ui-ease-in-out) var(--d) infinite alternate;
	}
	.tag {
		padding: 0.5rem 1rem;
		border-radius: 999px;
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-card);
		font-size: 0.875rem;
		font-weight: 600;
	}
	.copy {
		display: grid;
		gap: 1rem;
		padding: 1.5rem 1.5rem calc(env(safe-area-inset-bottom) + 1.5rem);
	}
	h1 {
		font-size: 2.125rem;
		line-height: 1.35;
	}
	.brand {
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: var(--ui-accent);
	}
	/* Spacing letters apart breaks Bangla conjuncts. */
	:global(html[lang='bn']) .brand {
		letter-spacing: 0;
	}
	h1 span {
		color: var(--ui-accent);
	}
	p {
		font-size: 1.0625rem;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	@keyframes bob {
		to {
			translate: 0 -8px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dish, .float {
			animation: none;
		}
	}
</style>
