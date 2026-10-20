<script lang="ts">
	import { ArrowRight01Icon, FavouriteIcon, Search01Icon } from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Checkbox from '#lib/sinaui/ui/Checkbox.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import Segmented from '#lib/sinaui/ui/Segmented.svelte';
	import { categories, foodById, foods, type Food } from '#lib/data/foods.js';
	import { num, qty } from '#lib/format.js';
	import { matchScore } from '#lib/search.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { slotName, store } from '#lib/store.svelte.js';

	let q = $state('');
	let cat = $state(page.url.searchParams.get('cat') ?? 'all');

	const query = $derived(q.trim());
	const list = $derived(
		foods
			.filter((f) => cat === 'all' || f.category === cat)
			.map((f) => ({ f, score: matchScore(query, [f.bn, f.en, ...f.aliases]) }))
			.filter((x) => x.score >= 0)
			.sort((a, b) => a.score - b.score)
			.map((x) => x.f),
	);
	const quick = $derived([...new Set([...store.favourites, ...store.recent])].map((id) => foodById[id]).filter(Boolean));
	const toggle = (id: string) =>
		(store.cooked = store.cooked.includes(id) ? store.cooked.filter((x) => x !== id) : [...store.cooked, id]);
</script>

{#snippet row(f: Food)}
	{@const on = store.cooked.includes(f.id)}
	{@const fav = store.favourites.includes(f.id)}
	<div class="food" class:on>
		<Plate emoji={f.emoji} size={44} />
		<Checkbox class="grow" checked={on} onchange={() => toggle(f.id)}>
			<b>{name(f)}</b><br /><span class="small muted">{qty(1, f.unit)} · {num(f.kcal)} {t('ক্যালরি', 'kcal')}</span>
		</Checkbox>
		<Button variant="ghost" size="sm" square aria-label={fav ? t(`${f.bn} প্রিয় থেকে সরান`, `Remove ${f.en} from favourites`) : t(`${f.bn} প্রিয়তে রাখুন`, `Add ${f.en} to favourites`)}
			aria-pressed={fav} onclick={() => store.toggleFavourite(f.id)}>
			<Icon icon={FavouriteIcon} size={20} fill={fav ? 'var(--warm)' : 'none'} color={fav ? 'var(--warm)' : 'currentColor'} />
		</Button>
	</div>
{/snippet}

<Screen title={t('খাবার বেছে নিন', 'Choose foods')}>
	<p class="small muted">{slotName(store.slot)} · {t('যা যা খাবেন সবগুলোতে টিক দিন', 'Tick everything you’ll eat')}</p>
	<Input label={t('খাবার খুঁজুন', 'Search foods')} hideLabel type="search" bind:value={q} placeholder={t('খাবার খুঁজুন (যেমন: ডাল, মিষ্টি কুমড়া)', 'Search foods (e.g. dal, rice, ডাল)')}>
		{#snippet start()}<Icon icon={Search01Icon} size={20} />{/snippet}
	</Input>
	<Segmented label={t('ধরন', 'Category')} hideLabel bind:value={cat} options={categories.map((k) => ({ value: k.id, label: `${k.emoji} ${name(k)}` }))} />

	{#if !query && cat === 'all' && quick.length}
		<h2 class="section">{t('প্রিয় ও সাম্প্রতিক', 'Favourites & recent')}</h2>
		{#each quick as f (f.id)}{@render row(f)}{/each}
		<h2 class="section">{t('সব খাবার', 'All foods')}</h2>
	{/if}
	{#each list as f (f.id)}{@render row(f)}{:else}
		<EmptyState title={t('কিছু পাওয়া যায়নি', 'Nothing found')} icon={Search01Icon}>{t(`“${q}” নামে কিছু নেই। অন্য নামে খুঁজে দেখুন।`, `Nothing called “${q}”. Try another name.`)}</EmptyState>
	{/each}

	{#snippet footer()}
		{#if store.cooked.length}
			<Button size="lg" href={resolve('/plan')}>{t(`পরিমাণ ঠিক করুন (${num(store.cooked.length)}টি)`, `Set amounts (${store.cooked.length})`)} <Icon icon={ArrowRight01Icon} size={20} /></Button>
		{:else}
			<Button size="lg" disabled>{t('আগে খাবার বেছে নিন', 'Choose foods first')}</Button>
		{/if}
	{/snippet}
</Screen>

<style>
	.food {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		border-radius: calc(var(--ui-radius) * 1.5);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		outline: 1.5px solid transparent;
		transition: background-color var(--ui-dur) var(--ui-ease-out);
	}
	.food.on {
		background: var(--accent-soft);
		outline-color: var(--ui-accent);
	}
	.food b {
		font-weight: 600;
	}
</style>
