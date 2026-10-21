<script lang="ts">
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Checkbox from '#lib/sinaui/ui/Checkbox.svelte';
	import { num, dayKey, lastDays, weekday } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { extra, fard, streak, summary } from '#lib/prayer.js';
	import RangeFilter from '#lib/components/RangeFilter.svelte';
	import Progress from '#lib/sinaui/ui/Progress.svelte';
	import { daysOf, lastN, type DayRange } from '#lib/range.js';
	import { store } from '#lib/store.svelte.js';
	import { rowToggle } from '#lib/row-toggle.js';

	const today = dayKey();
	const done = $derived(store.prayers[today] ?? []);
	const fardDone = $derived(fard.filter((p) => done.includes(p.id)).length);
	let range = $state<DayRange | undefined>(lastN(30));
	const days = $derived(daysOf(range ?? lastN(30)));
	const sum = $derived(summary(store.prayers, days));
	const ratio = (v: number, max: number) => `${num(v)}/${num(max)}`;
</script>

{#snippet list(ps: typeof fard)}
	<div class="pgrid">
	{#each ps as p (p.id)}
		<div class="prayer" class:on={done.includes(p.id)} {@attach rowToggle}>
			<Checkbox checked={done.includes(p.id)} onchange={() => store.togglePrayer(today, p.id)} hint={t(p.whenBn, p.whenEn)}>
				<b>{name(p)}</b>
			</Checkbox>
		</div>
	{/each}
	</div>
{/snippet}

<Screen title={t('নামাজের হিসাব', 'Prayer tracker')}>
	<Card>
		<div class="stats">
			<div><b>{num(fardDone)} / {num(5)}</b><span class="xs muted">{t('আজকের ফরজ', 'Fard today')}</span></div>
			<div><b>{num(streak(store.prayers))} {t('দিন', 'days')}</b><span class="xs muted">{t('টানা পাঁচ ওয়াক্ত', 'All five, in a row')}</span></div>
		</div>
	</Card>
	{#if fardDone === 5}<p class="muted center">{t('আলহামদুলিল্লাহ, আজকের পাঁচ ওয়াক্ত পূর্ণ 🤲', 'Alhamdulillah, all five prayers done today 🤲')}</p>{/if}

	<h2 class="section">{t('ফরজ নামাজ', 'Fard prayers')}</h2>
	{@render list(fard)}
	<h2 class="section">{t('বিতর ও নফল', 'Witr & nafl')}</h2>
	{@render list(extra)}

	<h2 class="section">{t('গত সাত দিন', 'Last seven days')}</h2>
	<Card>
		<div class="week" role="group" aria-label={t('গত সাত দিনের নামাজ', 'Prayers over the last seven days')}>
			<span></span>
			{#each lastDays(7) as d (d)}
				<span class="xs head" class:today={d === today} title={weekday(d)}>{weekday(d, 'narrow')}</span>
			{/each}
			{#each [fard, extra] as group, g (g)}
				{#if g}<hr />{/if}
				{#each group as p (p.id)}
					<span class="xs name">{name(p).split(' ')[0]}</span>
					{#each lastDays(7) as d (d)}
						{@const on = (store.prayers[d] ?? []).includes(p.id)}
						<button class="dot" class:on class:nafl={g === 1} aria-label="{weekday(d)} {name(p)}" aria-pressed={on}
							onclick={() => store.togglePrayer(d, p.id)}></button>
					{/each}
				{/each}
			{/each}
		</div>
		<p class="xs muted legend"><span class="key"></span>{t('ফরজ', 'Fard')} <span class="key nafl"></span>{t('বিতর ও নফল', 'Witr & nafl')}</p>
	</Card>
	<p class="xs muted center">{t('আগের দিনে চিহ্ন দিতে ভুলে গেলে সেই দিনের ঘরে চাপ দিন।', 'Forgot to tick an earlier day? Tap its dot above.')}</p>

	<Card title={t('হিসাব', 'Summary')} level={2}>
		<div class="stack">
			<RangeFilter label={t('কোন সময়ের হিসাব', 'Dates')} bind:value={range} />
			<p><b class="num">{num(sum.full)}/{num(days.length)}</b> {t('দিন পাঁচ ওয়াক্তই পড়েছেন', 'days with all five fard')}</p>
			{#each fard as p (p.id)}
				<Progress label={name(p)} value={sum.per[p.id]} max={days.length} format={ratio} />
			{/each}
			<hr />
			{#each extra as p (p.id)}
				<Progress label={name(p)} value={sum.per[p.id]} max={days.length} format={ratio} style="--ui-accent: var(--blue)" />
			{/each}
		</div>
	</Card>

	<Alert title={t('নামাজের সময়', 'Prayer times')}>{t('আপনার এলাকার মসজিদ বা ইসলামিক ফাউন্ডেশনের সময়সূচি দেখে নিন।', 'Check the timetable from your local mosque or the Islamic Foundation.')}</Alert>
</Screen>

<style>
	/* Two prayers a row, so all ten fit without much scrolling. */
	.pgrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.5rem;
	}
	.prayer {
		cursor: pointer;
		padding: 0.625rem 0.75rem;
		border-radius: var(--ui-radius);
		background: var(--ui-surface);
		outline: 1.5px solid var(--line);
		transition: background-color var(--ui-dur) var(--ui-ease-out);
	}
	.prayer.on {
		background: var(--accent-soft);
		outline-color: var(--ui-accent);
	}
	.prayer b {
		font-weight: 600;
	}
	/* Prayer names down the side, one column per day. */
	.week {
		display: grid;
		grid-template-columns: auto repeat(7, minmax(0, 1fr));
		align-items: center;
		row-gap: 2px;
	}
	.head {
		text-align: center;
		color: var(--ui-muted);
	}
	.head.today {
		color: var(--ui-accent);
		font-weight: 600;
	}
	.name {
		padding-inline-end: 0.5rem;
		white-space: nowrap;
	}
	hr {
		grid-column: 1 / -1;
		width: 100%;
		margin: 0.375rem 0;
		border: 0;
		border-top: 1px solid var(--line);
	}
	/* 16px dot inside a 28px-tall tap area as wide as its column. */
	.dot {
		height: 28px;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}
	.dot::before, .key {
		content: '';
		display: block;
		width: 16px;
		height: 16px;
		margin: auto;
		border-radius: 50%;
		background: var(--line);
		transition: background-color var(--ui-dur) var(--ui-ease-out);
	}
	.dot.on::before, .key {
		background: var(--ui-accent);
	}
	.dot.nafl.on::before, .key.nafl {
		background: var(--blue);
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-top: 0.75rem;
	}
	.key {
		display: inline-block;
		width: 10px;
		height: 10px;
		margin: 0 0 0 0.5rem;
	}
	.key:first-child {
		margin-inline-start: 0;
	}
	.dot:focus-visible {
		outline: var(--ui-ring-width) solid var(--ui-ring);
		border-radius: 8px;
	}
</style>
