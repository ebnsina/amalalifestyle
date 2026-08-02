<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { nutritionPrinciples, sampleDay } from '$lib/data/site';

	const notDoing = [
		'Detoxes, cleanses and juice weeks',
		'Meal replacements you have to keep buying',
		'Cutting a whole food group to make the plan look decisive',
		'Weighing every meal forever',
		'Before-and-after photos'
	];
</script>

<Seo
	title="Nutrition"
	description="Nutrition coaching built on protein, fibre and carbohydrate placed around training. No banned foods and nothing to buy from us."
	image="/images/nutrition-bowl.jpg"
/>

<PageHeader
	eyebrow="Nutrition"
	title="Food that fits the life you already have"
	standfirst="Nutrition coaching runs alongside your training rather than replacing it. We change one habit at a time and leave the rest of your week intact, because a plan you have to escape from at the weekend was never really a plan."
	image="/images/nutrition-bowl.jpg"
	alt="A bowl of vegetables, chickpeas and avocado"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		<Button href="/training" variant="ghost">Training</Button>
	{/snippet}
</PageHeader>

<Section label="Principles">
	<h2 class="t-h2" style="max-width: 19ch">Four rules. <em>That is the whole system.</em></h2>
	<p class="t-body-lg section__lede">
		Deliberately not numbered — they all run at the same time, and none of them is a step towards
		the next one.
	</p>

	<ul class="principles">
		{#each nutritionPrinciples as p (p.title)}
			<li class="principles__item">
				<Icon name={p.icon} size={20} />
				<h3 class="t-h3 principles__title">{p.title}</h3>
				<p class="t-body principles__body">{p.body}</p>
			</li>
		{/each}
	</ul>
</Section>

<Section label="A sample day">
	<div class="split">
		<div>
			<h2 class="t-h2" style="max-width: 15ch">A day that is not impressive.</h2>
			<p class="t-body-lg section__lede">
				Ordinary food, in an order that puts fuel near the training that needs it. Your own version
				will look different — this is the shape, not the menu. The protein figures are an example
				for one person at one bodyweight, not a target for you.
			</p>

			<div class="media media--wide media--muted day__photo">
				<img
					src="/images/nutrition-prep.jpg"
					alt="Vegetables, eggs and a knife on a wooden chopping board"
					width="900"
					height="506"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>

		<div class="day__scroll">
			<table class="day">
				<caption class="t-label day__caption">Example training day</caption>
			<thead>
				<tr>
					<th scope="col" class="t-label">Time</th>
					<th scope="col" class="t-label">Meal</th>
					<th scope="col" class="t-label">What</th>
					<th scope="col" class="t-label day__num">Protein</th>
				</tr>
			</thead>
			<tbody>
				{#each sampleDay as [time, meal, what, protein] (time)}
					<tr>
						<td class="t-num day__time">{time}</td>
						<td class="day__meal">{meal}</td>
						<td class="day__what">{what}</td>
						<td class="t-num day__num">{protein}</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
	</div>
</Section>

<Section label="What we don't do">
	<div class="split split--tight">
		<div>
			<h2 class="t-h2" style="max-width: 13ch">
				The list of things we <em>will not</em> sell you.
			</h2>
			<p class="t-body-lg section__lede">
				Most of the nutrition industry makes its money on the parts that do not work. Here is what
				is not on offer.
			</p>
		</div>

		<ul class="nope">
			{#each notDoing as item (item)}
				<li class="nope__item">
					<Icon name="close" size={15} />
					<span class="t-body">{item}</span>
				</li>
			{/each}
		</ul>
	</div>
</Section>

<Section label="Care">
	<div class="split">
		<blockquote class="statement">
			<p class="t-h2" style="max-width: 22ch">
				If your goals need medical input, we will
				<span class="mark">say so and stop</span>.
			</p>
			<p class="t-body-lg section__lede">
				We coach nutrition for general health and training. We do not treat eating disorders,
				diabetes, or anything else that belongs with a registered dietitian or your GP. If that is
				where you are, we will say so at the first session and help you find the right person.
			</p>
		</blockquote>

		<div class="media media--card media--muted">
			<img
				src="/images/nutrition-spread.jpg"
				alt="A spread of fresh vegetables, fruit and pulses in trays"
				width="900"
				height="675"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
</Section>

<CtaBand
	label="Next step"
	title="Bring one week of honest food notes."
	body="Nothing to buy and nothing to prepare. Write down what you actually ate for seven days and we will have something genuinely useful to work with on day one."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/method', text: 'The method' }}
	image="/images/nutrition-plate.jpg"
/>

<style>
	.section__lede {
		margin-top: 20px;
		color: var(--muted);
	}

	.principles {
		display: grid;
		gap: 1px;
		background: var(--rule);
		margin-top: 48px;
	}

	@media (min-width: 560px) {
		.principles {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.principles__item {
		background: var(--paper);
		padding: 32px 30px 36px;
		color: var(--muted);
	}

	.principles__title {
		margin-top: 20px;
		color: var(--ink);
	}

	.principles__body {
		margin-top: 10px;
	}

	.split {
		display: grid;
		gap: 48px;
	}

	.split > * {
		min-width: 0;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
			gap: 64px;
			align-items: start;
		}

		.split--tight {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
	}

	.day__photo {
		margin-top: 40px;
	}

	/* Grid children default to min-width:auto, so a nowrap table would stretch
	   its column past the viewport instead of scrolling inside it. */
	.day__scroll {
		min-width: 0;
		overflow-x: auto;
	}

	.day {
		width: 100%;
		min-width: 420px;
		border-collapse: collapse;
		text-align: left;
	}

	.day__caption {
		text-align: left;
		padding-bottom: 16px;
	}

	.day th,
	.day td {
		padding: 18px 12px;
		border-top: 1px solid var(--rule);
		vertical-align: baseline;
	}

	.day :is(th, td):first-child {
		padding-inline-start: 14px;
	}

	.day :is(th, td):last-child {
		padding-inline-end: 14px;
	}

	.day tbody tr:last-child td {
		border-bottom: 1px solid var(--rule);
	}

	.day th {
		padding-bottom: 12px;
		border-top: 0;
	}

	/* The row you are reading lifts onto the surface tone. Nothing moves and no
	   rule is added — a plain background change is enough to track a row. */
	.day tbody tr {
		transition: background-color 160ms ease;
	}

	.day tbody tr:hover {
		background: var(--surface);
	}

	.day__time {
		font-size: 13px;
		color: var(--faint);
	}

	.day__meal {
		font-size: 16px;
		font-weight: 500;
		white-space: nowrap;
	}

	.day__what {
		font-size: 16px;
		color: var(--muted);
	}

	/* Figures line up in a column, so they are tabular and right-aligned. */
	.day__num {
		font-size: 14px;
		text-align: right;
		white-space: nowrap;
	}

	.nope__item {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding-block: 20px;
		border-top: 1px solid var(--rule);
		color: var(--muted);
	}

	.nope__item:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.statement {
		max-width: var(--measure);
	}
</style>
