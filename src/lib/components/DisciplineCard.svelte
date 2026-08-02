<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from '$lib/icons';

	let {
		href,
		icon,
		name,
		summary,
		meta
	}: { href: string; icon: IconName; name: string; summary: string; meta: string } = $props();
</script>

<a class="card card--hover discipline" {href}>
	<span class="discipline__head">
		<span class="icon-box"><Icon name={icon} size={18} /></span>
		<span class="chip chip--quiet">{meta}</span>
	</span>

	<h3 class="t-h3 discipline__name">{name}</h3>
	<p class="t-body discipline__summary">{summary}</p>

	<span class="discipline__more">
		<Icon name="arrow-right" size={17} />
	</span>
</a>

<style>
	.discipline {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 26px 24px 24px;
		color: var(--ink);
	}

	.discipline__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.discipline__name {
		margin-top: 26px;
	}

	.discipline__summary {
		margin-top: 10px;
		color: var(--muted);
	}

	.discipline__more {
		display: flex;
		margin-top: auto;
		padding-top: 26px;
		color: var(--faint);
		transition:
			transform 200ms ease,
			color 200ms ease;
	}

	.discipline:hover .discipline__more {
		color: var(--ink);
		transform: translateX(4px);
	}

	.discipline:hover .icon-box {
		border-color: var(--ink);
		color: var(--ink);
	}
</style>
