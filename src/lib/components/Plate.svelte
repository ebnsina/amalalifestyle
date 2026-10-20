<script lang="ts">
	// ponytail: emoji on a tinted plate stands in for food photography.
	let { emoji, size = 64 }: { emoji: string; size?: number } = $props();
</script>

<span aria-hidden="true" style:--size="{size}px">{emoji}</span>

<style>
	span {
		flex: none;
		display: inline-grid;
		place-items: center;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: var(--accent-soft);
		font-size: calc(var(--size) * 0.5);
		line-height: 1;
	}
</style>
