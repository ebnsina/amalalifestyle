<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import { method } from '$lib/data/site';

	/* What the place refuses to do, written plainly. Easier to judge a gym by
	   than a list of what it offers, because every gym offers the same list. */
	const principles = [
		{
			title: 'Nobody is left to guess',
			body: 'Four people to a session means a coach can watch every rep. You are told what weight to use and then watched using it.'
		},
		{
			title: 'No food is banned',
			body: 'We set protein, put carbohydrate near your training, and leave the rest of your week alone. There is nothing to buy from us.'
		},
		{
			title: 'Progress is written down',
			body: 'Every four weeks we read your numbers together and change one thing. Never five things at once, so you can tell what worked.'
		},
		{
			title: 'No contracts, no pressure',
			body: 'Monthly, thirty days notice, freeze for up to three months a year. If this is not the right gym for you we will say so.'
		}
	];
</script>

<Seo
	title="About us"
	description="A coached strength and nutrition gym in Dhaka. Small sessions, twelve-week blocks, and coaching that explains itself."
	image="/images/gym-floor.jpg"
/>

<PageHeader
	title="A gym that explains itself"
	standfirst="Amala Lifestyle is a coached strength, conditioning and nutrition gym in Dhaka. It exists because most gyms sell access to equipment and then leave you alone with it."
	image="/images/gym-floor.jpg"
	alt="The main training floor at Amala Lifestyle, racks and platforms in daylight"
/>

<Section ruled={false}>
	<div class="split">
		<div>
			<h2 class="t-h2">Our story</h2>
			<div class="prose">
				<p class="t-body-lg">
					They quit because nobody ever told them what they were supposed to be doing, and six
					months of guessing feels like failing.
				</p>
				<p class="t-body">
					We opened with one rule: no member trains without knowing why. Every session is
					capped at four people so a coach can actually watch you, every plan is written on one
					page, and every four weeks you sit down and read your own numbers.
				</p>
				<p class="t-body">
					That is the whole idea. It is not complicated, and it is not new — it is just rare,
					because it does not scale as cheaply as selling memberships to a room full of machines.
				</p>
			</div>
		</div>

		<div class="media media--card media--muted">
			<enhanced:img
				src={img('/images/coaching-spot.jpg')}
				alt="A coach spotting a member through the top of a lift"
				sizes="(min-width: 980px) 46vw, 100vw"
				loading="lazy"
			/>
		</div>
	</div>
</Section>

<Section>
	<h2 class="t-h2">What we stand for</h2>

	<ul class="principles">
		{#each principles as p (p.title)}
			<li class="principles__item tile-hover">
				<h3 class="t-h3">{p.title}</h3>
				<p class="t-body principles__body">{p.body}</p>
			</li>
		{/each}
	</ul>
</Section>

<Section>
	<div class="head">
		<h2 class="t-h2">How coaching works</h2>
		<Button href="/method" variant="ghost" arrow>The method in full</Button>
	</div>

	<ol class="steps">
		{#each method as step (step.n)}
			<li class="steps__item tile-hover">
				<span class="step-badge">{step.n}</span>
				<h3 class="t-h3 steps__title">{step.title}</h3>
				<p class="t-body steps__body">{step.body}</p>
			</li>
		{/each}
	</ol>
</Section>

<NextUp />

<CtaBand
	title="The best way to judge a gym is to stand in it."
	body="Ninety minutes, free, and nothing to sign at the end. We look at how you move, talk about what you want, and tell you honestly whether this is the right place for it."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/facilities', text: 'See the facilities' }}
	image="/images/method-rack.jpg"
/>

<style>
	.split {
		display: grid;
		gap: 48px;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
			gap: 72px;
			align-items: start;
		}
	}

	.prose {
		display: grid;
		gap: 20px;
		margin-top: 24px;
		max-width: var(--measure);
		color: var(--muted);
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

	.principles,
	.steps {
		display: grid;
		gap: 1px;
		margin-top: 56px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 760px) {
		.principles,
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.principles__item,
	.steps__item {
		padding: 32px 30px 36px;
	}

	.principles__body,
	.steps__body {
		margin-top: 12px;
		color: var(--muted);
		max-width: 44ch;
	}

	.steps__title {
		margin-top: 16px;
	}
</style>
