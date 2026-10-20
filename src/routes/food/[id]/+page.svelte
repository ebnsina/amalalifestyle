<script lang="ts">
	import { Add01Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import { categories, foodById } from '#lib/data/foods.js';
	import { num, qty } from '#lib/format.js';
	import { dailyTarget } from '#lib/nutrition.js';
	import { locale, name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const f = $derived(foodById[page.params.id ?? '']);
	const fav = $derived(!!f && store.favourites.includes(f.id));
	const target = $derived(store.profile ? dailyTarget(store.profile) : 2000);
	const energy = $derived(f ? f.protein * 4 + f.carbs * 4 + f.fat * 9 || 1 : 1);
	const macros = $derived(f ? [
		{ bn: 'আমিষ', en: 'Protein', g: f.protein, share: (f.protein * 4) / energy, color: '--protein' },
		{ bn: 'চর্বি', en: 'Fat', g: f.fat, share: (f.fat * 9) / energy, color: '--fat' },
		{ bn: 'শর্করা', en: 'Carbs', g: f.carbs, share: (f.carbs * 4) / energy, color: '--carbs' },
	] : []);
	const pct = (x: number) => new Intl.NumberFormat(locale(), { style: 'percent' }).format(x);
</script>

{#if !f}
	<Screen title="">
		<EmptyState title={t('এই খাবারটি খুঁজে পাওয়া যায়নি', 'This food wasn’t found')} />
	</Screen>
{:else}
	<Screen title={name(f)}>
		<div class="hero-art" aria-hidden="true">{f.emoji}</div>
		<div class="row">
			<div class="grow">
				<Badge tone="accent" icon={false}>{name(categories.find((k) => k.id === f.category)!)}</Badge>
				<p class="muted">{qty(1, f.unit)} ({t('প্রায়', 'about')} {num(f.grams)}{t(' গ্রাম', ' g')})</p>
			</div>
			<Button variant="secondary" square aria-label={fav ? t('প্রিয় থেকে সরান', 'Remove from favourites') : t('প্রিয়তে রাখুন', 'Add to favourites')} aria-pressed={fav}
				onclick={() => store.toggleFavourite(f.id)}>
				<Icon icon={FavouriteIcon} size={22} fill={fav ? 'var(--warm)' : 'none'} color={fav ? 'var(--warm)' : 'currentColor'} />
			</Button>
		</div>

		<Card>
			<div class="row">
				<div class="grow">
					<p class="muted">{t('প্রতি', 'Per')} {qty(1, f.unit)}</p>
					<p class="big">{num(f.kcal)} <span class="muted">{t('ক্যালরি', 'kcal')}</span></p>
					<p class="small muted">{t(`দিনের লক্ষ্যের ${num(Math.round((f.kcal / target) * 100))}%`, `${Math.round((f.kcal / target) * 100)}% of your daily target`)}</p>
				</div>
				<Progress shape="circle" size={80} label={t('দিনের লক্ষ্যের অংশ', 'Share of daily target')} hideLabel value={f.kcal} max={target}
					locale={locale()} style="--ui-accent: var(--warm)" />
			</div>
		</Card>

		<div class="macros">
			{#each macros as m (m.bn)}
				<Card class="center">
					<Progress shape="circle" size={60} label={name(m)} value={m.share} max={1} format={(v) => pct(v)}
						style="--ui-accent: var({m.color})" />
					<p class="xs muted">{num(Math.round(m.g))}{t(' গ্রাম', ' g')}</p>
				</Card>
			{/each}
		</div>

		<Alert title={t('নমুনা তথ্য', 'Sample values')}>{t('রান্নার তেল ও রেসিপিভেদে আসল মান কমবেশি হবে।', 'Real values vary with cooking oil and recipe.')}</Alert>

		{#snippet footer()}
			<Button size="lg" onclick={() => {
				if (!store.cooked.includes(f.id)) store.cooked = [...store.cooked, f.id];
				goto(resolve('/cook'));
			}}><Icon icon={Add01Icon} size={20} /> {t('খাবারে যোগ করুন', 'Add to meal')}</Button>
		{/snippet}
	</Screen>
{/if}

<style>
	.hero-art {
		display: grid;
		place-items: center;
		height: 200px;
		border-radius: calc(var(--ui-radius) * 1.5);
		background: var(--accent-soft);
		font-size: 100px;
	}
	.macros {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}
</style>
