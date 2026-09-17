<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import PlanCard from '$lib/components/PlanCard.svelte';
	import Disclosure from '$lib/components/Disclosure.svelte';
	import { homeFaqs, homeStory, plans, site } from '$lib/data/site';
</script>

<Seo
	title={site.name}
	description="A gym in Dhaka where a coach shows you what to do. The first session is free. You do not need to know anything to start."
	image="/images/studio.jpg"
/>

<!--
	Hero.

	An open field, the whole width of the window, with the type sitting on the
	sky rather than a photograph of the gym with the type printed over it. The
	brief was fresh air, and this is the most literal reading of it: the one
	picture on the page that is not a room.

	Like all the photography here `hero-field.jpg` is a placeholder to be
	replaced by the gym's own — see CREDITS.md — but it is at least the right
	picture: a green meadow under an open sky.

	There is no [data-hero] here, so the header is solid white from the first
	paint. It has to be: the top of this frame is pale sky, and white nav labels
	on it would be invisible.
-->
<section class="hero">
	<div class="hero__media">
		<enhanced:img
			src={img('/images/hero-field.jpg')}
			alt="A green meadow under an open sky, with rolling hills behind it"
			sizes="100vw"
			fetchpriority="high"
		/>
	</div>

	<div class="container hero__inner">
		<h1 class="t-display hero__title">
			Get strong.<br />
			<!-- Amber as a fill behind the word, never as the colour of it — the
				 one rule the accent follows everywhere else on the site. -->
			<span class="mark">Stay</span> strong.
		</h1>

		<p class="t-body-lg hero__standfirst">
			A coach shows you what to do. Every time. You do not need to know anything to
			start.
		</p>

		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
	</div>
</section>

<!--
	The story. Four beats, each one a photograph and two sentences, in the order
	they happen to you.

	This replaced six sections of cards, tiles and lists. Someone who does not
	spend their day on websites does not read a grid of four tiles as four
	choices — they read it as a wall of words and leave. A big picture and a
	short sentence is the one thing everybody already knows how to read.
-->
<Section ruled={false} class="section--tint">
	<h2 class="t-h1 story__head">What happens here</h2>

	<ol class="story">
		{#each homeStory as beat (beat.n)}
			<li class="beat">
				<div class="beat__media media media--wide media--muted">
					<enhanced:img
						src={img(beat.image)}
						alt={beat.alt}
						sizes="(min-width: 900px) 46vw, 100vw"
						loading="lazy"
					/>
				</div>

				<div class="beat__text">
					<span class="step-badge beat__n" aria-hidden="true">{beat.n}</span>
					<h3 class="t-h2 beat__title">{beat.title}</h3>
					<p class="t-body-lg beat__body">{beat.body}</p>
				</div>
			</li>
		{/each}
	</ol>
</Section>

<!--
	The women's floor gets a band of its own rather than a card in a grid. For
	the people it matters to it is the whole decision, and a tile among four
	tiles is not how you say that.
-->
<section class="womens band">
	<div class="womens__media media media--muted">
		<enhanced:img
			src={img('/images/womens-strength.jpg')}
			alt="A woman training with a barbell on the women's floor"
			sizes="(min-width: 900px) 50vw, 100vw"
			loading="lazy"
		/>
	</div>

	<div class="womens__text">
		<h2 class="t-h2">Would you rather train with women?</h2>
		<p class="t-body-lg womens__body">
			There is a separate floor with its own door and its own hours. Only women coach
			on it, and no men are on that floor while it is open.
		</p>
		<Button href="/womens" variant="ghost" arrow>See the women’s floor</Button>
	</div>
</section>

<!--
	Prices in full, not a teaser. It is the question everyone has and the one
	nobody should have to open another page to answer — /membership stays for
	the line-by-line comparison, which is genuinely a different job.
-->
<Section id="pricing" ruled={false}>
	<h2 class="t-h2">What it costs</h2>
	<p class="t-body-lg lede">
		Pay month by month. Stop any time with 30 days’ notice. No joining fee.
	</p>

	<div class="plans">
		{#each plans as p (p.id)}
			<PlanCard {...p} />
		{/each}
	</div>
</Section>

<!--
	Five questions, not eleven. These are the five that stop a first-timer
	booking; the rest live on the pages that own them.
-->
<Section id="faq" ruled={false} class="section--tint">
	<h2 class="t-h2 faq__title">Questions people ask</h2>

	<div class="faq">
		{#each homeFaqs as f (f.question)}
			<Disclosure {...f} />
		{/each}
	</div>
</Section>

<CtaBand
	title="Come and see."
	body="The first session is free and there is nothing to sign. We look at how you move, ask what you want, and tell you straight whether this is the right gym for it."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/facilities', text: 'Look around first' }}
	image="/images/facility-racks.jpg"
/>

<style>
	/* --- Hero ------------------------------------------------------------ */

	/*
		Air, and a lot of it. Not full-viewport: 100svh of anything is a wall,
		and the point of this frame is that you can see past it. It is as tall as
		its content plus a wide margin, which on a phone puts the headline, the
		sentence and the button on screen together with room around them.
	*/
	.hero {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 74svh;
		padding-block: clamp(72px, 10vw, 144px);
		text-align: center;
		background: var(--surface);
		isolation: isolate;
	}

	.hero__media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	/*
		A pale wash, not a dark scrim. The photograph is bright — wide sky, light
		grass — so the type on it is ink, the same ink as the rest of the page,
		and all this has to do is stop the busiest part of the grass from eating
		the descenders. Darkening the frame to carry white type would throw away
		the one thing the picture is here for.
	*/
	.hero__media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgb(255 253 249 / 0.62);
	}

	/* enhanced:img wraps the image in <picture>, which scoped selectors do not
	   reach, so these are global inside the hero. */
	.hero__media :global(picture) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.hero__media :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* Crops onto the bright meadow rather than the treeline. Ink type over
		   dark trees at this wash strength does not carry; over lit grass it
		   does, and the trees stay in frame at the edges. */
		object-position: center 74%;
	}

	.hero__inner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero__title {
		max-width: 16ch;
	}

	/*
		An inline background is drawn to the font's ascender and descender, and
		Bricolage's are generous — at display size that leaves a slab with far
		more fill above and below the caps than beside them. inline-block plus a
		tight line-height hands the box back so it hugs the word.
	*/
	.hero__title :global(.mark) {
		display: inline-block;
		line-height: 0.9;
		padding: 0.06em 0.12em 0.1em;
	}

	/* Deliberately narrow. Three short lines under a headline read as one
	   thought; one long line reads as a paragraph you have started. */
	.hero__standfirst {
		margin-block: 24px 36px;
		max-width: 34ch;
		color: var(--ink);
	}

	/* --- The story -------------------------------------------------------- */

	.story__head {
		margin-bottom: clamp(48px, 6vw, 80px);
	}

	.story {
		display: grid;
		gap: clamp(64px, 8vw, 120px);
	}

	.beat {
		display: grid;
		gap: 28px;
		align-items: center;
	}

	/*
		Side by side, and alternating. The photograph is half the width of the
		page at this size — big enough to be the thing you look at, which is the
		whole point of telling it in pictures.
	*/
	@media (min-width: 900px) {
		.beat {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
			gap: clamp(48px, 6vw, 88px);
		}

		/* The photograph moves to the right on every second beat, so the page
		   zig-zags instead of running down one rail. The DOM order is picture
		   then text throughout — which is also the order it is read in on a
		   phone, where the picture is what tells you a new beat has started. */
		.beat:nth-child(even) .beat__media {
			grid-column: 2;
			grid-row: 1;
		}
	}

	.beat__media {
		border-radius: var(--r-lg);
	}

	.beat__media :global(picture) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.beat__media :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Big enough to be read as a step in a sequence from across the room. The
	   shared 46px badge is a footnote at this scale. */
	.beat__n {
		width: 64px;
		height: 64px;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 26px;
	}

	.beat__title {
		margin-top: 24px;
	}

	.beat__body {
		margin-top: 16px;
		color: var(--muted);
	}

	/* --- Women's floor ----------------------------------------------------- */

	/* .band supplies the surface and, importantly, the dark-background variant
	   of the ghost button — a pale outline button on a dark panel is otherwise
	   drawn in ink on ink. */
	.womens {
		display: grid;
	}

	@media (min-width: 900px) {
		.womens {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: stretch;
		}
	}

	/*
		A fixed ratio, not the photograph's own. enhanced:img emits the real
		width and height, so without this the portrait dictated the height of the
		whole band and pushed a single sentence down half a screen.
	*/
	.womens__media {
		border-radius: 0;
		aspect-ratio: 3 / 2;
	}

	.womens__media :global(picture) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.womens__media :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
	}

	.womens__text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 20px;
		padding: clamp(48px, 7vw, 96px) var(--gutter);
	}

	.womens__body {
		color: var(--band-muted);
		max-width: 42ch;
	}

	/* --- Prices ------------------------------------------------------------ */

	/*
		One plain sentence under the heading, saying what the section is for. A
		heading alone asks the reader to guess, and guessing is what this page is
		trying to spare them.
	*/
	.lede {
		margin-top: 14px;
		color: var(--muted);
	}

	/* The grid itself is in layout.css so this page and /membership share one
	   row template; only the space above it belongs to this page. */
	.plans {
		margin-top: 48px;
	}

	/* --- FAQ ---------------------------------------------------------------- */

	/* Centred column. A list of questions is read one at a time down a single
	   axis, so it is the one block on the page that does not want to be pinned
	   to the left edge of a full-width container. */
	.faq {
		margin-top: 40px;
		max-width: 74ch;
		margin-inline: auto;
	}

	.faq__title {
		text-align: center;
	}
</style>
