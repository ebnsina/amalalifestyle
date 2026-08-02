<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import { testimonials } from '$lib/data/site';

	/*
		What changing looks like from the inside, stage by stage. Deliberately
		about behaviour rather than kilos or centimetres: those depend on where
		someone started, and promising them to a stranger reading a website is
		how gyms end up lying.
	*/
	const arc = [
		{
			when: 'Week 1',
			title: 'You stop guessing',
			body: 'The assessment tells you what you can lift today and what your week actually looks like. Most people say this is the first time anyone asked.'
		},
		{
			when: 'Week 4',
			title: 'The bar gets heavier',
			body: 'Early strength is mostly skill, so it moves fast. This is the point people stop dreading sessions and start planning around them.'
		},
		{
			when: 'Week 12',
			title: 'It runs without us',
			body: 'You know the movements, you know your numbers, and you can read your own plan. The block ends and you decide whether to run another.'
		}
	];
</script>

<Seo
	title="Success stories"
	description="What members say about coached training at Amala Lifestyle in Dhaka — and what the first twelve weeks actually look like."
	image="/images/class-strength.jpg"
/>

<PageHeader
	title="What changing actually looks like"
	standfirst="No before-and-afters and no transformation photographs. Just what members say once they have stayed long enough to have an opinion worth reading."
	image="/images/class-strength.jpg"
	alt="Members working through a coached strength class together"
/>

<Section ruled={false}>
	<h2 class="t-h2">Testimonials</h2>

	<div class="quotes">
		{#each testimonials as t (t.quote)}
			<figure class="quote tile-hover">
				<blockquote class="t-body-lg quote__text">{t.quote}</blockquote>
				<figcaption class="quote__by">
					<span class="quote__name">{t.name}</span>
					<span class="t-label quote__detail">{t.detail}</span>
				</figcaption>
			</figure>
		{/each}
	</div>
</Section>

<Section>
	<div class="head">
		<h2 class="t-h2">Your first twelve weeks</h2>
		<Button href="/method" variant="ghost" arrow>How coaching works</Button>
	</div>

	<ol class="arc">
		{#each arc as step (step.when)}
			<li class="arc__item tile-hover">
				<span class="t-num arc__when">{step.when}</span>
				<h3 class="t-h3 arc__title">{step.title}</h3>
				<p class="t-body arc__body">{step.body}</p>
			</li>
		{/each}
	</ol>

	<p class="t-body caveat">
		Speeds differ. Sleep, stress and how long you have been away from training move these dates more
		than any programme does — and anyone promising you a fixed timeline has not met you yet.
	</p>
</Section>

<Section>
	<div class="split">
		<div>
			<h2 class="t-h2">Who this is not for</h2>
			<ul class="limits">
				<li class="t-body">
					If you want a six-week transformation, we are the wrong gym and will say so at the
					assessment.
				</li>
				<li class="t-body">
					If you would rather train alone with headphones on, an Open Floor membership is honestly
					better value than coaching.
				</li>
				<li class="t-body">
					If you are managing an injury, bring your physiotherapist's advice. We train around
					injuries; we do not diagnose or treat them.
				</li>
			</ul>
		</div>

		<div class="media media--card media--muted">
			<enhanced:img
				src={img('/images/coaching-spot.jpg')}
				alt="A coach talking a member through the setup of a lift"
				sizes="(min-width: 980px) 46vw, 100vw"
				loading="lazy"
			/>
		</div>
	</div>
</Section>

<NextUp />

<CtaBand
	title="Start where you are, not where you think you should be."
	body="The first session is free and there is nothing to sign. We look at how you move, talk about what you want, and tell you honestly whether this is the right gym for it."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/membership', text: 'See pricing' }}
	image="/images/method-rack.jpg"
/>

<style>
	.quotes {
		display: grid;
		gap: 1px;
		margin-top: 56px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 900px) {
		.quotes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.quote {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 28px;
		padding: 34px 30px 36px;
	}

	.quote__text {
		text-wrap: pretty;
	}

	.quote__by {
		display: grid;
		gap: 6px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
	}

	.quote__name {
		font-size: 15px;
	}

	.quote__detail {
		color: var(--faint);
	}

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

	.arc {
		display: grid;
		gap: 1px;
		margin-top: 56px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 860px) {
		.arc {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.arc__item {
		padding: 32px 30px 36px;
	}

	.arc__when {
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--faint);
	}

	.arc__title {
		margin-top: 16px;
	}

	.arc__body {
		margin-top: 12px;
		color: var(--muted);
	}

	.caveat {
		margin-top: 28px;
		color: var(--faint);
		max-width: 62ch;
	}

	.split {
		display: grid;
		gap: 48px;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 72px;
			align-items: center;
		}
	}

	.limits {
		display: grid;
		gap: 18px;
		margin-top: 28px;
		max-width: 52ch;
		color: var(--muted);
	}

	.limits li {
		padding-left: 20px;
		border-left: 2px solid var(--lime);
	}
</style>
