<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { programmes } from '$lib/data/site';

	/* A week is a sequence, so the days are ordered and labelled. */
	const week = [
		['Mon', 'Strength', 'Lower body. Squat, hinge, carry.'],
		['Tue', 'Conditioning', 'Easy aerobic. Conversational the whole way through.'],
		['Wed', 'Rest', 'Walk, mobility, sleep.'],
		['Thu', 'Strength', 'Upper body. Press, pull, brace.'],
		['Fri', 'Conditioning', 'Intervals. Short, hard, fully recovered between.'],
		['Sat', 'Strength', 'Full body. Lighter, more technical.'],
		['Sun', 'Rest', 'Nothing. Properly nothing.']
	];
</script>

<Seo
	title="Training"
	description="Strength, conditioning, hybrid and recovery programmes in Dhaka. Twelve-week blocks, four people to a session, loads set for you."
	image="/images/gym-floor.jpg"
/>

<PageHeader
	title="Programmes that run long enough to work"
	standfirst="Four programmes, all built the same way: a small number of movements, repeated long enough that you get genuinely good at them, with weight going up in increments small enough that you barely notice."
	image="/images/gym-floor.jpg"
	alt="Racked dumbbells and equipment on the training floor"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		<Button href="/method" variant="ghost">How it works</Button>
	{/snippet}
</PageHeader>

{#each programmes as p, i (p.id)}
	<!-- No eyebrow: it repeated the heading sitting directly beneath it. -->
	<Section id={p.id}>
		<div class="programme" class:programme--flip={i % 2 === 1}>
			<div class="programme__text">
				<span class="icon-badge"><Icon name={p.icon} size={24} /></span>
				<h2 class="t-h2 programme__title">{p.name}</h2>
				<p class="t-body-lg programme__summary">{p.summary}</p>
				<p class="t-body programme__detail">{p.detail}</p>

				<dl class="facts">
					{#each p.facts as [term, value] (term)}
						<div class="facts__item">
							<dt class="t-label">{term}</dt>
							<dd class="facts__value">{value}</dd>
						</div>
					{/each}
				</dl>

				<p class="t-label programme__suits-label">Who it suits</p>
				<p class="t-body programme__detail">{p.suits}</p>
			</div>

			<div class="media media--card media--muted programme__media">
				<enhanced:img
					src={img(p.image)}
					alt={p.alt}
					sizes="(min-width: 980px) 46vw, 100vw"
					loading="lazy"
				/>
			</div>
		</div>
	</Section>
{/each}

<Section>
	<h2 class="t-h2">Weekly schedule</h2>
	<p class="t-body-lg section__lede">
		This is the hybrid programme at full tilt. Most people start on three days and add the fourth
		once the first three are never missed.
	</p>

	<ul class="week">
		{#each week as [day, kind, note] (day)}
			<li class="week__row" class:week__row--rest={kind === 'Rest'}>
				<span class="t-num week__day">{day}</span>
				<span class="t-h3 week__kind">{kind}</span>
				<span class="t-body week__note">{note}</span>
			</li>
		{/each}
	</ul>
</Section>

<NextUp />

<CtaBand
	title="Not sure which one you need?"
	body="That is exactly what the first session is for. Come in, move a bit, and we will tell you where to start — including if the honest answer is somewhere other than here."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/nutrition', text: 'Nutrition' }}
	image="/images/coaching-spot.jpg"
/>

<style>
	.programme {
		display: grid;
		gap: 40px;
	}

	@media (min-width: 980px) {
		.programme {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
			gap: 64px;
			align-items: start;
		}

		/* Alternating sides keeps four near-identical blocks from reading as a
		   list of the same thing four times. */
		.programme--flip .programme__text {
			order: 2;
		}

		.programme--flip .programme__media {
			order: 1;
		}
	}

	.programme__title {
		margin-top: 20px;
	}

	.programme__summary {
		margin-top: 16px;
	}

	.programme__detail {
		margin-top: 16px;
		color: var(--muted);
	}

	/* Spec blocks, not a table — the same treatment the home page figures use,
	   so a number means the same thing wherever it appears. */
	.facts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin-top: 40px;
	}

	@media (min-width: 620px) {
		.facts {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.facts__item {
		background: var(--paper);
		border: 1px solid var(--rule);
		padding: 18px 18px 22px;
	}

	.facts__value {
		display: block;
		margin-top: 12px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 20px;
		line-height: 1.15;
		letter-spacing: -0.022em;
		font-stretch: 92%;
		font-variant-numeric: tabular-nums;
	}

	.programme__suits-label {
		margin-top: 36px;
	}

	.section__lede {
		margin-top: 20px;
		color: var(--muted);
	}

	.week {
		margin-top: 48px;
	}

	.week__row {
		display: grid;
		gap: 4px 24px;
		padding-block: 22px;
		border-top: 1px solid var(--rule);
	}

	.week__row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	@media (min-width: 760px) {
		.week__row {
			grid-template-columns: 72px minmax(0, 4fr) minmax(0, 7fr);
			align-items: baseline;
		}
	}

	.week__day {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.week__note {
		color: var(--muted);
	}

	/* Rest days are pulled back by weight alone, at full ink. A lighter colour
	   would read as disabled rather than as quieter. */
	.week__row--rest .week__kind {
		font-weight: 400;
	}
</style>
