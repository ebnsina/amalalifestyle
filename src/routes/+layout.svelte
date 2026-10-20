<script lang="ts">
	import '../lib/sinaui/ui/tokens.css';
	import '../app.css';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import { i18n, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	store.init();
	$effect(() => void (document.documentElement.lang = i18n.lang));
</script>

{#if store.status === 'ready'}
	{#if store.saveFailed}
		<Alert tone="danger" title={t('শেষ বদলটা সেভ হয়নি', 'Your last change wasn’t saved')} class="save-failed" live>
			{t('ফোনের জায়গা ভরে গেছে কিনা দেখুন, তারপর অ্যাপটা আবার খুলুন।', 'Check that your phone has free space, then open the app again.')}
		</Alert>
	{/if}
	{@render children()}
{:else if store.status === 'failed'}
	<div class="failed">
		<p class="emoji" aria-hidden="true">😕</p>
		<h1 class="big">{t('অ্যাপটা খোলা যায়নি', 'The app couldn’t open')}</h1>
		<p class="muted">
			{t('অন্য কোনো ট্যাবে অ্যাপটা খোলা থাকলে সেটা বন্ধ করে আবার চেষ্টা করুন। প্রাইভেট উইন্ডো বা খুব পুরনো ব্রাউজারে তথ্য রাখা যায় না; সাধারণ উইন্ডোতে Chrome, Edge, Firefox বা Safari-র নতুন সংস্করণে খুলুন।',
				'If the app is open in another tab, close it and try again. Private windows and very old browsers can’t keep your data; open it in a normal window of a recent Chrome, Edge, Firefox or Safari.')}
		</p>
		<Button onclick={() => location.reload()}>{t('আবার চেষ্টা করুন', 'Try again')}</Button>
	</div>
{/if}

<style>
	.failed {
		min-height: 100dvh;
		box-sizing: border-box;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 1rem;
		padding: 2rem;
		max-width: 28rem;
		margin: 0 auto;
		text-align: center;
	}
	.emoji {
		font-size: 3.5rem;
	}
	:global(.save-failed) {
		position: sticky;
		top: 0;
		z-index: 20;
	}
</style>
