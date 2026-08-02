<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import PlanCard from '$lib/components/PlanCard.svelte';
	import Disclosure from '$lib/components/Disclosure.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import { plans, faqs } from '$lib/data/site';

	/* A row per thing people actually compare, not a row per feature we ship. */
	const matrix = [
		['Open floor access', true, true, true],
		['Coached classes', false, true, true],
		['Written programme', false, true, true],
		['Four-weekly review', false, true, true],
		['Women’s floor access', true, true, true],
		['Nutrition coaching', false, false, true],
		['Private sessions', false, false, '2 / month'],
		['Message your coach', false, false, true]
	] as const;

	const included = [
		{ icon: 'check' as const, title: 'No joining fee', body: 'You pay for the month you train and nothing else.' },
		{ icon: 'calendar' as const, title: 'Freeze for three months', body: 'For travel, injury or Ramadan, at no charge.' },
		{ icon: 'users' as const, title: 'Thirty days’ notice', body: 'Cancel any time with a month’s notice. No contract.' },
		{ icon: 'target' as const, title: 'First session free', body: 'Ninety minutes with a coach before you pay anything.' }
	];
</script>

<Seo
	title="Membership"
	description="Three memberships at Amala Lifestyle, Dhaka. Monthly, no joining fee, freeze for up to three months a year."
	image="/images/facility-racks.jpg"
/>

<PageHeader
	title="Monthly, with no joining fee"
	standfirst="Everything is monthly and everything can be paused. Pick the level of coaching you want, not a contract length — and change it whenever your year changes."
	image="/images/gym-floor.jpg"
	alt="The main training floor with racks and equipment"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		<Button href="/timetable" variant="ghost">See the timetable</Button>
	{/snippet}
</PageHeader>

<Section ruled={false}>
	<div class="plans">
		{#each plans as p (p.id)}
			<PlanCard {...p} />
		{/each}
	</div>
	<p class="t-label plans__note">
		Prices in Bangladeshi taka, per month, VAT included. Pay by bKash, Nagad, card or bank transfer.
	</p>
</Section>

<Section>
	<h2 class="t-h2">Compare memberships</h2>

	<div class="matrix__scroll">
		<table class="matrix">
			<caption class="t-label matrix__caption">What each membership includes</caption>
			<thead>
				<tr>
					<th scope="col" class="t-label">Included</th>
					{#each plans as p (p.id)}
						<th scope="col" class="t-label matrix__plan">{p.name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each matrix as [label, ...cells] (label)}
					<tr>
						<th scope="row" class="matrix__row-label">{label}</th>
						{#each cells as cell, i (i)}
							<td class="matrix__cell">
								{#if cell === true}
									<Icon name="check" size={17} />
									<span class="sr-only">Included</span>
								{:else if cell === false}
									<span class="matrix__no" aria-hidden="true">–</span>
									<span class="sr-only">Not included</span>
								{:else}
									<span class="t-num matrix__text">{cell}</span>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Section>

<Section>
	<div class="included">
		{#each included as item (item.title)}
			<div class="included__item">
				<Icon name={item.icon} size={20} />
				<h3 class="t-h3 included__title">{item.title}</h3>
				<p class="t-body included__body">{item.body}</p>
			</div>
		{/each}
	</div>
</Section>

<Section>
	<h2 class="t-h2">Testimonials</h2>
	<Testimonials />
</Section>

<Section>
	<h2 class="t-h2">FAQ</h2>
	<div class="faqs">
		{#each faqs.slice(4) as faq (faq.question)}
			<Disclosure {...faq} />
		{/each}
	</div>
</Section>

<NextUp />

<CtaBand
	title="Train once before you pay anything."
	body="The first session is ninety minutes with a coach, and there is no card details form at the end of it. Decide afterwards."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/coaches', text: 'Meet the coaches' }}
	image="/images/coaching-spot.jpg"
/>

<style>
	.plans__note {
		margin-top: 20px;
	}

	/* A wide table scrolls inside its own box; the page itself never scrolls
	   sideways. */
	.matrix__scroll {
		margin-top: 44px;
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
	}

	.matrix {
		width: 100%;
		min-width: 620px;
		border-collapse: collapse;
		text-align: left;
	}

	.matrix__caption {
		text-align: left;
		padding-bottom: 16px;
	}

	.matrix th,
	.matrix td {
		padding: 18px 16px;
		border-top: 1px solid var(--rule);
	}

	.matrix :is(th, td):first-child {
		padding-inline-start: 14px;
	}

	.matrix thead th {
		border-top: 0;
		padding-bottom: 14px;
	}

	.matrix tbody tr:last-child :is(th, td) {
		border-bottom: 1px solid var(--rule);
	}

	/* Reading across eight rows and three columns is where people lose their
	   place, so the hovered row takes the surface tone. */
	.matrix tbody tr {
		transition: background-color 160ms ease;
	}

	.matrix tbody tr:hover {
		background: var(--surface);
	}

	/* The recommended column is tinted for its whole height, matching the lime
	   edge on the plan card above it. */
	.matrix :is(th, td):nth-child(3) {
		background: color-mix(in srgb, var(--lime) 9%, transparent);
	}

	.matrix__plan {
		width: 18%;
	}

	.matrix__row-label {
		font-size: 16px;
		font-weight: 400;
	}

	.matrix__cell {
		color: var(--ink);
	}

	.matrix__no {
		color: var(--faint);
	}

	.matrix__text {
		font-size: 14px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.included {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 620px) {
		.included {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.included {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.included__item {
		background: var(--paper);
		padding: 30px 26px 34px;
	}

	.included__title {
		margin-top: 18px;
	}

	.included__body {
		margin-top: 10px;
		color: var(--muted);
	}

	.faqs {
		margin-top: 44px;
	}
</style>
