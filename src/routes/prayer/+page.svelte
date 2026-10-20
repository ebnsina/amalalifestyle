<script lang="ts">
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Checkbox from '#lib/sinaui/ui/Checkbox.svelte';
	import { num, dayKey, lastDays, weekday } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { extra, fard, streak } from '#lib/prayer.js';
	import { store } from '#lib/store.svelte.js';

	const today = dayKey();
	const done = $derived(store.prayers[today] ?? []);
	const fardDone = $derived(fard.filter((p) => done.includes(p.id)).length);
</script>

{#snippet list(ps: typeof fard)}
	{#each ps as p (p.id)}
		<div class="prayer" class:on={done.includes(p.id)}>
			<Checkbox checked={done.includes(p.id)} onchange={() => store.togglePrayer(today, p.id)} hint={t(p.whenBn, p.whenEn)}>
				<b>{name(p)}</b>
			</Checkbox>
		</div>
	{/each}
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

	<h2 class="section">{t('গত সাত দিন (ফরজ)', 'Last seven days (fard)')}</h2>
	<Card>
		<div class="week">
			{#each lastDays(7) as d (d)}
				<div class="day">
					<span class="xs" class:muted={d !== today}>{weekday(d)}</span>
					{#each fard as p (p.id)}
						{@const on = (store.prayers[d] ?? []).includes(p.id)}
						<button class="dot" class:on aria-label="{weekday(d)} {name(p)}" aria-pressed={on}
							onclick={() => store.togglePrayer(d, p.id)}></button>
					{/each}
				</div>
			{/each}
		</div>
	</Card>
	<p class="xs muted center">{t('আগের দিনে চিহ্ন দিতে ভুলে গেলে ওপরের ঘরে চাপ দিন।', 'Forgot to tick an earlier day? Tap its dot above.')}</p>

	<Alert title={t('নামাজের সময়', 'Prayer times')}>{t('আপনার এলাকার মসজিদ বা ইসলামিক ফাউন্ডেশনের সময়সূচি দেখে নিন।', 'Check the timetable from your local mosque or the Islamic Foundation.')}</Alert>
</Screen>

<style>
	.prayer {
		padding: 0.75rem 1rem;
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
	.week {
		display: flex;
		justify-content: space-between;
	}
	.day {
		display: grid;
		justify-items: center;
		gap: 2px;
	}
	/* 18px dot inside a 32px tap area. */
	.dot {
		width: 32px;
		height: 26px;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}
	.dot::before {
		content: '';
		display: block;
		width: 18px;
		height: 18px;
		margin: auto;
		border-radius: 50%;
		background: var(--line);
		transition: background-color var(--ui-dur) var(--ui-ease-out);
	}
	.dot.on::before {
		background: var(--ui-accent);
	}
	.dot:focus-visible {
		outline: var(--ui-ring-width) solid var(--ui-ring);
		border-radius: 8px;
	}
</style>
