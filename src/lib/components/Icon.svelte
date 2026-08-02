<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { icons, type IconName } from '$lib/icons';

	let {
		name,
		size = 18,
		stroke = 1.6,
		class: className = ''
	}: { name: IconName; size?: number; stroke?: number; class?: string } = $props();
</script>

<HugeiconsIcon
	icon={icons[name]}
	{size}
	strokeWidth={stroke}
	color="currentColor"
	class={className}
	aria-hidden="true"
	focusable="false"
/>
