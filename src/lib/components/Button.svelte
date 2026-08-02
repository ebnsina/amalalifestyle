<script lang="ts">
	import Icon from './Icon.svelte';
	import type { Snippet } from 'svelte';

	let {
		href,
		type = 'button',
		variant = 'solid',
		arrow = false,
		class: className = '',
		children,
		...rest
	}: {
		href?: string;
		type?: 'button' | 'submit';
		variant?: 'solid' | 'ghost';
		arrow?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const cls = $derived(`btn btn--${variant} ${className}`.trim());
</script>

{#if href}
	<a {href} class={cls} {...rest}>
		{@render children()}
		{#if arrow}<Icon name="arrow-right" size={14} class="btn__arrow" />{/if}
	</a>
{:else}
	<button {type} class={cls} {...rest}>
		{@render children()}
		{#if arrow}<Icon name="arrow-right" size={14} class="btn__arrow" />{/if}
	</button>
{/if}
