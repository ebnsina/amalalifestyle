<script lang="ts">
	import Segmented from '#lib/sinaui/ui/Segmented.svelte';
	import { i18n, t, type Lang } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';
</script>

<!-- Each option is written in its own language, so it can be found from either one. -->
<Segmented label={t('ভাষা', 'Language')} hideLabel={false}
	options={[{ value: 'bn', label: 'বাংলা' }, { value: 'en', label: 'English' }]}
	bind:value={() => i18n.lang, (l) => store.setLang(l as Lang)} />
