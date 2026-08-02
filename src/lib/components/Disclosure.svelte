<script lang="ts">
	import Icon from './Icon.svelte';

	let { question, answer }: { question: string; answer: string } = $props();

	let open = $state(false);
</script>

<details class="disclosure" bind:open>
	<summary class="disclosure__summary">
		<span class="t-h3">{question}</span>
		<!-- Bordered box: this one is a control. -->
		<span class="icon-box"><Icon name={open ? 'minus' : 'plus'} size={13} /></span>
	</summary>
	<p class="t-body disclosure__answer">{answer}</p>
</details>

<style>
	.disclosure {
		border-top: 1px solid var(--rule);
	}

	.disclosure:last-of-type {
		border-bottom: 1px solid var(--rule);
	}

	.disclosure__summary {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 32px;
		padding-block: 26px;
		cursor: pointer;
		list-style: none;
	}

	.disclosure__summary::-webkit-details-marker {
		display: none;
	}

	.disclosure__answer {
		color: var(--muted);
		padding-bottom: 28px;
		max-width: 58ch;
	}
</style>
