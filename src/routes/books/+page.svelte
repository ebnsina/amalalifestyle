<script lang="ts">
	import { Add01Icon, Book02Icon } from '@hugeicons/core-free-icons';
	import * as v from 'valibot';
	import Screen from '#lib/components/Screen.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import ConfirmButton from '#lib/sinaui/ui/ConfirmButton.svelte';
	import Drawer from '#lib/sinaui/ui/Drawer.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import NumberField from '#lib/sinaui/ui/NumberField.svelte';
	import { num, parseNum } from '#lib/format.js';
	import { BookSchema, type Book } from '#lib/schema.js';
	import { locale, t } from '#lib/i18n.svelte.js';
	import RangeFilter from '#lib/components/RangeFilter.svelte';
	import { daysOf, lastN, type DayRange } from '#lib/range.js';
	import { store } from '#lib/store.svelte.js';

	let adding = $state(false);
	let title = $state('');
	let pages = $state('');
	let error = $state(false);
	// The book whose page is being typed, and the one just saved (for the "Saved" note).
	let typing = $state<string | null>(null);
	let saved = $state<string | null>(null);

	const reading = $derived(store.books.filter((b) => b.read < b.pages));
	const finished = $derived(store.books.filter((b) => b.read >= b.pages));
	let range = $state<DayRange | undefined>(lastN(7));
	const days = $derived(daysOf(range ?? lastN(7)));
	const pagesOf = (id: string) => days.reduce((n, d) => n + (store.reading[d]?.[id] ?? 0), 0);
	const totalPages = $derived(days.reduce((n, d) => n + Object.values(store.reading[d] ?? {}).reduce((a, b) => a + b, 0), 0));
	const readingDays = $derived(days.filter((d) => Object.keys(store.reading[d] ?? {}).length).length);

	function add(e: SubmitEvent) {
		e.preventDefault();
		const parsed = v.safeParse(BookSchema, { id: Date.now().toString(36), title, pages: parseNum(pages), read: 0 });
		if (!parsed.success) return (error = true);
		store.setBooks([parsed.output, ...store.books]);
		title = ''; pages = ''; error = false; adding = false;
	}
</script>

{#snippet book(b: Book, i: number)}
	<Card class="enter" style="--i: {i}" title={b.title}>
		<div class="book">
			<div class="row between">
				<span class="small muted">{t(`${num(b.read)} / ${num(b.pages)} পৃষ্ঠা`, `${b.read} / ${b.pages} pages`)}</span>
				{#if b.read >= b.pages}<Badge tone="accent" icon={false}>{t('পড়া শেষ 🎉', 'Finished 🎉')}</Badge>
				{:else}<b class="small accent num">{num(Math.round((b.read / b.pages) * 100))}%</b>{/if}
			</div>
			<div class="bar"><span style:width="{Math.min(100, (b.read / b.pages) * 100)}%"></span></div>
			<!-- Typing only reaches the field's value on blur; tapping Save blurs it first, so the click saves what was typed. -->
			<div class="row page" oninput={() => (typing = b.id)}>
				<NumberField label={t('এখন কোন পৃষ্ঠায়', 'Page you’re on')} locale={locale()} min={0} max={b.pages} step={1}
					bind:value={() => b.read, (r) => store.setPage(b.id, Math.round(r ?? 0))} />
				<Button onclick={() => { typing = null; saved = b.id; }}>{t('সেভ করুন', 'Save')}</Button>
			</div>
			{#if saved === b.id && typing !== b.id}
				<p class="small saved" role="status">{t('সেভ হয়েছে ✓', 'Saved ✓')}</p>
			{/if}
		</div>
		{#snippet footer()}
			<div class="actions">
				<ConfirmButton size="sm" onconfirm={() => store.setBooks(store.books.filter((x) => x.id !== b.id))}
					confirm={t('সত্যিই মুছবেন?', 'Delete this book?')} done={t('মোছা হয়েছে', 'Deleted')}>{t('বইটা মুছুন', 'Delete book')}</ConfirmButton>
			</div>
		{/snippet}
	</Card>
{/snippet}

<Screen title={t('বই পড়া', 'Reading')}>
	<div class="actions">
		<Button onclick={() => (adding = true)}><Icon icon={Add01Icon} size={18} /> {t('বই যোগ করুন', 'Add a book')}</Button>
	</div>

	<Drawer bind:open={adding} title={t('নতুন বই', 'New book')} closeLabel={t('বন্ধ করুন', 'Close')}>
		<form id="book-form" class="book" onsubmit={add}>
			<Input label={t('বইয়ের নাম', 'Book title')} bind:value={title} maxlength={120} />
			<Input label={t('মোট পৃষ্ঠা', 'Total pages')} bind:value={pages} inputmode="numeric"
				error={error ? t('বইয়ের নাম আর মোট পৃষ্ঠা (১–৫০০০) লিখুন।', 'Enter a title and the total pages (1–5000).') : undefined}>
				{#snippet end()}<span class="muted">{t('পৃষ্ঠা', 'pages')}</span>{/snippet}
			</Input>
		</form>
		{#snippet footer()}
			<Button variant="ghost" onclick={() => { adding = false; error = false; }}>{t('বাতিল', 'Cancel')}</Button>
			<Button type="submit" form="book-form">{t('যোগ করুন', 'Add')}</Button>
		{/snippet}
	</Drawer>

	{#if store.books.length}
		<Card title={t('হিসাব', 'Summary')} level={2}>
			<div class="stack">
				<RangeFilter label={t('কোন সময়ের হিসাব', 'Dates')} bind:value={range} />
				<div class="stats">
					<div><b>{num(totalPages)}</b><span class="xs muted">{t('পৃষ্ঠা পড়েছেন', 'pages read')}</span></div>
					<div><b>{num(readingDays)}/{num(days.length)}</b><span class="xs muted">{t('দিন পড়েছেন', 'days reading')}</span></div>
				</div>
				{#each store.books.filter((b) => pagesOf(b.id)) as b (b.id)}
					<div class="row">
						<span class="grow small">{b.title}</span>
						<b class="small num">{t(`${num(pagesOf(b.id))} পৃষ্ঠা`, `${pagesOf(b.id)} pages`)}</b>
					</div>
				{:else}
					<p class="small muted">{t('এই সময়ে পড়ার হিসাব নেই। পৃষ্ঠা এগোলেই এখানে জমা হবে।', 'No reading logged in these dates. It adds up here as you move your page forward.')}</p>
				{/each}
			</div>
		</Card>
	{/if}

	{#if !store.books.length}
		<EmptyState title={t('কোনো বই নেই', 'No books yet')} icon={Book02Icon}>{t('যে বইটি পড়ছেন সেটি যোগ করুন, প্রতিদিন কত পৃষ্ঠা পড়লেন লিখে রাখুন।', 'Add the book you’re reading and keep track of your page each day.')}</EmptyState>
	{/if}

	{#if reading.length}<h2 class="section">{t('পড়ছি', 'Reading now')}</h2>{/if}
	{#each reading as b, i (b.id)}{@render book(b, i)}{/each}

	{#if finished.length}<h2 class="section">{t('পড়া শেষ', 'Finished')} ({num(finished.length)})</h2>{/if}
	{#each finished as b, i (b.id)}{@render book(b, i)}{/each}
</Screen>

<style>
	.book {
		display: grid;
		gap: 0.75rem;
	}
	b {
		font-weight: 600;
	}
	.between {
		justify-content: space-between;
	}
	.accent {
		color: var(--ui-accent);
	}
	.page {
		align-items: end;
		justify-content: space-between;
	}
	.saved {
		color: var(--ui-accent);
	}
</style>
