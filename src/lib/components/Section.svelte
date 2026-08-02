<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		ruled = true,
		id,
		class: className = '',
		children
	}: {
		label?: string;
		ruled?: boolean;
		id?: string;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<!--
	Full-bleed section. The label sits above the content as an eyebrow rather
	than in a side column, so the content gets the whole container width.
-->
<section {id} class="section {ruled ? 'section--ruled' : ''} {className}">
	<div class="container">
		{#if label}
			<p class="section__eyebrow t-label">
				<span class="section__tick" aria-hidden="true"></span>
				{label}
			</p>
		{/if}
		{@render children()}
	</div>
</section>

<style>
	.section__eyebrow {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: clamp(24px, 3vw, 40px);
	}

	/* A short lime rule marks where a section starts. It is the only thing the
	   old label column was really doing. */
	.section__tick {
		display: inline-block;
		width: 26px;
		height: 3px;
		background: var(--lime);
		flex: none;
	}
</style>
