<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		ruled = true,
		id,
		class: className = '',
		children
	}: {
		ruled?: boolean;
		id?: string;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<!--
	Full-bleed section. No eyebrow label: it sat directly above the heading and
	said the same thing twice in two type sizes. The heading is the label.
-->
<section {id} class="section {ruled ? 'section--ruled' : ''} {className}">
	<div class="container">
		{@render children()}
	</div>
</section>
