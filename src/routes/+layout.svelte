<script lang="ts">
	import '../lib/sinaui/ui/tokens.css';
	import '../app.css';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { InformationCircleIcon } from '@hugeicons/core-free-icons';
	import { i18n, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';
	import { applyTheme, theme } from '#lib/theme.svelte.js';
	import { watchTyping } from '#lib/phonetic.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	store.init();
	$effect(() => void (document.documentElement.lang = i18n.lang));
	applyTheme(theme.value);
	watchTyping();

	// A new version waits until every tab of the app is closed; offer to switch now instead.
	let waiting = $state<ServiceWorker>();
	navigator.serviceWorker?.getRegistration().then((reg) => {
		if (!reg) return;
		const check = () => {
			if (reg.waiting && navigator.serviceWorker.controller) waiting = reg.waiting;
		};
		check();
		reg.addEventListener('updatefound', () => reg.installing?.addEventListener('statechange', check));
		// An installed app can stay open for days; look for a new version whenever it comes back.
		document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && reg.update());
	});
	navigator.serviceWorker?.addEventListener('controllerchange', () => location.reload());

	// Once the on-screen keyboard has opened, bring the field being typed in to the middle of what's left.
	addEventListener('focusin', (e) => {
		const el = e.target as HTMLElement;
		if (!el.matches('input:not([type="checkbox"], [type="radio"]), textarea')) return;
		setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
	});
</script>

{#if store.status === 'ready'}
	{#if store.saveFailed}
		<Alert tone="danger" title={t('শেষ বদলটা সেভ হয়নি', 'Your last change wasn’t saved')} live>
			{t('ফোনের জায়গা ভরে গেছে কিনা দেখুন, তারপর অ্যাপটা আবার খুলুন।', 'Check that your phone has free space, then open the app again.')}
		</Alert>
	{/if}
	{#if waiting}
		<!-- One slim line at the top of the page; it scrolls away instead of sitting on the screen's header. -->
		<div class="update" role="status">
			<Icon icon={InformationCircleIcon} size={18} />
			<span class="grow small">{t('নতুন সংস্করণ এসেছে', 'A new version is ready')}</span>
			<Button size="sm" onclick={() => waiting?.postMessage('skip-waiting')}>{t('চালু করুন', 'Update')}</Button>
		</div>
	{/if}
	{@render children()}
{:else if store.status === 'failed'}
	<div class="failed">
		<p class="emoji" aria-hidden="true">😕</p>
		<h1 class="big">{t('অ্যাপটা খোলা যায়নি', 'The app couldn’t open')}</h1>
		<p class="muted">
			{t('অন্য কোনো ট্যাবে অ্যাপটা খোলা থাকলে সেটা বন্ধ করে আবার চেষ্টা করুন। প্রাইভেট উইন্ডো বা খুব পুরনো ব্রাউজারে তথ্য রাখা যায় না; সাধারণ উইন্ডোতে ক্রোম, এজ, ফায়ারফক্স বা সাফারির নতুন সংস্করণে খুলুন।',
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
	.update {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: calc(env(safe-area-inset-top) + 0.375rem) 1rem 0.375rem;
		background: var(--accent-soft);
		color: var(--ui-fg);
	}
</style>
