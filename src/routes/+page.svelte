<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';
	import DisciplineCard from '$lib/components/DisciplineCard.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import PlanCard from '$lib/components/PlanCard.svelte';
	import Disclosure from '$lib/components/Disclosure.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { disciplines, faqs, plans, site } from '$lib/data/site';

	/*
		The first thing on the page after the headline. A visitor who has never
		set foot in a gym and one who has trained for years need different next
		pages, and asking them to work that out from a menu of eleven items is
		what makes a website feel like homework. So the page asks the question
		instead, in the words people use about themselves.
	*/
	const routes = [
		{
			href: '/about',
			icon: 'target' as const,
			who: 'I have never trained before',
			what: 'Start with how coaching works here. Nothing assumes you know a squat from a hinge.'
		},
		{
			href: '/training',
			icon: 'dumbbell' as const,
			who: 'I train, but I have stalled',
			what: 'Look at the programmes. Twelve-week blocks, written down, reviewed every four weeks.'
		},
		{
			href: '/womens',
			icon: 'users' as const,
			who: 'I would rather train with women',
			what: 'A separate floor with its own entrance and its own hours, coached only by women.'
		},
		{
			href: '/membership',
			icon: 'scale' as const,
			who: 'I just want to use the gym',
			what: 'Open Floor gets you the equipment and the opening hours, without the coaching.'
		}
	];

</script>

<Seo
	title={site.name}
	description="A coached strength and conditioning gym in Dhaka. Twelve-week blocks, four people to a session, nutrition that fits your life."
	image="/images/hero-deadlift.jpg"
/>

<!-- Hero. Content ships visible in the HTML; nothing is hidden and revealed. -->
<section class="hero on-dark" data-hero>
	<div class="hero__media">
		<enhanced:img
			src={img('/images/hero-deadlift.jpg')}
			alt="A loaded barbell being lifted from the floor in a gym"
			sizes="100vw"
			fetchpriority="high"
		/>
		<div class="media__scrim"></div>
	</div>

	<div class="container hero__inner">
		<h1 class="t-display hero__title">
			Get strong.<br />
			<!-- Lime as a fill behind the word, never as the colour of it — the one
				 rule the accent follows everywhere else on the site. -->
			<span class="mark">Stay</span> strong.
		</h1>

		<p class="t-body-lg hero__standfirst">
			A coached gym for people who want to lift well and eat well. If you have never
			trained properly before, that is where most people here started.
		</p>

		<p class="t-label hero__cue" aria-hidden="true">
			<span class="hero__cue-rule"></span>
			Scroll
		</p>
	</div>
</section>

<!--
	Signposting before selling. Whichever of these three a visitor recognises
	as themselves, they leave this section on a page written for them.
-->
<Section ruled={false}>
	<h2 class="t-h2">Which one of these is you?</h2>

	<div class="routes">
		{#each routes as r (r.href)}
			<a class="route tile-hover" href={r.href}>
				<span class="icon-badge"><Icon name={r.icon} size={24} /></span>
				<h3 class="t-h3 route__who">“{r.who}”</h3>
				<p class="t-body route__what">{r.what}</p>
				<span class="route__go t-label">
					Take me there
					<Icon name="arrow-right" size={15} />
				</span>
			</a>
		{/each}
	</div>
</Section>

<Section>
	<div class="head">
		<h2 class="t-h2">Our programmes</h2>
		<Button href="/training" variant="ghost" arrow>See the programmes</Button>
	</div>
	<div class="cards cards--4">
		{#each disciplines as d (d.name)}
			<DisciplineCard {...d} />
		{/each}
	</div>
</Section>

<!--
	Pricing in full, not a teaser. It is the question everyone has and the one
	nobody should have to open another page to answer — /membership stays for
	the line-by-line comparison, which is genuinely a different job.
-->
<Section id="pricing">
	<div class="head">
		<div>
			<h2 class="t-h2">Pricing</h2>
			<p class="t-body-lg head__lede">
				Cancel with thirty days’ notice, and freeze for up to three months a year.
			</p>
		</div>
		<Button href="/membership" variant="ghost" arrow>Compare line by line</Button>
	</div>

	<div class="plans">
		{#each plans as p (p.id)}
			<PlanCard {...p} />
		{/each}
	</div>
</Section>

<!-- Every question, not the first four. The worries that stop people booking
	 are answered here rather than one click further away. -->
<Section id="faq">
	<h2 class="t-h2 faq__title">FAQ</h2>

	<div class="faq">
		{#each faqs as f (f.question)}
			<Disclosure {...f} />
		{/each}
	</div>
</Section>

<CtaBand
	title="Start where you are, not where you think you should be."
	body="The first session is free and there is nothing to sign. We look at how you move, talk about what you want, and tell you honestly whether this is the right gym for it."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/method', text: 'How it works' }}
	image="/images/method-rack.jpg"
/>

<style>
	/* --- Hero ------------------------------------------------------------ */

	/* Pulled up under the sticky bar so the photograph runs to the top of the
	   window and the header reads as part of it. The top padding gives the
	   height back as padding, so nothing sits beneath the bar. */
	.hero {
		position: relative;
		display: flex;
		/* Centred rather than sunk to the bottom edge. The old composition left
		   a dead half-screen above the type; this puts the headline where the
		   eye already is and lets the photograph breathe on both sides of it. */
		align-items: center;
		/* svh, not vh: on a phone vh is the tallest the viewport ever gets, so
		   the bottom of the hero would sit behind the browser's own chrome. */
		min-height: 100svh;
		margin-top: calc(-1 * var(--header-h));
		background: var(--band);
		color: #f5f5f3;
		padding-block: calc(var(--header-h) + clamp(48px, 6vw, 72px)) clamp(72px, 9vw, 104px);
		isolation: isolate;
	}

	.hero__media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	/*
		The shared scrim is weighted to the bottom of the frame, which was right
		when the type sat on the bottom edge. Centred, the headline crosses the
		middle where that gradient is at its thinnest — so a light even wash
		carries the contrast there instead.
	*/
	.hero__media::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		background: rgb(6 7 8 / 0.2);
	}

	/* The bar carries no surface of its own here, so the photograph has to
	   supply the contrast behind it. A short gradient at the top does that
	   without darkening the whole frame the way a flat wash would. */
	.hero__media::after {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		z-index: 2;
		height: 260px;
		background: linear-gradient(
			to bottom,
			rgb(6 7 8 / 0.74) 0%,
			rgb(6 7 8 / 0.44) 44%,
			rgb(6 7 8 / 0) 100%
		);
	}

	/* enhanced:img wraps the image in <picture>, which scoped selectors do not
	   reach, so these are global inside the hero. */
	.hero__media :global(picture) {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* Brighter and less desaturated than before: the photograph now has to hold
	   a lime mark sitting on top of it, and a murky frame made the accent look
	   like a mistake rather than a decision. */
	.hero__media :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 42%;
		filter: saturate(0.86) contrast(1.04) brightness(0.94);
	}

	.hero__inner {
		width: 100%;
	}

	/*
		An inline background is drawn to the font's ascender and descender, and
		Archivo's are generous — at display size that left a slab with far more
		lime above and below the caps than beside them. inline-block plus a
		tight line-height hands the box back to us so it hugs the word.
	*/
	.hero__title :global(.mark) {
		display: inline-block;
		line-height: 0.82;
		padding: 0.1em 0.12em 0.08em;
	}

	/*
		Asymmetric, not stacked. The sentence moves out of the headline's shadow
		into its own column and sits on the headline's last line, so the two
		read as one composition instead of one block of text under another.
	*/
	@media (min-width: 1000px) {
		.hero__inner {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 0.52fr);
			align-items: end;
			column-gap: clamp(40px, 5vw, 80px);
		}

		.hero__standfirst {
			margin-top: 0;
			padding-bottom: 0.6em;
		}

		.hero__cue {
			grid-column: 1 / -1;
		}
	}

	.hero__standfirst {
		margin-top: 24px;
		max-width: 46ch;
		color: rgb(245 245 243 / 0.9);
	}

	/* A small promise that the page continues. Sits below both columns, in the
	   space the centred composition leaves at the bottom of the frame. */
	.hero__cue {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: clamp(48px, 7vw, 88px);
		color: rgb(245 245 243 / 0.6);
	}

	.hero__cue-rule {
		display: block;
		width: 44px;
		height: 2px;
		background: var(--lime);
		flex: none;
	}

	/* --- Shared section furniture ---------------------------------------- */

	/* Heading on the left, the section's own link on the right — so every
	   section offers a way deeper without a row of buttons at the bottom. */
	.head {
		display: grid;
		gap: 24px;
	}

	@media (min-width: 860px) {
		.head {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: end;
			gap: 48px;
		}
	}

	.head__lede {
		margin-top: 20px;
		color: var(--muted);
	}

	/* --- Start here ------------------------------------------------------- */

	.routes {
		display: grid;
		gap: 1px;
		margin-top: 56px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	/* Two by two rather than four across: these are sentences to read and
	   recognise yourself in, not labels to scan. */
	@media (min-width: 720px) {
		.routes {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.route {
		display: flex;
		flex-direction: column;
		padding: 32px 30px 34px;
		color: var(--ink);
	}

	.route__who {
		margin-top: 20px;
		text-wrap: pretty;
	}

	.route__what {
		margin-top: 12px;
		margin-bottom: 26px;
		color: var(--muted);
	}

	/* Pushed to the bottom so the three prompts line up however long the
	   sentence above them runs. */
	.route__go {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: auto;
		color: var(--ink);
	}

	.route:hover .route__go {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	/* --- FAQ preview -------------------------------------------------------- */

	/* Centred column. A list of questions is read one at a time down a single
	   axis, so it is the one block on the page that does not want to be pinned
	   to the left edge of a full-width container. */
	.faq {
		margin-top: 48px;
		max-width: 78ch;
		margin-inline: auto;
	}

	.faq__title {
		text-align: center;
	}

	.cards {
		display: grid;
		gap: 40px 28px;
		margin-top: 64px;
	}

	@media (min-width: 620px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.cards--4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	/* --- Plans ------------------------------------------------------------ */

	/* The grid itself is in layout.css so this page and /membership share one
	   row template; only the space above it belongs to this page. */
	.plans {
		margin-top: 64px;
	}

</style>
