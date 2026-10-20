<script lang="ts">
	import { Download04Icon } from '@hugeicons/core-free-icons';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Drawer from '#lib/sinaui/ui/Drawer.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { t } from '#lib/i18n.svelte.js';
	import { install, promptInstall } from '#lib/install.svelte.js';

	// dismissible: Home offers "later" and remembers it; Profile always shows the card until installed.
	let { dismissible = false }: { dismissible?: boolean } = $props();

	const seen = () => {
		try {
			return localStorage.getItem('install-later') === '1';
		} catch {
			return false;
		}
	};
	let later = $state(seen());
	let help = $state(false);

	async function start() {
		if (!(await promptInstall())) help = true;
	}
	function hide() {
		later = true;
		try {
			localStorage.setItem('install-later', '1');
		} catch {
			// Private mode: hidden until the page reloads.
		}
	}
</script>

{#if !install.installed && !(dismissible && later)}
	<Card title={t('অ্যাপটি ফোনে বসান', 'Install the app')} level={2}>
		<p class="small muted">
			{t('হোম স্ক্রিন থেকে এক চাপে খুলুন, অন্য অ্যাপের মতো। ইন্টারনেট ছাড়াও চলবে।', 'Open it from your home screen like any other app. It works without internet.')}
		</p>
		{#snippet footer()}
			<div class="actions">
				{#if dismissible}<Button variant="ghost" size="sm" onclick={hide}>{t('পরে', 'Later')}</Button>{/if}
				<Button size="sm" onclick={start}><Icon icon={Download04Icon} size={16} /> {t('ইনস্টল করুন', 'Install')}</Button>
			</div>
		{/snippet}
	</Card>
{/if}

<Drawer bind:open={help} title={t('যেভাবে ইনস্টল করবেন', 'How to install')} closeLabel={t('বন্ধ করুন', 'Close')}>
	<ol class="steps">
		{#if install.ios}
			<li>{t('নিচের শেয়ার বোতামে (⬆️ চিহ্ন) চাপ দিন।', 'Tap the Share button (⬆️) at the bottom.')}</li>
			<li>{t('“হোম স্ক্রিনে যোগ করুন” (Add to Home Screen) বেছে নিন।', 'Choose “Add to Home Screen”.')}</li>
			<li>{t('ওপরে ডানদিকে “যোগ করুন” চাপুন।', 'Tap “Add” at the top right.')}</li>
		{:else}
			<li>{t('ব্রাউজারের মেনু খুলুন (ওপরে ডানদিকে ⋮)।', 'Open the browser menu (⋮ at the top right).')}</li>
			<li>{t('“অ্যাপ ইনস্টল করুন” বা “হোম স্ক্রিনে যোগ করুন” চাপুন।', 'Tap “Install app” or “Add to Home screen”.')}</li>
			<li>{t('“ইনস্টল” চেপে নিশ্চিত করুন।', 'Confirm with “Install”.')}</li>
		{/if}
	</ol>
	<p class="small muted">{t('এরপর হোম স্ক্রিনে আমালার আইকন দেখবেন।', 'You’ll then see the AMALA icon on your home screen.')}</p>
	{#snippet footer()}
		<Button onclick={() => (help = false)}>{t('বুঝেছি', 'Got it')}</Button>
	{/snippet}
</Drawer>

<style>
	.steps {
		display: grid;
		gap: 0.75rem;
		margin: 0 0 1rem;
		padding-inline-start: 1.25rem;
	}
</style>
