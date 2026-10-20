<script lang="ts">
	import { FileExportIcon, FileImportIcon } from '@hugeicons/core-free-icons';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { backupFileName, parseBackup } from '#lib/backup.js';
	import { pickText, saveText } from '#lib/files.js';
	import { num, dateLabel } from '#lib/format.js';
	import type { Backup } from '#lib/schema.js';
	import { t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	let status = $state<{ tone: 'success' | 'warning'; text: string } | null>(null);
	let pending = $state<{ backup: Backup; skipped: number } | null>(null);
	let busy = $state(false);

	const daysLogged = $derived(store.history.length + (store.today.length ? 1 : 0));

	async function doExport() {
		busy = true;
		status = null;
		try {
			const name = backupFileName();
			if ((await saveText(name, JSON.stringify(store.exportData(), null, 2))) === 'saved') {
				status = { tone: 'success', text: t(`“${name}” নামে ফাইল সেভ হয়েছে।`, `Saved as “${name}”.`) };
			}
		} catch {
			status = { tone: 'warning', text: t('ফাইল সেভ করা যায়নি। আবার চেষ্টা করুন।', 'The file couldn’t be saved. Try again.') };
		} finally {
			busy = false;
		}
	}

	async function doPick() {
		busy = true;
		status = null;
		try {
			const text = await pickText();
			if (text === null) return;
			const r = parseBackup(text);
			if (!r.ok) {
				status = { tone: 'warning', text: r.reason === 'json'
					? t('এটা এই অ্যাপের ব্যাকআপ ফাইল নয়।', 'This isn’t an AMALA backup file.')
					: t('ফাইলটা নষ্ট বা অন্য কোনো সংস্করণের। ঠিক ফাইলটা বেছে নিন।', 'This file is damaged or from another version. Choose the right file.') };
				return;
			}
			pending = { backup: r.backup, skipped: r.skipped };
		} catch {
			status = { tone: 'warning', text: t('ফাইলটা খোলা যায়নি। আবার চেষ্টা করুন।', 'The file couldn’t be opened. Try again.') };
		} finally {
			busy = false;
		}
	}

	async function confirmImport() {
		if (!pending) return;
		busy = true;
		try {
			await store.importData(pending.backup);
			status = { tone: 'success', text: t('সব তথ্য ফিরিয়ে আনা হয়েছে।', 'Everything has been restored.') };
		} catch {
			status = { tone: 'warning', text: t('তথ্য ফিরিয়ে আনা যায়নি। আগের তথ্য যেমন ছিল তেমনই আছে।', 'Restore failed. Your data is unchanged.') };
		} finally {
			pending = null;
			busy = false;
		}
	}
</script>

{#snippet head(icon: typeof FileExportIcon, title: string, sub: string)}
	<div class="row top">
		<span class="icon"><Icon {icon} size={24} /></span>
		<div class="grow"><b>{title}</b><p class="small muted">{sub}</p></div>
	</div>
{/snippet}

<Screen title={t('তথ্য সংরক্ষণ', 'Your data')}>
	<p class="muted">{t('আপনার সব তথ্য শুধু এই ফোনের ব্রাউজারেই থাকে। ফোন বা ব্রাউজার বদলালে, কিংবা ব্রাউজারের তথ্য মোছার আগে একটা ব্যাকআপ ফাইল রেখে দিন।', 'Your data stays only in this phone’s browser. Before changing phone or browser, or clearing browser data, save a backup file.')}</p>

	<Card class="enter">
		<div class="card">
			{@render head(FileExportIcon, t('ব্যাকআপ ফাইল বানান', 'Make a backup file'),
				t(`প্রোফাইল, প্রিয় খাবার, ${num(daysLogged)} দিনের খাবারের হিসাব, নামাজ, ব্যায়াম, বই আর কাজ একটি ফাইলে যাবে।`,
					`Your profile, favourites, ${daysLogged} days of meals, prayers, workouts, books and tasks go into one file.`))}
			<div><Button onclick={doExport} disabled={busy}>{t('ফাইলে সেভ করুন', 'Save to a file')}</Button></div>
		</div>
	</Card>

	<Card class="enter" style="--i: 1">
		<div class="card">
			{@render head(FileImportIcon, t('ব্যাকআপ থেকে ফিরিয়ে আনুন', 'Restore from a backup'), t('আগে সেভ করা ফাইল বেছে নিন। এখনকার তথ্যের জায়গায় ফাইলের তথ্য বসবে। ফোনের অ্যাপের ব্যাকআপ ফাইলও চলবে।', 'Choose a file you saved earlier. It replaces what’s here now. Backups from the phone app work too.'))}
			<div><Button variant="secondary" onclick={doPick} disabled={busy}>{t('ফাইল বেছে নিন', 'Choose a file')}</Button></div>
		</div>
	</Card>

	{#if pending}
		<Alert tone="warning" title={t('এই ফাইল থেকে তথ্য বসাবেন?', 'Restore from this file?')} live>
			{t('ফাইলের তারিখ', 'Saved on')}: {dateLabel(new Date(pending.backup.exportedAt))}<br />
			{t('খাবারের হিসাব', 'Meal entries')}: {num(pending.backup.meals.length)} · {t('প্রিয় খাবার', 'Favourites')}: {num(pending.backup.favourites.length)}<br />
			{#if pending.skipped}{t(`${num(pending.skipped)}টি অচেনা খাবার বাদ যাবে।`, `${pending.skipped} unknown foods will be left out.`)}<br />{/if}
			{t('এখন ফোনে যা আছে তা মুছে গিয়ে ফাইলের তথ্য বসবে।', 'What’s on this phone now will be replaced.')}
			{#snippet actions()}
				<Button size="sm" variant="secondary" onclick={() => (pending = null)}>{t('বাতিল', 'Cancel')}</Button>
				<Button size="sm" onclick={confirmImport} loading={busy}>{t('হ্যাঁ, বসান', 'Yes, restore')}</Button>
			{/snippet}
		</Alert>
	{/if}

	{#if status}<Alert tone={status.tone} title={status.text} live />{/if}
</Screen>

<style>
	.card {
		display: grid;
		gap: 1rem;
	}
	.top {
		align-items: flex-start;
	}
	.icon {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		flex: none;
		border-radius: var(--ui-radius);
		background: var(--accent-soft);
		color: var(--ui-accent);
	}
	b {
		font-weight: 600;
	}
</style>
