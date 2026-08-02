<script lang="ts">
	import { image as img } from '$lib/images';
	import Button from './Button.svelte';

	let {
		label = 'Next step',
		title,
		body,
		primary = { href: '/contact', text: 'Book a free session' },
		secondary,
		image,
		alt = ''
	}: {
		label?: string;
		title: string;
		body?: string;
		primary?: { href: string; text: string };
		secondary?: { href: string; text: string };
		image?: string;
		alt?: string;
	} = $props();
</script>

<section class="cta" class:on-dark={!!image} class:cta--photo={!!image}>
	{#if image}
		<div class="cta__media" aria-hidden={alt ? undefined : 'true'}>
			<enhanced:img src={img(image)} {alt} sizes="100vw" loading="lazy" />
			<div class="media__scrim"></div>
		</div>
	{/if}

	<div class="container cta__inner">
		<p class="t-label cta__label">{label}</p>
		<div class="cta__grid">
			<h2 class="t-h1 cta__title">{title}</h2>
			<div>
				{#if body}
					<p class="t-body-lg cta__text">{body}</p>
				{/if}
				<div class="cta__actions">
					<Button href={primary.href} variant="solid" arrow>{primary.text}</Button>
					{#if secondary}
						<Button href={secondary.href} variant="ghost">{secondary.text}</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* No border on either variant: the surface or photo change is already the
	   edge, and marking it twice is one mark too many. */
	.cta {
		position: relative;
		background: var(--surface);
		padding-block: var(--section-y);
		isolation: isolate;
	}

	.cta--photo {
		background: var(--band);
		color: #f5f5f3;
	}

	.cta__media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	.cta__media :global(picture) {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* Held well back — this photograph is a texture behind type, not a picture
	   in its own right, and the type has to win. */
	.cta__media :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.55) brightness(0.42);
	}

	.cta__inner {
		position: relative;
	}

	.cta__label {
		color: var(--faint);
	}

	.cta--photo .cta__label {
		color: rgb(245 245 243 / 0.66);
	}

	/* Statement on the left, the answer to it on the right — the band uses the
	   whole container rather than a single narrow column. */
	.cta__grid {
		display: grid;
		gap: 32px;
		margin-top: clamp(24px, 3vw, 40px);
	}

	@media (min-width: 940px) {
		.cta__grid {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
			gap: 64px;
			align-items: end;
		}
	}

	.cta__title {
		max-width: 16ch;
	}

	.cta__text {
		color: var(--muted);
		max-width: 46ch;
	}

	.cta--photo .cta__text {
		color: rgb(245 245 243 / 0.8);
	}

	.cta__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 36px;
	}
</style>
