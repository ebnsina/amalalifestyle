<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import CoachCard from '$lib/components/CoachCard.svelte';
	import { coaches } from '$lib/data/site';
</script>

<Seo
	title="Coaches"
	description="The five coaches at Amala Lifestyle in Dhaka — strength, conditioning, mobility, speed and the women’s floor."
	image="/images/coaching-spot.jpg"
/>

<PageHeader
	title="One thing each, done properly"
	standfirst="Nobody here claims to be good at everything. Each coach owns one part of the programme, and you will work with more than one of them over a twelve-week block."
	image="/images/coaching-spot.jpg"
	alt="A coach spotting a lifter through a set"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		<Button href="/timetable" variant="ghost">Who coaches what</Button>
	{/snippet}
</PageHeader>

<Section ruled={false}>
	<div class="team">
		{#each coaches as c (c.id)}
			<CoachCard {...c} />
		{/each}
	</div>
</Section>

<Section>
	<div class="split">
		<div>
			<h2 class="t-h2">What a coach does</h2>
			<p class="t-body-lg split__lede">
				Not motivation and not counting your reps out loud. A coach is there to pick the weight,
				watch the bar path, and stop the session one set before you would have stopped it yourself.
			</p>
		</div>

		<ol class="rules">
			<li class="rules__item">
				<span class="t-num rules__n">01</span>
				<p class="t-body">
					Every session is watched. If nobody saw your set, it was not a coached session.
				</p>
			</li>
			<li class="rules__item">
				<span class="t-num rules__n">02</span>
				<p class="t-body">
					Loads are written before you arrive, then adjusted on the day for how you actually turned
					up.
				</p>
			</li>
			<li class="rules__item">
				<span class="t-num rules__n">03</span>
				<p class="t-body">
					Nobody gets talked into a personal best they did not come in for.
				</p>
			</li>
			<li class="rules__item">
				<span class="t-num rules__n">04</span>
				<p class="t-body">
					If something hurts, the session changes. It does not get pushed through and reviewed
					later.
				</p>
			</li>
		</ol>
	</div>
</Section>

<NextUp />

<CtaBand
	title="Meet whoever will be coaching you, first."
	body="The free session is with the coach who would actually write your programme — not with a salesperson who hands you over afterwards."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/method', text: 'Our method' }}
	image="/images/method-rack.jpg"
/>

<style>
	.team {
		display: grid;
		gap: 48px 32px;
	}

	@media (min-width: 640px) {
		.team {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1060px) {
		.team {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.split {
		display: grid;
		gap: 48px;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
			gap: 64px;
			align-items: start;
		}
	}

	.split__lede {
		margin-top: 20px;
		color: var(--muted);
	}

	.rules__item {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 16px;
		padding-block: 22px;
		border-top: 1px solid var(--rule);
	}

	.rules__item:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.rules__n {
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--faint);
		padding-top: 5px;
	}

	.rules__item p {
		color: var(--muted);
	}
</style>
