<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import CoachCard from '$lib/components/CoachCard.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import SessionSlot from '$lib/components/SessionSlot.svelte';
	import { coaches, timetable, womensFloor } from '$lib/data/site';

	const amina = coaches.find((c) => c.id === 'amina')!;

	/* Only the women-only slots, in week order, days with none dropped. */
	const schedule = timetable
		.map((d) => ({ day: d.day, sessions: d.sessions.filter((s) => s.women) }))
		.filter((d) => d.sessions.length > 0);
</script>

<Seo
	title="Women’s floor"
	description="A separate women-only training floor in Banani, Dhaka. Own entrance, own hours, women coaches, prayer room and no photography."
	image="/images/womens-gym.jpg"
/>

<PageHeader
	eyebrow="Women’s floor"
	title="A room of your own to get strong in"
	standfirst="A separate floor with its own entrance and its own hours, coached only by women. The programme is not a lighter version of the main floor — it is the same lifts, the same progression and the same expectations."
	image="/images/womens-gym.jpg"
	alt="A woman in hijab stretching through a warm-up on the women’s floor"
>
	{#snippet actions()}
		<Button href="/contact" variant="solid" arrow>Book a free session</Button>
		<Button href="#hours" variant="ghost">Women’s hours</Button>
	{/snippet}
</PageHeader>

<Section label="How it works" ruled={false}>
	<h2 class="t-h2">What we will not compromise on.</h2>

	<ul class="points">
		{#each womensFloor.points as p (p.title)}
			<li class="points__item">
				<Icon name={p.icon} size={20} />
				<h3 class="t-h3 points__title">{p.title}</h3>
				<p class="t-body points__body">{p.body}</p>
			</li>
		{/each}
	</ul>
</Section>

<Section label="Hours" id="hours">
	<div class="split">
		<div>
			<h2 class="t-h2">When the floor is yours.</h2>
			<p class="t-body-lg split__lede">
				During these hours no men are in the room — coaches, staff or members. Outside them the
				space is used for one-to-one sessions by arrangement.
			</p>

			<dl class="hours">
				{#each womensFloor.hours as [days, time] (days)}
					<div class="hours__row">
						<dt>{days}</dt>
						<dd class="t-num">{time}</dd>
					</div>
				{/each}
			</dl>

			<p class="t-body split__note">
				Members on any plan can use the women’s floor. If these hours do not fit your week, ask —
				we have added slots before when enough people needed them.
			</p>
		</div>

		<div class="media media--card media--muted">
			<img
				src="/images/womens-mobility.jpg"
				alt="A woman in hijab holding a deep squat during a mobility session"
				width="1000"
				height="750"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
</Section>

<Section label="Sessions">
	<h2 class="t-h2">Women-only classes, every day but Friday.</h2>

	<div class="schedule">
		{#each schedule as day (day.day)}
			<div class="schedule__day">
				<h3 class="t-label-sm schedule__name">{day.day}</h3>
				<ul>
					{#each day.sessions as s (s.time + s.name)}
						<li class="slot">
							<span class="t-num slot__time">{s.time}</span>
							<span class="slot__name">{s.name.replace(' — women only', '')}</span>
							<span class="t-label slot__meta">{s.coach} · <span class="t-num">{s.length}</span></span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="section__cta">
		<Button href="/timetable" variant="ghost" arrow>Full timetable</Button>
	</div>
</Section>

<Section label="Your coach">
	<div class="split split--coach">
		<div class="coach-wrap">
			<CoachCard {...amina} />
		</div>
		<div>
			<h2 class="t-h2">One coach, who knows your programme.</h2>
			<p class="t-body-lg split__lede">
				You are not handed to whoever is free. Amina writes the programme, coaches the sessions and
				runs the four-weekly review, so nobody has to be brought up to speed on your knee, your
				schedule or what you are working towards.
			</p>

			<ul class="ticks">
				<li><Icon name="check" size={17} /> Strength programming for complete beginners</li>
				<li><Icon name="check" size={17} /> Returning to training after having a baby</li>
				<li><Icon name="check" size={17} /> Working around a long-standing injury</li>
				<li><Icon name="check" size={17} /> Training through Ramadan without losing ground</li>
			</ul>

			<div class="section__cta">
				<Button href="/contact" variant="ghost" arrow>Ask Amina a question</Button>
			</div>
		</div>
	</div>
</Section>

<Section label="Strength">
	<div class="split">
		<blockquote class="statement">
			<p class="t-h2" style="max-width: 21ch">
				The programme is not softer. It is <span class="mark">the same one</span>.
			</p>
			<p class="t-body-lg split__lede">
				Squat, hinge, press, pull, carry — with weight going up week to week the way it does on any
				other floor in the building. Nobody here will hand you a pink dumbbell and call it a
				programme.
			</p>
		</blockquote>

		<div class="media media--card media--muted">
			<img
				src="/images/womens-strength.jpg"
				alt="A woman in hijab holding dumbbells during a strength session"
				width="900"
				height="675"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
</Section>

<CtaBand
	label="Start here"
	title="Come and see the floor before you decide."
	body="Visit during women’s hours, meet Amina, and try a session. Nothing to sign and no card details taken."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/membership', text: 'Membership' }}
	image="/images/womens-gym.jpg"
/>

<style>
	.points {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		margin-top: 48px;
	}

	@media (min-width: 620px) {
		.points {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.points {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.points__item {
		background: var(--paper);
		padding: 32px 28px 36px;
	}

	.points__title {
		margin-top: 20px;
	}

	.points__body {
		margin-top: 10px;
		color: var(--muted);
	}

	.split {
		display: grid;
		gap: 48px;
	}

	@media (min-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 64px;
			align-items: center;
		}

		.split--coach {
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
			align-items: start;
		}
	}

	.split__lede {
		margin-top: 20px;
		color: var(--muted);
	}

	.split__note {
		margin-top: 28px;
		color: var(--faint);
	}

	.hours {
		display: grid;
		gap: 1px;
		margin-top: 32px;
		background: var(--rule);
		border: 1px solid var(--rule);
		max-width: 34ch;
	}

	.hours__row {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		background: var(--paper);
		padding-block: 16px;
		font-size: 16px;
	}

	.schedule {
		display: grid;
		gap: 1px;
		margin-top: 48px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 700px) {
		.schedule {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.schedule {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	.schedule__day {
		background: var(--paper);
		padding: 24px 20px 28px;
	}

	.schedule__name {
		color: var(--ink);
	}

	.schedule__day ul {
		margin-top: 18px;
	}


	.coach-wrap {
		max-width: 420px;
	}

	.ticks {
		margin-top: 28px;
		display: grid;
	}

	.ticks li {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding-block: 14px;
		border-top: 1px solid var(--rule);
		color: var(--muted);
		font-size: 16px;
	}

	.ticks li:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.section__cta {
		margin-top: 36px;
	}

	.statement {
		max-width: var(--measure);
	}
</style>
