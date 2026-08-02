<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';
	import DisciplineCard from '$lib/components/DisciplineCard.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import ClassCard from '$lib/components/ClassCard.svelte';
	import CoachCard from '$lib/components/CoachCard.svelte';
	import PlanCard from '$lib/components/PlanCard.svelte';
	import JournalCard from '$lib/components/JournalCard.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Newsletter from '$lib/components/Newsletter.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import SessionSlot from '$lib/components/SessionSlot.svelte';
	import {
		classes,
		coaches,
		disciplines,
		facilities,
		journal,
		method,
		nutritionPrinciples,
		plans,
		site,
		timetable,
		womensFloor
	} from '$lib/data/site';

	/* Facts about how the gym runs. Not claims about results. */
	const figures = [
		['04', 'People per session, at most'],
		['12', 'Weeks in a training block'],
		['16', 'Coached classes a week'],
		['00', 'Foods on a banned list']
	];

	const today = timetable.slice(0, 3);
</script>

<Seo
	title={site.name}
	description="A coached strength and conditioning gym in Banani, Dhaka. Twelve-week blocks, four people to a session, nutrition that fits your life."
	image="/images/hero-deadlift.jpg"
/>

<!-- Hero. Content ships visible in the HTML; nothing is hidden and revealed. -->
<section class="hero on-dark">
	<div class="hero__media">
		<img
			src="/images/hero-deadlift.jpg"
			alt="A loaded barbell being lifted from the floor in a gym"
			width="1800"
			height="1013"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="media__scrim"></div>
	</div>

	<div class="container hero__inner">
		<p class="t-label hero__eyebrow">Banani, Dhaka · Strength · Nutrition</p>

		<h1 class="t-display hero__title">
			Get strong.<br />
			<em>Stay</em> strong.
		</h1>

		<div class="hero__foot">
			<p class="t-body-lg hero__standfirst">
				A coached gym for people who want to lift well, eat well and still have a life outside the
				building. Twelve-week blocks, four people to a session, and a plan built around the week you
				actually have.
			</p>
			<div class="hero__actions">
				<Button href="/contact" variant="solid" arrow>Book a free session</Button>
				<Button href="/timetable" variant="ghost">See the timetable</Button>
			</div>
		</div>
	</div>
</section>

<section class="figures band">
	<div class="container">
		<dl class="figures__list">
			{#each figures as [value, label] (label)}
				<div class="figures__item">
					<dd class="t-num figures__value">{value}</dd>
					<dt class="t-label figures__label">{label}</dt>
				</div>
			{/each}
		</dl>
	</div>
</section>

<Section label="What we coach" ruled={false}>
	<h2 class="t-h2">
		Coached together, <em>never in isolation.</em>
	</h2>
	<div class="cards cards--4">
		{#each disciplines as d (d.name)}
			<DisciplineCard {...d} />
		{/each}
	</div>
</Section>

<Section label="Classes">
	<div class="head">
		<div>
			<h2 class="t-h2">The same classes, on repeat.</h2>
			<p class="t-body-lg head__lede">
				Every class is capped and coached. Turn up, and someone tells you what weight to use and
				watches you use it.
			</p>
		</div>
		<Button href="/timetable" variant="ghost" arrow>Full timetable</Button>
	</div>

	<div class="cards cards--4">
		{#each classes as c (c.id)}
			<ClassCard {...c} />
		{/each}
	</div>
</Section>

<Section label="This week">
	<div class="head">
		<div>
			<h2 class="t-h2">Sessions from 06:15.</h2>
			<p class="t-body-lg head__lede">
				The start of the week, Sunday to Tuesday. Book from your phone; spaces open fourteen days
				ahead.
			</p>
		</div>
		<Button href="/timetable" variant="ghost" arrow>All seven days</Button>
	</div>

	<div class="week">
		{#each today as day (day.day)}
			<div class="week__col">
				<h3 class="t-label-sm week__day">{day.day}</h3>
				<ul>
						{#each day.sessions as s (s.time + s.name)}
							<li><SessionSlot {...s} /></li>
						{/each}
				</ul>
			</div>
		{/each}
	</div>

	<p class="legend t-label">
		<span class="chip" aria-hidden="true">Women only</span>
		sessions run on the separate floor
	</p>
</Section>

<Section label="Women’s floor">
	<div class="split">
		<div class="split__text">
			<h2 class="t-h2">A separate floor, and the same programme.</h2>
			<p class="t-body-lg split__body">
				Its own room, its own entrance and its own hours, coached only by women. Not a lighter
				version of the main floor — the same lifts, the same progression, the same expectations.
			</p>

			<ul class="womens">
				{#each womensFloor.points as p (p.title)}
					<li class="womens__item">
						<Icon name={p.icon} size={17} />
						<span>
							<span class="womens__name">{p.title}</span>
							<span class="womens__note">{p.body}</span>
						</span>
					</li>
				{/each}
			</ul>

			<div class="split__cta">
				<Button href="/womens" variant="ghost" arrow>The women’s floor</Button>
			</div>
		</div>

		<div class="media media--card media--muted">
			<img
				src="/images/womens-gym.jpg"
				alt="A woman in hijab stretching through a warm-up on the women’s floor"
				width="1200"
				height="900"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
</Section>

<Section label="Membership">
	<div class="head">
		<div>
			<h2 class="t-h2">Monthly, with no joining fee.</h2>
			<p class="t-body-lg head__lede">
				Monthly, cancel with thirty days’ notice, and you can freeze for up to three months a year.
			</p>
		</div>
		<Button href="/membership" variant="ghost" arrow>Compare in full</Button>
	</div>

	<div class="plans">
		{#each plans as p (p.id)}
			<PlanCard {...p} />
		{/each}
	</div>
</Section>

<Section label="The gym">
	<div class="split">
		<div class="split__text">
			<h2 class="t-h2">A floor, not a showroom.</h2>
			<p class="t-body-lg split__body">
				Platforms, racks, bars and enough space to use them. No queue for the squat rack at six in
				the evening, because there are never more than four people in a coached session.
			</p>
			<ul class="facilities">
				{#each facilities as f (f.name)}
					<li class="facilities__item">
						<Icon name={f.icon} size={17} />
						<span>
							<span class="facilities__name">{f.name}</span>
							<span class="facilities__note">{f.note}</span>
						</span>
					</li>
				{/each}
			</ul>
			<div class="split__cta">
				<Button href="/contact" variant="ghost" arrow>Come and look around</Button>
			</div>
		</div>

		<div class="split__media">
			<div class="media media--portrait media--muted">
				<img
					src="/images/facility-racks.jpg"
					alt="Squat racks and barbells set up across a bright training floor"
					width="1400"
					height="1867"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="media media--square media--muted split__media-small">
				<img
					src="/images/equipment.jpg"
					alt="A kettlebell, medicine ball and rope resting on a wooden box"
					width="1200"
					height="1200"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>
	</div>
</Section>

<Section label="Coaches">
	<div class="head">
		<div>
			<h2 class="t-h2">The people who will actually coach you.</h2>
			<p class="t-body-lg head__lede">
				Four coaches, each with one thing they are genuinely good at. You will work with more than
				one of them.
			</p>
		</div>
		<Button href="/coaches" variant="ghost" arrow>Meet the team</Button>
	</div>

	<!-- Five across on wide screens: a four-column grid would strand the fifth
		 coach alone on a second row. -->
	<div class="cards cards--5">
		{#each coaches as c (c.id)}
			<CoachCard {...c} compact />
		{/each}
	</div>
</Section>

<Section label="How it works">
	<h2 class="t-h2">Always in this order.</h2>
	<p class="t-body-lg head__lede">
		Numbered because the sequence matters. Skipping the first one is why most plans quietly stop
		working around week three.
	</p>

	<ol class="steps">
		{#each method as step (step.n)}
			<li class="steps__item">
				<span class="t-num steps__n">{step.n}</span>
				<h3 class="t-h3 steps__title">{step.title}</h3>
				<p class="t-body steps__body">{step.body}</p>
			</li>
		{/each}
	</ol>

	<div class="section__cta">
		<Button href="/method" variant="ghost" arrow>Read the method</Button>
	</div>
</Section>

<Section label="Nutrition">
	<div class="split split--top">
		<div class="split__text">
			<h2 class="t-h2">
				Eat like an adult. <em>Not like a spreadsheet.</em>
			</h2>
			<p class="t-body-lg split__body">
				No shakes to buy, no foods banned, no six-week transformation. We set protein, put your
				carbohydrate where the training is, and leave the rest of your life alone.
			</p>
			<div class="split__cta">
				<Button href="/nutrition" variant="ghost" arrow>How we handle food</Button>
			</div>
		</div>

		<ul class="principles">
			{#each nutritionPrinciples as p (p.title)}
				<li class="principles__item">
					<Icon name={p.icon} size={20} />
					<h3 class="t-h3 principles__title">{p.title}</h3>
					<p class="t-body principles__body">{p.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</Section>

<Section label="Members">
	<h2 class="t-h2">What people say once they stay.</h2>
	<Testimonials />
</Section>

<Section label="Journal">
	<div class="head">
		<div>
			<h2 class="t-h2">Reading, if you want it.</h2>
			<p class="t-body-lg head__lede">
				Training and food, written plainly. No listicles and nothing you need to buy at the end.
			</p>
		</div>
		<Button href="/journal" variant="ghost" arrow>All articles</Button>
	</div>

	<div class="cards cards--3">
		{#each journal.slice(0, 3) as post (post.slug)}
			<JournalCard {...post} />
		{/each}
	</div>
</Section>

<Newsletter />

<CtaBand
	label="Start here"
	title="Start where you are, not where you think you should be."
	body="The first session is free and there is nothing to sign. We look at how you move, talk about what you want, and tell you honestly whether this is the right gym for it."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/method', text: 'How it works' }}
	image="/images/method-rack.jpg"
/>

<style>
	/* --- Hero ------------------------------------------------------------ */

	.hero {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: clamp(560px, 82vh, 860px);
		background: var(--band);
		color: #f5f5f3;
		padding-block: clamp(56px, 8vw, 88px);
		isolation: isolate;
	}

	.hero__media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	.hero__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 40%;
		filter: saturate(0.72) contrast(1.06) brightness(0.86);
	}

	.hero__inner {
		width: 100%;
	}

	.hero__eyebrow {
		color: rgb(245 245 243 / 0.72);
	}

	.hero__title {
		margin-top: clamp(20px, 3vw, 32px);
	}

	.hero__foot {
		display: grid;
		gap: 32px;
		margin-top: clamp(36px, 5vw, 52px);
		padding-top: 32px;
		border-top: 1px solid rgb(245 245 243 / 0.22);
	}

	@media (min-width: 900px) {
		.hero__foot {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: start;
			gap: 64px;
		}
	}

	.hero__standfirst {
		color: rgb(245 245 243 / 0.86);
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	/* --- Figures --------------------------------------------------------- */

	/* Solid dark under the hero photograph: the stats read as one block with it
	   and the page gets a breath before the white starts. */
	.figures {
		padding-block: clamp(48px, 6vw, 76px);
	}

	.figures__list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px 24px;
	}

	@media (min-width: 860px) {
		.figures__list {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.figures__item {
		padding-top: 18px;
		border-top: 1px solid var(--band-rule);
	}

	.figures__value {
		font-size: clamp(38px, 4.6vw, 56px);
		line-height: 1;
		letter-spacing: -0.045em;
		color: var(--lime);
	}

	.figures__label {
		margin-top: 10px;
		max-width: 18ch;
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

	.section__cta {
		margin-top: 44px;
	}

	.cards {
		display: grid;
		gap: 40px 28px;
		margin-top: 48px;
	}

	@media (min-width: 620px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 900px) {
		.cards--5 {
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 28px 20px;
		}
	}

	@media (min-width: 1040px) {
		.cards--3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cards--4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	/* --- Timetable preview ----------------------------------------------- */

	.week {
		display: grid;
		gap: 1px;
		margin-top: 48px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 780px) {
		.week {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.week__col {
		background: var(--paper);
		padding: 24px 22px 28px;
	}

	.week__day {
		color: var(--faint);
	}

	.week__col ul {
		margin-top: 20px;
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 20px;
	}



	.womens {
		margin-top: 32px;
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	.womens__item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		background: var(--paper);
		padding: 18px 20px 20px;
	}

	.womens__name,
	.womens__note {
		display: block;
		font-size: 15px;
		line-height: 1.45;
	}

	.womens__note {
		margin-top: 4px;
		color: var(--faint);
		font-size: 14px;
	}

	/* --- Plans ------------------------------------------------------------ */

	.plans {
		display: grid;
		gap: 1px;
		margin-top: 48px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 900px) {
		.plans {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	/* --- Split sections --------------------------------------------------- */

	.split {
		display: grid;
		gap: 48px;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
			gap: 72px;
			align-items: center;
		}

		.split--top {
			align-items: start;
		}
	}

	.split__body {
		margin-top: 20px;
		color: var(--muted);
	}

	.split__cta {
		margin-top: 32px;
	}

	.facilities {
		margin-top: 32px;
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 560px) {
		.facilities {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.facilities__item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		background: var(--paper);
		padding: 18px 20px 20px;
	}

	.facilities__name,
	.facilities__note {
		display: block;
		font-size: 15px;
		line-height: 1.4;
	}

	.facilities__note {
		margin-top: 4px;
		color: var(--faint);
		font-size: 14px;
	}

	.split__media {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
	}

	.split__media > :first-child {
		grid-column: 1 / -1;
	}

	.split__media-small {
		grid-column: 1 / 2;
	}

	/* --- Steps ------------------------------------------------------------ */

	.steps {
		display: grid;
		gap: 1px;
		margin-top: 48px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 760px) {
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.steps__item {
		background: var(--paper);
		padding: 32px 30px 36px;
	}

	.steps__n {
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--faint);
	}

	.steps__title {
		margin-top: 16px;
	}

	.steps__body {
		margin-top: 12px;
		color: var(--muted);
		max-width: 44ch;
	}

	/* --- Nutrition principles ---------------------------------------------- */

	/* Four items, so 2x2 rather than auto-fit — which would strand the fourth
	   alone on a second row. No outer border: the surface change is the edge. */
	.principles {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 560px) {
		.principles {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.principles__item {
		background: var(--paper);
		padding: 30px 28px 34px;
		color: var(--muted);
	}

	.principles__title {
		margin-top: 20px;
		color: var(--ink);
	}

	.principles__body {
		margin-top: 10px;
	}
</style>
