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
	/*
		A bordered block per question rather than rows separated by hairlines.
		A hairline list reads as a table of contents; separate blocks read as
		separate things you can open, which is what they are.
	*/
	.disclosure {
		border: 1px solid var(--rule);
		border-radius: var(--r-md);
		background: var(--paper);
		padding-inline: 24px;
		transition:
			border-color 200ms ease,
			background-color 200ms ease;
	}

	.disclosure + :global(.disclosure) {
		margin-top: 12px;
	}

	.disclosure:hover,
	.disclosure[open] {
		border-color: var(--rule-strong);
	}

	.disclosure[open] {
		background: var(--sun-wash);
	}

	.disclosure__summary {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 32px;
		padding-block: 22px;
		cursor: pointer;
		list-style: none;
	}

	.disclosure__summary::-webkit-details-marker {
		display: none;
	}

	.disclosure__answer {
		color: var(--muted);
		padding-bottom: 24px;
		max-width: 58ch;
	}
</style>
