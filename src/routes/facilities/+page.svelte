<script lang="ts">
	import { image as img } from '$lib/images';
	import Seo from '$lib/components/Seo.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import { facilities, site } from '$lib/data/site';

	/*
		The gallery lives here rather than on a page of its own. Someone asking
		"what is it like inside" is already on this page — sending them to a
		separate menu item to see the same rooms was a click for nothing.
		`wide` marks the shots worth two columns.
	*/
	const groups = [
		{
			title: 'The training floor',
			shots: [
				{ image: '/images/gym-floor.jpg', alt: 'The main floor in daylight, racks along one wall', wide: true },
				{ image: '/images/facility-racks.jpg', alt: 'Squat racks set up and empty before a session' },
				{ image: '/images/hero-deadlift.jpg', alt: 'A loaded barbell being pulled from the floor' },
				{ image: '/images/equipment.jpg', alt: 'A kettlebell, medicine ball and rope on a box' },
				{ image: '/images/method-rack.jpg', alt: 'A rack loaded ready for a working set' }
			]
		},
		{
			title: 'Coaching in progress',
			shots: [
				{ image: '/images/coaching-spot.jpg', alt: 'A coach spotting a member through a lift', wide: true },
				{ image: '/images/class-strength.jpg', alt: 'A strength class working in pairs' },
				{ image: '/images/class-cycle.jpg', alt: 'A conditioning class on the bikes' },
				{ image: '/images/class-sprint.jpg', alt: 'A member mid-effort on the sled track' },
				{ image: '/images/studio.jpg', alt: 'The mobility studio, matted and quiet' }
			]
		},
		{
			title: 'The women’s floor',
			shots: [
				{ image: '/images/womens-gym.jpg', alt: 'The women’s floor, screened from the main gym', wide: true },
				{ image: '/images/womens-strength.jpg', alt: 'A member setting up for a squat' },
				{ image: '/images/womens-mobility.jpg', alt: 'A mobility drill held on a mat' }
			]
		}
	];
</script>

<Seo
	title="Facilities"
	description="Platforms, racks, ergs, a mobility room, two prayer rooms and a separate women's floor — the gym at Amala Lifestyle in Dhaka."
	image="/images/facility-racks.jpg"
/>

<PageHeader
	title="A floor, not a showroom"
	standfirst="Everything here earns its space. Platforms, racks, bars and enough room to use them properly — plus the things a gym in Dhaka actually needs, like prayer rooms and a generator."
	image="/images/facility-racks.jpg"
	alt="Squat racks and barbells set up across a bright training floor"
/>

<Section ruled={false}>
	<h2 class="t-h2">Equipment and facilities</h2>

	<ul class="kit">
		{#each facilities as f (f.name)}
			<li class="kit__item tile-hover">
				<span class="icon-badge"><Icon name={f.icon} size={30} /></span>
				<h3 class="t-h3 kit__name">{f.name}</h3>
				<p class="t-body kit__note">{f.note}</p>
			</li>
		{/each}
	</ul>
</Section>

{#each groups as group (group.title)}
	<Section id={group === groups[0] ? "gallery" : undefined}>
		<h2 class="t-h2">{group.title}</h2>
		<div class="grid">
			{#each group.shots as shot (shot.image)}
				<div class="media media--muted shot" class:shot--wide={shot.wide}>
					<enhanced:img
						src={img(shot.image)}
						alt={shot.alt}
						sizes="(min-width: 720px) 44vw, 100vw"
						loading="lazy"
					/>
				</div>
			{/each}
		</div>
	</Section>
{/each}

<Section>
	<div class="visit">
		<div>
			<h2 class="t-h2">Where to find us</h2>
			<address class="visit__address t-body-lg">
				{#each site.addressLines as line (line)}
					<span>{line}</span>
				{/each}
			</address>
			<p class="t-body visit__note">
				Walk in during opening hours and someone will show you round. The free assessment needs a
				slot booked in advance, because it takes ninety minutes of a coach's time.
			</p>
		</div>

		<dl class="hours">
			{#each site.hours as [days, time] (days)}
				<div class="hours__row">
					<dt class="t-body">{days}</dt>
					<dd class="t-num">{time}</dd>
				</div>
			{/each}
		</dl>
	</div>
</Section>

<NextUp />

<CtaBand
	title="Stand on the floor before you decide anything."
	body="No appointment needed to look around. Book one only if you want the free assessment that comes with it."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/membership', text: 'See pricing' }}
	image="/images/gym-floor.jpg"
/>

<style>
	.kit {
		display: grid;
		gap: 1px;
		margin-top: 56px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	@media (min-width: 620px) {
		.kit {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.kit {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.kit__item {
		padding: 28px 26px 32px;
	}

	.kit__name {
		margin-top: 18px;
	}

	.kit__note {
		margin-top: 8px;
		color: var(--muted);
	}

	.grid {
		display: grid;
		gap: 16px;
	}

	@media (min-width: 720px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		/* A wide shot leads each group, so the eye lands somewhere before it
		   starts working through the pairs. */
		.shot--wide {
			grid-column: 1 / -1;
		}
	}

	.shot {
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}

	.shot--wide {
		aspect-ratio: 16 / 9;
	}

	.shot :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.visit {
		display: grid;
		gap: 40px;
	}

	@media (min-width: 860px) {
		.visit {
			grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
			gap: 64px;
			align-items: start;
		}
	}

	.visit__address {
		display: grid;
		gap: 4px;
		margin-top: 20px;
		font-style: normal;
	}

	.visit__note {
		margin-top: 20px;
		color: var(--muted);
		max-width: 50ch;
	}

	.hours {
		display: grid;
		border-top: 1px solid var(--rule);
	}

	.hours__row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 24px;
		padding-block: 18px;
		border-bottom: 1px solid var(--rule);
	}
</style>
