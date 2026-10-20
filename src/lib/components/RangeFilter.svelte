<script lang="ts">
	import { endOfMonth, getLocalTimeZone, parseDate, startOfMonth, today } from '@internationalized/date';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import DateRangePicker from '#lib/sinaui/ui/DateRangePicker.svelte';
	import { locale, t } from '#lib/i18n.svelte.js';
	import type { DayRange } from '#lib/range.js';

	// clearable: no range means "all days", and a button brings that back. future: for dates ahead, like task due dates.
	let { value = $bindable(), label, clearable = false, future = false }: {
		value?: DayRange; label: string; clearable?: boolean; future?: boolean;
	} = $props();

	const now = today(getLocalTimeZone());
	const presets = $derived(future ? [
		{ label: t('আগামী ৭ দিন', 'Next 7 days'), start: now, end: now.add({ days: 6 }) },
		{ label: t('আগামী ৩০ দিন', 'Next 30 days'), start: now, end: now.add({ days: 29 }) },
		{ label: t('এই মাস', 'This month'), start: startOfMonth(now), end: endOfMonth(now) },
	] : [
		{ label: t('গত ৭ দিন', 'Last 7 days'), start: now.subtract({ days: 6 }), end: now },
		{ label: t('গত ৩০ দিন', 'Last 30 days'), start: now.subtract({ days: 29 }), end: now },
		{ label: t('এই মাস', 'This month'), start: startOfMonth(now), end: now },
	]);
</script>

<div class="row range">
	<div class="grow">
		<DateRangePicker {label} locale={locale()} max={future ? undefined : now} months={1} {presets} placeholder={t('সব দিন', 'All days')}
			bind:value={() => value && { start: parseDate(value.start), end: parseDate(value.end) },
				(r) => (value = r && { start: r.start.toString(), end: r.end.toString() })} />
	</div>
	{#if clearable && value}<Button variant="ghost" size="sm" onclick={() => (value = undefined)}>{t('সব দিন', 'All days')}</Button>{/if}
</div>

<style>
	.range {
		align-items: end;
	}
</style>
