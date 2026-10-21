<script lang="ts">
	import { HelpCircleIcon } from '@hugeicons/core-free-icons';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { t } from '#lib/i18n.svelte.js';

	// A screen's "how it works" steps: open until dismissed once, then a small link brings them back.
	let { id, steps }: { id: string; steps: string[] } = $props();

	const key = () => `guide-${id}`;
	const seen = () => {
		try {
			return localStorage.getItem(key()) === 'hidden';
		} catch {
			return false;
		}
	};
	let open = $state(!seen());

	function set(show: boolean) {
		open = show;
		try {
			if (show) localStorage.removeItem(key());
			else localStorage.setItem(key(), 'hidden');
		} catch {
			// Private mode: remembered until the page reloads.
		}
	}
</script>

{#if open}
	<Alert title={t('কীভাবে ব্যবহার করবেন', 'How it works')}>
		<ol class="steps">
			{#each steps as step (step)}<li>{step}</li>{/each}
		</ol>
		{#snippet actions()}
			<Button size="sm" variant="secondary" onclick={() => set(false)}>{t('বুঝেছি', 'Got it')}</Button>
		{/snippet}
	</Alert>
{:else}
	<div class="actions again">
		<Button size="sm" variant="ghost" onclick={() => set(true)}>
			<Icon icon={HelpCircleIcon} size={16} /> {t('কীভাবে ব্যবহার করবেন?', 'How does this work?')}
		</Button>
	</div>
{/if}

<style>
	.steps {
		display: grid;
		gap: 0.25rem;
		margin: 0.25rem 0 0;
		padding-inline-start: 1.25rem;
	}
	.again {
		margin-block: -0.5rem;
	}
</style>
