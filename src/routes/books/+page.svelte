<script lang="ts">
	import { Add01Icon, Book02Icon } from '@hugeicons/core-free-icons';
	import * as v from 'valibot';
	import Screen from '#lib/components/Screen.svelte';
	import Badge from '#lib/sinaui/ui/Badge.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import ConfirmButton from '#lib/sinaui/ui/ConfirmButton.svelte';
	import EmptyState from '#lib/sinaui/ui/EmptyState.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import NumberField from '#lib/sinaui/ui/NumberField.svelte';
	import { num, parseNum } from '#lib/format.js';
	import { BookSchema, type Book } from '#lib/schema.js';
	import { locale, t } from '#lib/i18n.svelte.js';
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
	const update = (id: string, read: number) => store.setBooks(store.books.map((b) => (b.id === id ? { ...b, read } : b)));

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
				{:else}<b class="small accent">{num(Math.round((b.read / b.pages) * 100))}%</b>{/if}
			</div>
			<div class="bar"><span style:width="{Math.min(100, (b.read / b.pages) * 100)}%"></span></div>
			<!-- Typing only reaches the field's value on blur; tapping Save blurs it first, so the click saves what was typed. -->
			<div class="row page" oninput={() => (typing = b.id)}>
				<NumberField label={t('এখন কোন পৃষ্ঠায়', 'Page you’re on')} locale={locale()} min={0} max={b.pages} step={1}
					bind:value={() => b.read, (r) => update(b.id, Math.round(r ?? 0))} />
				<Button onclick={() => { typing = null; saved = b.id; }}>{t('সেভ করুন', 'Save')}</Button>
			</div>
			{#if saved === b.id && typing !== b.id}
				<p class="small saved" role="status">{t('সেভ হয়েছে ✓', 'Saved ✓')}</p>
			{/if}
		</div>
		{#snippet footer()}
			<ConfirmButton size="sm" onconfirm={() => store.setBooks(store.books.filter((x) => x.id !== b.id))}
				confirm={t('সত্যিই মুছবেন?', 'Delete this book?')} done={t('মোছা হয়েছে', 'Deleted')}>{t('বইটা মুছুন', 'Delete book')}</ConfirmButton>
		{/snippet}
	</Card>
{/snippet}

<Screen title={t('বই পড়া', 'Reading')}>
	{#if adding}
		<Card>
			<form class="book" onsubmit={add}>
				<b>{t('নতুন বই', 'New book')}</b>
				<!-- svelte-ignore a11y_autofocus -->
				<Input label={t('বইয়ের নাম', 'Book title')} bind:value={title} autofocus maxlength={120} />
				<Input label={t('মোট পৃষ্ঠা', 'Total pages')} bind:value={pages} inputmode="numeric"
					error={error ? t('বইয়ের নাম আর মোট পৃষ্ঠা (১–৫০০০) লিখুন।', 'Enter a title and the total pages (1–5000).') : undefined}>
					{#snippet end()}<span class="muted">{t('পৃষ্ঠা', 'pages')}</span>{/snippet}
				</Input>
				<div class="row">
					<Button variant="ghost" onclick={() => { adding = false; error = false; }}>{t('বাতিল', 'Cancel')}</Button>
					<Button type="submit">{t('যোগ করুন', 'Add')}</Button>
				</div>
			</form>
		</Card>
	{:else}
		<Button variant="secondary" size="lg" onclick={() => (adding = true)}><Icon icon={Add01Icon} size={20} /> {t('বই যোগ করুন', 'Add a book')}</Button>
	{/if}

	{#if !store.books.length && !adding}
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
	}
	.saved {
		color: var(--ui-accent);
	}
</style>
