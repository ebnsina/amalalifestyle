<script lang="ts">
	import Segmented from '#lib/sinaui/ui/Segmented.svelte';
	import { t } from '#lib/i18n.svelte.js';
	import { setTheme, theme, type Theme } from '#lib/theme.svelte.js';
</script>

<Segmented label={t('রঙের ধরন', 'Theme')}
	options={[
		{ value: 'system', label: t('ফোনের মতো', 'System') },
		{ value: 'light', label: t('আলো', 'Light') },
		{ value: 'dark', label: t('অন্ধকার', 'Dark') },
	]}
	bind:value={() => theme.value, (v) => setTheme(v as Theme)} />
