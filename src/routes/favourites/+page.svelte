<script lang="ts">
	import { FavouriteIcon } from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import { foodById } from '#lib/data/foods.js';
	import { num, qty } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const list = $derived(store.favourites.map((id) => foodById[id]).filter(Boolean));
</script>

<Screen title={t('প্রিয় খাবার', 'Favourite foods')}>
	{#if !list.length}
		<EmptyState title={t('কোনো প্রিয় খাবার নেই', 'No favourites yet')} icon={FavouriteIcon}>{t('খাবারের পাশে ♡ চাপলে এখানে জমা থাকবে।', 'Tap ♡ next to a food to keep it here.')}</EmptyState>
	{/if}
	<div class="grid">
		{#each list as f, i (f.id)}
			<a class="food enter" style="--i: {i}" href={resolve('/food/[id]', { id: f.id })}>
				<span class="plate"><Plate emoji={f.emoji} size={80} /></span>
				<Badge tone={f.protein >= 10 ? 'accent' : 'warning'} icon={false}>{f.protein >= 10 ? t('আমিষ বেশি', 'High protein') : t('হালকা খাবার', 'Light food')}</Badge>
				<b>{name(f)}</b>
				<span class="small muted">{qty(1, f.unit)} · {num(f.kcal)} {t('ক্যালরি', 'kcal')}</span>
			</a>
		{/each}
	</div>
</Screen>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 1rem;
	}
	.food {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: calc(var(--ui-radius) * 1.5);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		color: inherit;
		text-decoration: none;
	}
	.plate {
		justify-self: center;
	}
	b {
		font-weight: 600;
	}
</style>
