<script lang="ts">
	import { Add01Icon, ArrowRight01Icon, FavouriteIcon, PencilEdit02Icon, Search01Icon } from '@hugeicons/core-free-icons';
	import FoodForm from '#lib/components/FoodForm.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Checkbox from '#lib/sinaui/ui/Checkbox.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import CustomSelect from '#lib/sinaui/ui/CustomSelect.svelte';
	import { categories, type Food } from '#lib/data/foods.js';
	import { num, qty } from '#lib/format.js';
	import { matchScore } from '#lib/search.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { slotName, store } from '#lib/store.svelte.js';
	import { rowToggle } from '#lib/row-toggle.js';

	let q = $state('');
	let adding = $state(false);
	let cat = $state(page.url.searchParams.get('cat') ?? 'all');

	const query = $derived(q.trim());
	const list = $derived(
		store.allFoods
			.filter((f) => cat === 'all' || f.category === cat)
			.map((f) => ({ f, score: matchScore(query, [f.bn, f.en, ...f.aliases]) }))
			.filter((x) => x.score >= 0)
			.sort((a, b) => a.score - b.score)
			.map((x) => x.f),
	);
	const quick = $derived([...new Set([...store.favourites, ...store.recent])].map((id) => store.foodById[id]).filter(Boolean));
	const toggle = (id: string) =>
		(store.cooked = store.cooked.includes(id) ? store.cooked.filter((x) => x !== id) : [...store.cooked, id]);
</script>

{#snippet row(f: Food)}
	{@const on = store.cooked.includes(f.id)}
	{@const fav = store.favourites.includes(f.id)}
	<div class="food" class:on {@attach rowToggle}>
		<div class="top">
			<Plate emoji={f.emoji} size={36} />
			<span class="grow"></span>
			{#if f.custom}
				<Button variant="ghost" size="sm" square href={resolve('/food/[id]', { id: f.id })} aria-label={t(`${f.bn} দেখুন ও বদলান`, `View and edit ${f.en}`)}>
					<Icon icon={PencilEdit02Icon} size={16} />
				</Button>
			{/if}
			<Button variant="ghost" size="sm" square aria-label={fav ? t(`${f.bn} প্রিয় থেকে সরান`, `Remove ${f.en} from favourites`) : t(`${f.bn} প্রিয়তে রাখুন`, `Add ${f.en} to favourites`)}
				aria-pressed={fav} onclick={() => store.toggleFavourite(f.id)}>
				<Icon icon={FavouriteIcon} size={18} fill={fav ? 'var(--warm)' : 'none'} color={fav ? 'var(--warm)' : 'currentColor'} />
			</Button>
		</div>
		<Checkbox checked={on} onchange={() => toggle(f.id)}>
			<b>{name(f)}</b><br /><span class="xs muted">{qty(1, f.unit)} · {num(f.kcal)} {t('ক্যালরি', 'kcal')}</span>
		</Checkbox>
	</div>
{/snippet}

<Screen title={t('খাবার বেছে নিন', 'Choose foods')}>
	<div class="row">
		<p class="small muted grow">{slotName(store.slot)} · {t('যা যা খাবেন সবগুলোতে টিক দিন', 'Tick everything you’ll eat')}</p>
		<Button size="sm" variant="secondary" onclick={() => (adding = true)}><Icon icon={Add01Icon} size={16} /> {t('নতুন খাবার', 'New food')}</Button>
	</div>
	<!-- A food someone adds here is for this meal, so it starts ticked. -->
	<FoodForm bind:open={adding} onsaved={(id) => !store.cooked.includes(id) && (store.cooked = [...store.cooked, id])} />
	<div class="row toolbar">
		<div class="grow">
			<Input label={t('খুঁজুন', 'Search')} type="search" bind:value={q} placeholder={t('যেমন: ডাল, শসা', 'e.g. dal, oats')}>
				{#snippet start()}<Icon icon={Search01Icon} size={18} />{/snippet}
			</Input>
		</div>
		<div class="filter">
			<CustomSelect label={t('ধরন', 'Category')} bind:value={cat}
				options={categories.map((k) => ({ value: k.id, label: `${k.emoji} ${name(k)}` }))} />
		</div>
	</div>

	{#if !query && cat === 'all' && quick.length}
		<h2 class="section">{t('প্রিয় ও সাম্প্রতিক', 'Favourites & recent')}</h2>
		<div class="grid">{#each quick as f (f.id)}{@render row(f)}{/each}</div>
		<h2 class="section">{t('সব খাবার', 'All foods')}</h2>
	{/if}
	<div class="grid">
		{#each list as f (f.id)}{@render row(f)}{/each}
	</div>
	{#if !list.length}
		<EmptyState title={t('কিছু পাওয়া যায়নি', 'Nothing found')} icon={Search01Icon}>{t(`“${q}” নামে কিছু নেই। অন্য নামে খুঁজে দেখুন।`, `Nothing called “${q}”. Try another name.`)}</EmptyState>
	{/if}

	{#snippet footer()}
		{#if store.cooked.length}
			<Button size="lg" href={resolve('/plan')}>{t(`পরিমাণ ঠিক করুন (${num(store.cooked.length)}টি)`, `Set amounts (${store.cooked.length})`)} <Icon icon={ArrowRight01Icon} size={20} /></Button>
		{:else}
			<Button size="lg" disabled>{t('আগে খাবার বেছে নিন', 'Choose foods first')}</Button>
		{/if}
	{/snippet}
</Screen>

<style>
	.toolbar {
		align-items: end;
		gap: 0.5rem;
	}
	.filter {
		width: 9.5rem;
		flex: none;
	}
	/* Two cards a row on phones, three when there's room. */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.5rem;
	}
	.food {
		display: grid;
		gap: 0.375rem;
		padding: 0.5rem 0.5rem 0.75rem 0.75rem;
		border-radius: var(--ui-radius);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		outline: 1.5px solid transparent;
		cursor: pointer;
		transition: background-color var(--ui-dur) var(--ui-ease-out);
	}
	.food.on {
		background: var(--accent-soft);
		outline-color: var(--ui-accent);
	}
	.top {
		display: flex;
		align-items: center;
	}
	.food b {
		font-weight: 600;
	}
</style>
