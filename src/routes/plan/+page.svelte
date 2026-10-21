<script lang="ts">
	import { Add01Icon, Delete02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Plate from '#lib/components/Plate.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import ConfirmButton from '#lib/sinaui/ui/ConfirmButton.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import NumberField from '#lib/sinaui/ui/NumberField.svelte';
	import * as Tabs from '#lib/sinaui/ui/tabs/index.js';
	import { num, qty, unitName } from '#lib/format.js';
	import { compareToBudget, dailyTarget, kcalOf, macrosOf, recommend } from '#lib/nutrition.js';
	import { i18n, locale, name, t } from '#lib/i18n.svelte.js';
	import { slotName, slots, store, type Slot } from '#lib/store.svelte.js';

	let done = $state<Slot | null>(null);
	// Hand-set amounts per meal; anything not set uses the suggestion (or what was saved before).
	let edits = $state<Partial<Record<Slot, Record<string, number>>>>({});

	const slot = $derived(store.slot);
	const saved = $derived(store.today.find((m) => m.slot === slot));
	const others = $derived(store.today.filter((m) => m.slot !== slot));
	const target = $derived(dailyTarget(store.profile!));
	const remaining = $derived(target - others.reduce((s, m) => s + kcalOf(m.portions), 0));
	const mealsLeft = $derived(store.profile!.mealsPerDay - others.filter((m) => m.slot !== 'snack').length);
	const rec = $derived(recommend(store.cooked.map((id) => store.foodById[id]).filter(Boolean), remaining, mealsLeft, slot === 'snack'));
	const portions = $derived(rec.portions.map((p) => ({
		food: p.food,
		units: edits[slot]?.[p.food.id] ?? saved?.portions.find((x) => x.food.id === p.food.id)?.units ?? p.units,
	})));
	const total = $derived(Math.round(kcalOf(portions)));
	const m = $derived(macrosOf(portions));
	const next = $derived(slots.find((s) => !store.today.some((x) => x.slot === s.id)));
	const doneMeal = $derived(store.today.find((x) => x.slot === done));

	const setUnits = (id: string, v: number) => (edits[slot] = { ...edits[slot], [id]: v });
	const toFood = () => goto(resolve('/(tabs)/food'), { replace: true });

	function save() {
		store.saveMeal({ slot, portions: portions.filter((p) => p.units > 0) });
		done = slot;
		store.cooked = [];
	}
	function remove() {
		store.saveMeal({ slot, portions: [] });
		store.cooked = [];
		toFood();
	}

	const look = {
		near: ['--ui-accent', '--accent-soft'],
		over: ['--warm', '--warm-soft'],
		under: ['--blue', '--blue-soft'],
	};
	const cmp = $derived(compareToBudget(total, rec.budget));
	const [ink, soft] = $derived(look[cmp.state]);
	const dayLeft = $derived(Math.round(remaining - total));
	const label = $derived(cmp.state === 'near' ? t('পরামর্শের কাছাকাছি ✓', 'Close to the suggestion ✓')
		: cmp.state === 'over' ? t(`পরামর্শের চেয়ে ${num(cmp.diff)} ক্যালরি বেশি`, `${num(cmp.diff)} kcal over the suggestion`)
		: t(`পরামর্শের চেয়ে ${num(-cmp.diff)} ক্যালরি কম`, `${num(-cmp.diff)} kcal under the suggestion`));
	const tip = $derived(cmp.state === 'over' ? t('চাইলে কোনো খাবারের পরিমাণ একটু কমিয়ে দেখুন।', 'You could cut one food back a little.')
		: cmp.state === 'under' && slot !== 'snack' ? t('ক্ষুধা থাকলে ডাল বা সবজি একটু বাড়াতে পারেন।', 'If you’re still hungry, add a little more dal or vegetables.') : '');
</script>

{#if done}
	<Screen title="">
		<div class="saved enter">
			<span class="tick"><Icon icon={Tick02Icon} size={40} strokeWidth={2.5} /></span>
			<h2 class="big">{t(`${slotName(done)} লেখা হয়েছে`, `${slotName(done)} logged`)}</h2>
			{#if doneMeal}<p class="muted">{num(Math.round(kcalOf(doneMeal.portions)))} {t('ক্যালরি', 'kcal')}</p>{/if}
		</div>
		<p class="muted center">{next ? t('আরেক বেলার খাবার এখনই লিখে রাখতে পারেন।', 'You can log another meal now.') : t('আজকের চার বেলাই লেখা হয়ে গেছে।', 'All four of today’s meals are logged.')}</p>
		{#snippet footer()}
			{#if next}
				<Button size="lg" variant="ghost" onclick={toFood}>{t('এখন না', 'Not now')}</Button>
				<Button size="lg" onclick={() => { store.slot = next.id; history.back(); }}><Icon icon={Add01Icon} size={20} /> {name(next)}</Button>
			{:else}
				<Button size="lg" onclick={toFood}>{t('ঠিক আছে', 'Done')}</Button>
			{/if}
		{/snippet}
	</Screen>
{:else if !portions.length}
	<Screen title={t('কতটুকু খাবেন', 'How much to eat')}>
		<EmptyState title={t('কোনো খাবার বাছাই করা নেই', 'No foods chosen')}>
			{#snippet actions()}<Button variant="secondary" href={resolve('/cook')}>{t('খাবার বেছে নিন', 'Choose foods')}</Button>{/snippet}
		</EmptyState>
	</Screen>
{:else}
	<Screen title={t('কতটুকু খাবেন', 'How much to eat')}>
		<Tabs.Root bind:value={() => store.slot, (v) => (store.slot = v as Slot)}>
			<Tabs.List label={t('কোন বেলা', 'Which meal')}>
				{#each slots as s (s.id)}<Tabs.Tab value={s.id}>{name(s)}</Tabs.Tab>{/each}
			</Tabs.List>
			{#each slots as s (s.id)}
				<Tabs.Panel value={s.id}>
					{#if slot === s.id}
						<div class="stack">
						{#if rec.lowBudget}
							<Alert tone="warning" title={t('আজকের হিসাব প্রায় শেষ', 'Today’s budget is nearly used')}>{t('তবু না খেয়ে থাকবেন না — নিচে হালকা কিন্তু পুষ্টিকর পরিমাণ দেওয়া হলো।', 'Don’t skip the meal — below are light but nourishing amounts.')}</Alert>
						{:else}
							<p class="muted">{#if i18n.lang === 'en'}About <b>{num(rec.budget)} kcal</b> at this meal keeps your day on track. Change amounts with +/−.{:else}এই বেলায় প্রায় <b>{num(rec.budget)} ক্যালরি</b> খেলে দিনের হিসাব ঠিক থাকবে। দরকার হলে +/− দিয়ে বদলান।{/if}</p>
						{/if}

						{#each portions as { food, units } (food.id)}
							<Card>
								<div class="row portion">
									<Plate emoji={food.emoji} size={40} />
									<div class="grow">
										<b>{name(food)}</b>
										<p class="small muted">{qty(units, food.unit)} · {num(Math.round(food.kcal * units))} {t('ক্যালরি', 'kcal')}</p>
									</div>
									<Button variant="ghost" size="sm" square aria-label={t(`${food.bn} বাদ দিন`, `Remove ${food.en}`)}
										onclick={() => (store.cooked = store.cooked.filter((id) => id !== food.id))}>
										<Icon icon={Delete02Icon} size={18} />
									</Button>
								</div>
								<NumberField label={t(`পরিমাণ (${food.unit})`, `Amount (${unitName(food.unit)})`)} locale={locale()} min={0} max={50} step={food.step}
									bind:value={() => units, (v) => setUnits(food.id, v ?? 0)} />
							</Card>
						{/each}

						<div class="actions"><Button size="sm" variant="secondary" href={resolve('/cook')}><Icon icon={Add01Icon} size={16} /> {t('আরও খাবার যোগ করুন', 'Add more foods')}</Button></div>

						<Card>
							<div class="summary" style:--ink="var({ink})" style:--soft="var({soft})">
								<div class="row between">
									<b>{t('এই বেলায় মোট', 'This meal')}</b>
									<span class="big ink num">{num(total)} <span class="small muted">{t('ক্যালরি', 'kcal')}</span></span>
								</div>
								<div class="meter"><span style:width="{Math.min(100, (total / Math.max(rec.budget, total, 1)) * 100)}%"></span></div>
								<div class="cells">
									{#each [[t('পরামর্শ', 'Suggested'), rec.budget], [t('বেছেছেন', 'Chosen'), total]] as [k, v] (k)}
										<div><span class="xs muted">{k}</span><b class="num">{num(v as number)}</b></div>
									{/each}
									{#each [cmp.diff] as v (v)}
										<div><span class="xs muted">{t('পার্থক্য', 'Difference')}</span><b class="ink num">{v > 0 ? '+' : ''}{num(v)}</b></div>
									{/each}
								</div>
								<span class="pill small">{label}</span>
								<p class="small muted">
									{dayLeft >= 0 ? t(`এটা খেলে আজ আরও প্রায় ${num(dayLeft)} ক্যালরি বাকি থাকবে।`, `After this you’ll have about ${num(dayLeft)} kcal left today.`)
										: t(`এটা খেলে আজকের লক্ষ্যের চেয়ে প্রায় ${num(-dayLeft)} ক্যালরি বেশি হবে।`, `This puts you about ${num(-dayLeft)} kcal over today’s target.`)}
									{tip}
								</p>
						</div>
					</Card>
					<p class="small muted center">
						{t('আমিষ', 'Protein')} {num(Math.round(m.protein))}{t(' গ্রাম', 'g')} · {t('শর্করা', 'Carbs')} {num(Math.round(m.carbs))}{t(' গ্রাম', 'g')} · {t('চর্বি', 'Fat')} {num(Math.round(m.fat))}{t(' গ্রাম', 'g')}
					</p>

					{#if saved}
						<div class="actions"><ConfirmButton size="sm" onconfirm={remove} confirm={t('সত্যিই মুছবেন?', 'Delete it?')} done={t('মোছা হয়েছে', 'Deleted')}>{t('এই বেলার হিসাব মুছুন', 'Delete this meal')}</ConfirmButton></div>
					{/if}
						</div>
					{/if}
				</Tabs.Panel>
			{/each}
		</Tabs.Root>

		{#snippet footer()}
			<Button size="lg" onclick={save} disabled={total === 0}>
				<Icon icon={Tick02Icon} size={20} /> {saved ? t('বদলগুলো সেভ করুন', 'Save changes') : t('খেয়েছি, লিখে রাখুন', 'I ate this — log it')}
			</Button>
		{/snippet}
	</Screen>
{/if}

<style>
	.saved {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		padding-top: 2rem;
	}
	.tick {
		display: grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: var(--ui-accent);
		color: var(--ui-on-accent);
	}
	.portion {
		margin-bottom: 0.5rem;
	}
	b {
		font-weight: 600;
	}
	.summary {
		display: grid;
		gap: 1rem;
	}
	.between {
		justify-content: space-between;
	}
	.ink {
		color: var(--ink);
	}
	.meter {
		height: 10px;
		border-radius: 999px;
		background: var(--soft);
		overflow: hidden;
	}
	.meter span {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--ink);
		transition: width 300ms var(--ui-ease-out), background-color 300ms;
	}
	.cells {
		display: flex;
		gap: 0.5rem;
	}
	.cells > div {
		flex: 1;
		display: grid;
		justify-items: center;
		padding: 0.5rem;
		border-radius: var(--ui-radius);
		background: var(--ui-bg);
	}
	.pill {
		justify-self: start;
		padding: 0.25rem 1rem;
		border-radius: 999px;
		background: var(--soft);
		color: var(--ink);
		font-weight: 600;
	}
</style>
