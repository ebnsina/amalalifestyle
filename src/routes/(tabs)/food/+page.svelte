<script lang="ts">
	import { Add01Icon, ArrowRight01Icon, Calendar03Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import { num, dateLabel, qty } from '#lib/format.js';
	import { locale, name, t } from '#lib/i18n.svelte.js';
	import { dailyTarget, kcalOf } from '#lib/nutrition.js';
	import { nextSlot, slotName, slots, store, type Slot } from '#lib/store.svelte.js';

	const target = $derived(dailyTarget(store.profile!));
	const eaten = $derived(Math.round(store.today.reduce((s, m) => s + kcalOf(m.portions), 0)));
	const left = $derived(target - eaten);
	// The meal that fits the time of day, or the first one still empty.
	const open = $derived(slots.map((s) => s.id).filter((id) => !store.today.some((m) => m.slot === id)));
	const suggested = $derived(open.includes(nextSlot()) ? nextSlot() : open[0]);

	// Editing a logged meal starts from what was saved; a new one starts empty.
	const openSlot = (slot: Slot) => {
		store.slot = slot;
		store.cooked = store.today.find((m) => m.slot === slot)?.portions.map((p) => p.food.id) ?? [];
		goto(resolve('/cook'));
	};
</script>

<svelte:head><title>{t('আজকের খাবার', 'Today’s food')} · {t('আমালা', 'AMALA')}</title></svelte:head>

<Screen tabs>
	<div class="row">
		<div class="grow">
			<p class="small muted">{dateLabel(new Date())}</p>
			<h1 class="big">{t('আজকের খাবার', 'Today’s food')}</h1>
		</div>
		<Button variant="secondary" square href={resolve('/favourites')} aria-label={t('প্রিয় খাবার', 'Favourite foods')}><Icon icon={FavouriteIcon} size={20} /></Button>
		<Button variant="secondary" square href={resolve('/history')} aria-label={t('আগের দিনগুলো', 'Past days')}><Icon icon={Calendar03Icon} size={20} /></Button>
	</div>

	<Card class="enter">
		<div class="row">
			<Progress shape="circle" size={88} label={t('দিনের লক্ষ্য', 'Daily target')} hideLabel value={Math.min(eaten, target)} max={target}
				locale={locale()} style="--ui-accent: var({left < 0 ? '--warm' : '--ui-accent'})" />
			<div class="grow">
				<p class="small muted">{left < 0 ? t('আজকের লক্ষ্যের চেয়ে বেশি', 'Over today’s target by') : t('আজ আরও খেতে পারবেন প্রায়', 'You can still eat about')}</p>
				<p class="big" style:color="var({left < 0 ? '--warm' : '--ui-accent'})">
					{num(Math.abs(left))} <span class="small muted">{t('ক্যালরি', 'kcal')}</span>
				</p>
				<p class="xs muted">{t('খেয়েছেন', 'Eaten')} {num(eaten)} · {t('লক্ষ্য', 'Target')} {num(target)}</p>
			</div>
		</div>
	</Card>

	{#if suggested}
		<Button size="lg" onclick={() => openSlot(suggested)}><Icon icon={Add01Icon} size={20} /> {t(`${slotName(suggested)} লিখুন`, `Log ${slotName(suggested).toLowerCase()}`)}</Button>
	{:else}
		<Alert title={t('আজকের সব বেলা লেখা হয়ে গেছে', 'All of today’s meals are logged')}>{t('কোনো বেলা বদলাতে নিচে চাপুন।', 'Tap a meal below to change it.')}</Alert>
	{/if}

	<h2 class="section">{t('চার বেলা', 'Meals')}</h2>
	{#each slots as s, i (s.id)}
		{@const id = s.id}
		{@const meal = store.today.find((m) => m.slot === id)}
		<button class="meal enter" style="--i: {i + 1}" onclick={() => openSlot(id)}>
			<Plate emoji={meal ? meal.portions[0].food.emoji : '🍽️'} size={44} />
			<span class="grow">
				<span class="row"><b>{name(s)}</b>{#if !meal && id === suggested}<Badge tone="warning" icon={false}>{t('এখন', 'Now')}</Badge>{/if}</span>
				<span class="small muted line">
					{meal ? meal.portions.map((p) => `${name(p.food)} ${qty(p.units, p.food.unit)}`).join(' · ') : t('চাপ দিয়ে লিখুন', 'Tap to log')}
				</span>
			</span>
			{#if meal}
				<b class="kcal">{num(Math.round(kcalOf(meal.portions)))}</b>
			{:else}
				<Icon icon={ArrowRight01Icon} size={18} class="muted" />
			{/if}
		</button>
	{/each}

	<p class="xs muted center">{t('সব হিসাব আনুমানিক। তেল আর রেসিপিভেদে কমবেশি হয়।', 'All numbers are estimates. Oil and recipes make them vary.')}</p>
</Screen>

<style>
	.meal {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border: 0;
		border-radius: calc(var(--ui-radius) * 1.5);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	.meal:focus-visible {
		outline: var(--ui-ring-width) solid var(--ui-ring);
		outline-offset: var(--ui-ring-offset);
	}
	.meal b {
		font-weight: 600;
	}
	.line {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.kcal {
		color: var(--ui-accent);
	}
</style>
