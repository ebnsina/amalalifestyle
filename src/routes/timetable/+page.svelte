<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import ClassCard from '$lib/components/ClassCard.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import SessionSlot from '$lib/components/SessionSlot.svelte';
	import { classes, timetable } from '$lib/data/site';

	let filter = $state<'all' | 'women'>('all');

	const days = $derived(
		timetable.map((d) => ({
			...d,
			sessions: filter === 'women' ? d.sessions.filter((s) => s.women) : d.sessions
		}))
	);
</script>

<Seo
	title="Timetable"
	description="The full weekly class timetable at Amala Lifestyle, Dhaka — including women-only sessions on the separate floor."
	image="/images/studio.jpg"
/>

<PageHeader
	title="Every session is coached and capped"
	standfirst="Every class is capped and coached. Spaces open fourteen days ahead and you book from your phone — no queueing at reception, and no session runs without a coach on the floor."
	image="/images/studio.jpg"
	alt="The training floor set up before a session"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		<Button href="/membership" variant="ghost">See prices</Button>
	{/snippet}
</PageHeader>

<Section>
	<div class="head">
		<div>
			<h2 class="t-h2">Weekly timetable</h2>
			<p class="t-body-lg head__lede">
				Times are fixed through the year apart from Ramadan, when the whole timetable moves and we
				publish it two weeks ahead.
			</p>
		</div>

		<div class="filter" role="group" aria-label="Filter sessions">
			<button
				type="button"
				class="filter__btn t-label-sm"
				class:is-on={filter === 'all'}
				aria-pressed={filter === 'all'}
				onclick={() => (filter = 'all')}
			>
				All sessions
			</button>
			<button
				type="button"
				class="filter__btn t-label-sm"
				class:is-on={filter === 'women'}
				aria-pressed={filter === 'women'}
				onclick={() => (filter = 'women')}
			>
				Women only
			</button>
		</div>
	</div>

	<div class="grid">
		{#each days as day (day.day)}
			<section class="day">
				<h3 class="day__name t-label-sm">{day.day}</h3>

				{#if day.note}
					<p class="day__note t-label">{day.note}</p>
				{/if}

				{#if day.sessions.length === 0}
					<p class="day__empty t-body">
						{filter === 'women' ? 'No women-only sessions.' : 'No classes.'}
					</p>
				{:else}
					<ul>
						{#each day.sessions as s (s.time + s.name)}
							<li><SessionSlot {...s} /></li>
						{/each}
					</ul>
				{/if}
			</section>
		{/each}
	</div>

	<p class="legend t-label">
		<span class="chip" aria-hidden="true">Women only</span>
		sessions run on the separate floor
	</p>
</Section>

<Section>
	<h2 class="t-h2">The classes</h2>
	<p class="t-body-lg head__lede">
		Four classes, repeated all week, so you can build a routine instead of chasing a different
		workout every day.
	</p>

	<div class="cards">
		{#each classes as c (c.id)}
			<ClassCard {...c} />
		{/each}
	</div>
</Section>

<Section>
	<div class="notes">
		<div class="notes__item">
			<Icon name="clock" size={20} />
			<h3 class="t-h3 notes__title">Arrive ten minutes early</h3>
			<p class="t-body notes__body">
				Warm-ups start on the minute. If you are new, come twenty minutes early and someone will
				walk you round first.
			</p>
		</div>
		<div class="notes__item">
			<Icon name="users" size={20} />
			<h3 class="t-h3 notes__title">Cancel by midnight</h3>
			<p class="t-body notes__body">
				Classes are capped, so a no-show costs somebody else a space. Cancel before midnight and it
				does not count against you.
			</p>
		</div>
		<div class="notes__item">
			<Icon name="target" size={20} />
			<h3 class="t-h3 notes__title">Bring nothing special</h3>
			<p class="t-body notes__body">
				Trainers you can stand flat in, clothes you can move in, and a water bottle. Towels and
				chalk are here.
			</p>
		</div>
	</div>
</Section>

<NextUp />

<CtaBand
	title="Try any class on the timetable, free."
	body="Pick a session that fits your week and come to it as a guest. No card details, no tour you have to sit through afterwards."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/womens', text: 'Women’s floor' }}
	image="/images/facility-racks.jpg"
/>

<style>
	.head {
		display: grid;
		gap: 24px;
	}

	@media (min-width: 900px) {
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

	.filter {
		display: flex;
		gap: 8px;
	}

	.filter__btn {
		height: 44px;
		padding-inline: 18px;
		border: 1px solid var(--rule-strong);
		background: transparent;
		color: var(--muted);
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	.filter__btn:hover {
		border-color: var(--ink);
		color: var(--ink);
	}

	/* Lime fill marks the active filter — the state is in the fill, never in
	   the colour of the label itself. */
	.filter__btn.is-on {
		background: var(--lime);
		border-color: var(--lime);
		color: #0b0b0d;
	}

	/* Seven days never fill a four- or two-column row, so borders sit on each
	   cell — a gap-fill would render the empty eighth cell as a grey hole. */
	.grid {
		display: grid;
		margin-top: 48px;
		border-top: 1px solid var(--rule);
		border-left: 1px solid var(--rule);
	}

	@media (min-width: 700px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.day {
		background: var(--paper);
		padding: 26px 24px 30px;
		border-right: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}

	.day__name {
		color: var(--ink);
	}

	.day__note {
		margin-top: 10px;
	}

	.day__empty {
		margin-top: 20px;
		color: var(--faint);
	}

	.day ul {
		margin-top: 18px;
	}


	.legend {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 20px;
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

	@media (min-width: 1040px) {
		.cards {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.notes {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 820px) {
		.notes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.notes__item {
		background: var(--paper);
		padding: 30px 28px 34px;
	}

	.notes__title {
		margin-top: 18px;
	}

	.notes__body {
		margin-top: 10px;
		color: var(--muted);
	}
</style>
