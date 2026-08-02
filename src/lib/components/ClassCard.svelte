<script lang="ts">
	import { image as img } from '$lib/images';
	import Icon from './Icon.svelte';

	let {
		name,
		image,
		alt,
		summary,
		length,
		level,
		cap
	}: {
		name: string;
		image: string;
		alt: string;
		summary: string;
		length: string;
		level: string;
		cap: string;
	} = $props();
</script>

<article class="class-card">
	<div class="media media--card media--muted">
		<enhanced:img
			src={img(image)}
			{alt}
			sizes="(min-width: 1040px) 23vw, (min-width: 620px) 46vw, 100vw"
			loading="lazy"
		/>
	</div>

	<div class="class-card__body">
		<h3 class="t-h3">{name}</h3>
		<p class="t-body class-card__summary">{summary}</p>

		<ul class="class-card__meta">
			<li><Icon name="clock" size={14} /> <span class="t-num">{length}</span></li>
			<li><Icon name="target" size={14} /> {level}</li>
			<li><Icon name="users" size={14} /> <span class="t-num">{cap}</span></li>
		</ul>
	</div>
</article>

<style>
	.class-card {
		display: flex;
		flex-direction: column;
	}

	.class-card__body {
		padding-top: 22px;
	}

	.class-card__summary {
		margin-top: 10px;
		color: var(--muted);
	}

	.class-card__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid var(--rule);
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.class-card__meta li {
		display: flex;
		align-items: center;
		gap: 7px;
	}
</style>
