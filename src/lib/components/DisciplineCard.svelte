<script lang="ts">
	import { image as img } from '$lib/images';
	import Icon from './Icon.svelte';

	let {
		href,
		image,
		alt,
		name,
		summary,
		meta
	}: {
		href: string;
		image: string;
		alt: string;
		name: string;
		summary: string;
		meta: string;
	} = $props();
</script>

<a class="discipline" {href}>
	<enhanced:img
		class="discipline__img"
		src={img(image)}
		{alt}
		sizes="(min-width: 1040px) 24vw, (min-width: 620px) 48vw, 100vw"
		loading="lazy"
	/>

	<!--
		Two layers, not one. The flat wash holds a floor under the whole picture
		so a pale patch of gym wall can never wash out the meta chip, and the
		gradient adds the extra weight the paragraph needs at the bottom.
	-->
	<span class="discipline__wash" aria-hidden="true"></span>
	<span class="discipline__scrim" aria-hidden="true"></span>

	<span class="discipline__body">
		<span class="chip discipline__meta">{meta}</span>

		<span class="discipline__foot">
			<h3 class="t-h3 discipline__name">{name}</h3>
			<p class="t-body discipline__summary">{summary}</p>
			<span class="discipline__more"><Icon name="arrow-right" size={17} /></span>
		</span>
	</span>
</a>

<style>
	.discipline {
		position: relative;
		display: block;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		border-radius: var(--r-lg);
		background: var(--ink);
		color: var(--band-ink);
		isolation: isolate;
	}

	.discipline__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -2;
		filter: saturate(1.02) contrast(1.02) brightness(0.9);
		transition: transform 500ms ease;
	}

	.discipline__wash,
	.discipline__scrim {
		position: absolute;
		inset: 0;
		z-index: -1;
	}

	.discipline__wash {
		background: rgb(26 22 17 / 0.3);
	}

	.discipline__scrim {
		background: linear-gradient(
			to top,
			rgb(26 22 17 / 0.92) 0%,
			rgb(26 22 17 / 0.68) 34%,
			rgb(26 22 17 / 0.26) 66%,
			rgb(26 22 17 / 0.08) 100%
		);
	}

	.discipline__body {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		padding: 22px 22px 24px;
	}

	.discipline__meta {
		align-self: flex-start;
		background: rgb(245 245 243 / 0.16);
		color: var(--band-ink);
		-webkit-backdrop-filter: blur(6px);
		backdrop-filter: blur(6px);
	}

	.discipline__name {
		/* A hairline of shadow, not a glow: enough to hold the edge of the
		   letterform if the photograph behind it runs light. */
		text-shadow: 0 1px 12px rgb(26 22 17 / 0.6);
	}

	/*
		The block is anchored to the bottom of the card, so a summary that wraps
		to two lines instead of three would lift its heading above the others.
		Holding the longest case reserves the space and the four names sit on
		one line. In em, so it tracks the type rather than a pixel guess.
	*/
	.discipline__summary {
		margin-top: 10px;
		min-height: 5.2em;
		color: rgb(245 245 243 / 0.86);
		text-shadow: 0 1px 10px rgb(26 22 17 / 0.6);
	}

	.discipline__more {
		display: flex;
		margin-top: 20px;
		color: rgb(245 245 243 / 0.72);
		transition:
			transform 200ms ease,
			color 200ms ease;
	}

	.discipline:hover .discipline__img {
		transform: scale(1.04);
	}

	.discipline:hover .discipline__more {
		color: var(--band-ink);
		transform: translateX(4px);
	}

	.discipline:focus-visible {
		outline: 2px solid var(--sun);
		outline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.discipline__img,
		.discipline__more {
			transition: none;
		}

		.discipline:hover .discipline__img {
			transform: none;
		}
	}
</style>
