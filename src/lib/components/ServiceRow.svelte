<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from '$lib/icons';

	let {
		href,
		icon,
		name,
		summary,
		meta
	}: {
		href: string;
		icon: IconName;
		name: string;
		summary: string;
		meta: string;
	} = $props();
</script>

<a class="row" {href}>
	<span class="row__head">
		<span class="icon-box"><Icon name={icon} size={17} /></span>
		<span class="t-h3">{name}</span>
	</span>
	<span class="row__summary">{summary}</span>
	<span class="t-num row__meta">{meta}</span>
	<Icon name="arrow-right" size={18} class="row__arrow" />
</a>

<style>
	.row {
		display: grid;
		gap: 10px 24px;
		padding-block: 26px;
		border-top: 1px solid var(--rule);
		transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	@media (min-width: 860px) {
		.row {
			grid-template-columns: minmax(0, 2.4fr) minmax(0, 5fr) auto 24px;
			align-items: center;
			padding-block: 30px;
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.row:hover {
			transform: translateX(10px);
		}
	}

	.row__head {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.row__summary {
		font-size: 16px;
		line-height: 1.55;
		color: var(--muted);
	}

	.row__meta {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--faint);
		white-space: nowrap;
	}

	.row :global(.row__arrow) {
		color: var(--faint);
		justify-self: end;
		transition:
			transform 200ms ease,
			color 200ms ease;
	}

	.row:hover :global(.row__arrow) {
		color: var(--ink);
		transform: translateX(4px);
	}

	.row:hover .icon-box {
		border-color: var(--ink);
		color: var(--ink);
	}
</style>
