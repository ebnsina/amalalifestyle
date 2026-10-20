<script lang="ts">
	import { Home01Icon, SpoonAndForkIcon, UserIcon } from '@hugeicons/core-free-icons';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	$effect(() => {
		if (!store.profile) goto(resolve('/welcome'), { replace: true });
	});

	const tabs = $derived([
		{ href: resolve('/(tabs)'), id: '/(tabs)', icon: Home01Icon, title: t('হোম', 'Home') },
		{ href: resolve('/(tabs)/food'), id: '/(tabs)/food', icon: SpoonAndForkIcon, title: t('খাবার', 'Food') },
		{ href: resolve('/(tabs)/profile'), id: '/(tabs)/profile', icon: UserIcon, title: t('প্রোফাইল', 'Profile') },
	]);
</script>

{#if store.profile}
	{@render children()}
	<nav aria-label={t('প্রধান', 'Main')}>
		{#each tabs as t (t.id)}
			{@const on = page.route.id === t.id}
			<a href={t.href} aria-current={on ? 'page' : undefined} class:on>
				<Icon icon={t.icon} size={22} />
				<span>{t.title}</span>
			</a>
		{/each}
	</nav>
{/if}

<style>
	nav {
		position: fixed;
		inset-inline: 1rem;
		bottom: calc(env(safe-area-inset-bottom) + 0.5rem);
		max-width: 26rem;
		margin: 0 auto;
		display: flex;
		padding: 6px;
		border-radius: 999px;
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-card);
	}
	a {
		flex: 1;
		min-height: 52px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		border-radius: 999px;
		color: var(--ui-muted);
		font-size: 0.8125rem;
		text-decoration: none;
		transition: flex var(--ui-dur) var(--ui-ease-out), background-color var(--ui-dur) var(--ui-ease-out);
	}
	a.on {
		flex: 1.4;
		flex-direction: row;
		gap: 6px;
		background: var(--ui-accent);
		color: var(--ui-on-accent);
		font-weight: 600;
	}
	a:focus-visible {
		outline: var(--ui-ring-width) solid var(--ui-ring);
		outline-offset: var(--ui-ring-offset);
	}
</style>
