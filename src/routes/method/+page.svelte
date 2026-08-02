<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import Disclosure from '$lib/components/Disclosure.svelte';
	import { method, faqs } from '$lib/data/site';

	const beliefs = [
		{
			title: 'Consistency beats intensity',
			body: 'Three sessions you never miss will take you further than five you skip half of. We write the plan for the smaller number on purpose.'
		},
		{
			title: 'Change one thing at a time',
			body: 'Change five things and something will work — you just will not know which. One change per review means you learn what your body actually responds to.'
		},
		{
			title: 'The plan fits the person',
			body: 'Shift work, kids, a bad knee, a job that has you on your feet all day. The plan is written around those, not in spite of them.'
		},
		{
			title: 'We give the boring answer',
			body: 'Usually it is sleep, protein, or adding five kilos over eight weeks instead of twenty over two. Nobody can sell that, which is why it still works.'
		}
	];
</script>

<Seo
	title="Method"
	description="How coaching at Amala Lifestyle works: an assessment, a one-page plan, coached sessions, and a review every four weeks."
	image="/images/method-rack.jpg"
/>

<PageHeader
	title="Assess. Plan. Coach. Review."
	standfirst="No secret system. Just an order of operations that most plans skip, and a review often enough to catch a mistake while it is still small."
	image="/images/method-rack.jpg"
	alt="Hands lifting a dumbbell from a rack in a gym"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
	{/snippet}
</PageHeader>

<Section>
	<ol class="steps">
		{#each method as step (step.n)}
			<li class="steps__item tile-hover">
				<span class="t-num steps__n">{step.n}</span>
				<div>
					<h2 class="t-h2">{step.title}</h2>
					<p class="t-body-lg steps__body">{step.body}</p>
				</div>
			</li>
		{/each}
	</ol>
	<p class="t-body steps__loop">
		Then step four returns to step two, and keeps doing that for as long as you train here.
	</p>
</Section>

<Section>
	<h2 class="t-h2">What we stand for</h2>
	<ul class="beliefs">
		{#each beliefs as b (b.title)}
			<li class="beliefs__item">
				<h3 class="t-h3">{b.title}</h3>
				<p class="t-body beliefs__body">{b.body}</p>
			</li>
		{/each}
	</ul>
</Section>

<Section>
	<div class="split">
		<div>
			<h2 class="t-h2">FAQ</h2>
			<p class="t-body-lg faqs__lede">
				If yours is not here, ask it at the first session — or email and we will answer properly
				rather than sending you a brochure.
			</p>
			<div class="media media--card media--muted faqs__photo">
				<enhanced:img
					src={img('/images/studio.jpg')}
					alt="A bright studio floor set up with training equipment"
					sizes="(min-width: 980px) 40vw, 100vw"
					loading="lazy"
				/>
			</div>
		</div>

		<div class="faqs">
			{#each faqs as faq (faq.question)}
				<Disclosure {...faq} />
			{/each}
		</div>
	</div>
</Section>

<CtaBand
	title="The first session costs nothing and commits you to nothing."
	body="Ninety minutes, and no sales pitch at the end of it. If we are not the right fit we will say so and point you somewhere better."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/training', text: 'Programmes' }}
	image="/images/facility-racks.jpg"
/>

<style>
	.steps__item {
		display: grid;
		gap: 12px 40px;
		padding-block: 44px;
		border-top: 1px solid var(--rule);
	}

	.steps__item:last-child {
		border-bottom: 1px solid var(--rule);
	}

	@media (min-width: 760px) {
		.steps__item {
			grid-template-columns: 80px minmax(0, 1fr);
		}
	}

	.steps__n {
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--faint);
		padding-top: 12px;
	}

	.steps__body {
		margin-top: 16px;
		color: var(--muted);
	}

	.steps__loop {
		margin-top: 28px;
		color: var(--faint);
	}

	.beliefs {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		margin-top: 48px;
	}

	@media (min-width: 760px) {
		.beliefs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.beliefs__item {
		background: var(--paper);
		padding: 32px 30px 36px;
	}

	.beliefs__body {
		margin-top: 12px;
		color: var(--muted);
	}

	.split {
		display: grid;
		gap: 48px;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
			gap: 64px;
			align-items: start;
		}
	}

	.faqs__lede {
		margin-top: 20px;
		color: var(--muted);
	}

	.faqs__photo {
		margin-top: 40px;
	}
</style>
