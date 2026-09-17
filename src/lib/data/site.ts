import type { IconName } from '$lib/icons';

export const site = {
	name: 'Amala Lifestyle',
	tagline: 'Strength, food and recovery, coached properly.',
	email: 'hello@amalalifestyle.com',
	phone: '+880 1712 345 678',
	whatsapp: '+880 1712 345 678',
	addressLines: ['House 42, Road 11, Banani', 'Dhaka 1213, Bangladesh'],
	/** Bangladesh works Sunday to Thursday; Friday is the main day off. */
	hours: [
		['Sun–Thu', '06:00 – 22:00'],
		['Saturday', '08:00 – 20:00'],
		['Friday', '16:00 – 21:00']
	],
	currency: '৳'
};

export const socials: { label: string; href: string; icon: IconName }[] = [
	{ label: 'Facebook', href: 'https://facebook.com/amalalifestyle', icon: 'facebook' },
	{ label: 'Instagram', href: 'https://instagram.com/amalalifestyle', icon: 'instagram' },
	{ label: 'YouTube', href: 'https://youtube.com/@amalalifestyle', icon: 'youtube' },
	{ label: 'WhatsApp', href: 'https://wa.me/8801712345678', icon: 'whatsapp' }
];

/*
	Three doors onto thirteen pages.

	The bar had seven top-level items and it was the busiest thing on a page
	whose whole brief is to feel like fresh air. Seven labels is not a menu a
	first-time visitor reads — it is a menu they scan and give up on, and five of
	the seven were answering questions nobody has before they have decided
	whether to come in at all.

	So the bar now asks the three questions somebody actually has, in order:
	what would I do here, what does it cost, and how do I get in touch. The two
	that lead somewhere deeper carry `under`, and every page that used to have
	its own slot is inside one of those panels.

	`/about`, `/method`, `/journal`, `/success-stories`, `/nutrition` and `/app`
	are reachable from the footer — which is a directory, not a second nav — and
	from in-page links. That is a deliberate cost: they are pages you read once
	you are interested, not pages that help you decide to be.

	Each item carries a line saying what is behind it. A label alone asks the
	visitor to already know what "Training" means here.
*/
export type NavItem = {
	href: string;
	label: string;
	blurb: string;
	under?: { href: string; label: string; blurb: string }[];
};

export const nav: NavItem[] = [
	{
		href: '/training',
		label: 'Training',
		blurb: 'What you would actually do here',
		under: [
			{
				href: '/training',
				label: 'What you train',
				blurb: 'Lifting, fitness, food and rest'
			},
			{ href: '/timetable', label: 'Weekly timetable', blurb: 'Every class, and when it runs' },
			{ href: '/coaches', label: 'The coaches', blurb: 'The people who would coach you' },
			{ href: '/facilities', label: 'The gym itself', blurb: 'The floor, the rooms, photographs' },
			{
				href: '/womens',
				label: 'Women’s floor',
				blurb: 'Own door, own hours, women coaches'
			}
		]
	},
	{
		href: '/#pricing',
		label: 'Pricing',
		blurb: 'What it costs to train here',
		under: [
			{ href: '/#pricing', label: 'Plans and prices', blurb: 'Three plans, monthly, no joining fee' },
			{
				href: '/membership',
				label: 'Compare line by line',
				blurb: 'Every plan against every feature'
			},
			{
				href: '/#faq',
				label: 'Common questions',
				blurb: 'Cancelling, pausing, injuries, shift work'
			}
		]
	},
	{ href: '/contact', label: 'Contact', blurb: 'Book your free first session' }
];

/*
	Where a path sits in the menu above, read off the same data the bar and the
	flyouts use so the two can never disagree.

	Every H1 on the site is a slogan — "A floor, not a showroom", "Pick a tool",
	"A room of your own to get strong in". They are good headlines and none of
	them tells you which page you are on, which is fine when you arrived through
	the menu and useless when you arrived from the footer or a search result.
	The trail supplies the plain name the headline is too good to be.
*/
export function trailFor(pathname: string): { href?: string; label: string }[] {
	const hit = (href: string) =>
		!href.includes('#') && (href === '/' ? pathname === '/' : pathname.startsWith(href));

	for (const item of nav) {
		const child = item.under?.find((c) => hit(c.href));

		// A section's own page is its first child. Naming it twice — "About us /
		// Our story" — is a trail that says nothing the label did not.
		if (child && child.href !== item.href) {
			return [{ href: item.href, label: item.label }, { label: child.label }];
		}
		if (child || hit(item.href)) return [{ label: item.label }];
	}
	return [];
}

/*
	The footer is a directory, not a second nav — so it groups by the question
	being asked rather than repeating the bar in order. It is also the only
	place the deeper pages (timetable, nutrition, women's floor, calculators)
	are guaranteed to appear.
*/
export const footerNav = [
	{
		title: 'Find your way in',
		links: [
			{ href: '/about', label: 'About us' },
			{ href: '/method', label: 'How coaching works' },
			{ href: '/training', label: 'Programmes' },
			{ href: '/nutrition', label: 'Nutrition' }
		]
	},
	{
		title: 'Practical things',
		links: [
			{ href: '/#pricing', label: 'Pricing' },
			{ href: '/membership', label: 'Compare plans' },
			{ href: '/timetable', label: 'Timetable' },
			{ href: '/#faq', label: 'Common questions' }
		]
	},
	{
		title: 'Have a look around',
		links: [
			{ href: '/facilities', label: 'Facilities and photos' },
			{ href: '/coaches', label: 'Meet the team' },
			{ href: '/success-stories', label: 'Success stories' },
			{ href: '/womens', label: "Women's floor" },
			{ href: '/journal', label: 'Blog' },
			{ href: '/app', label: 'Free calculators' }
		]
	}
];

/*
	What to read after each page.

	Every page ended on the same dark band asking for a booking, with one
	secondary link beside it. That is the right ending for someone who has
	decided and a dead end for everyone else, so each page now also names two or
	three places to go on — picked for the question a reader of *that* page is
	most likely to have next, not by relatedness in the abstract.

	/contact is deliberately absent: it is where the paths end, and offering an
	exit next to a form you want filled in is an odd thing to do.
*/
type NextStep = { href: string; label: string; blurb: string; cta: string };

const step = {
	method: {
		href: '/method',
		label: 'How coaching works',
		blurb: 'Assess, plan, coach, review — and what happens in each of them.',
		cta: 'Read the method'
	},
	training: {
		href: '/training',
		label: 'The programmes',
		blurb: 'Strength, conditioning, nutrition and recovery, in twelve-week blocks.',
		cta: 'See the programmes'
	},
	timetable: {
		href: '/timetable',
		label: 'Weekly timetable',
		blurb: 'Every class we run, when it runs, and how many people are in it.',
		cta: 'See the timetable'
	},
	nutrition: {
		href: '/nutrition',
		label: 'Nutrition coaching',
		blurb: 'One habit at a time, built around the food you already eat.',
		cta: 'Read about food'
	},
	pricing: {
		href: '/#pricing',
		label: 'What it costs',
		blurb: 'Three plans, monthly, no joining fee and no contract length.',
		cta: 'See the prices'
	},
	faq: {
		href: '/#faq',
		label: 'Common questions',
		blurb: 'Cancelling, freezing, injuries, shift work and the rest of it.',
		cta: 'Read the questions'
	},
	coaches: {
		href: '/coaches',
		label: 'The coaches',
		blurb: 'Who they are, what each of them owns, and who you would work with.',
		cta: 'Meet them'
	},
	facilities: {
		href: '/facilities',
		label: 'The facilities',
		blurb: 'The floor, the rooms and the photographs, before you visit.',
		cta: 'Look around'
	},
	stories: {
		href: '/success-stories',
		label: 'Success stories',
		blurb: 'What members say, and an honest note on what training cannot fix.',
		cta: 'Read them'
	},
	womens: {
		href: '/womens',
		label: 'Women’s floor',
		blurb: 'A separate floor with its own entrance, hours and women coaches.',
		cta: 'See the floor'
	},
	tools: {
		href: '/app',
		label: 'Free calculators',
		blurb: 'Calories, macros and one-rep max, worked out in your browser.',
		cta: 'Open the tools'
	},
	journal: {
		href: '/journal',
		label: 'The blog',
		blurb: 'Written by the coaches, about the things members actually ask.',
		cta: 'Start reading'
	}
} satisfies Record<string, NextStep>;

export const nextUp: Record<string, NextStep[]> = {
	'/about': [step.method, step.coaches, step.pricing],
	'/method': [step.training, step.timetable, step.coaches],
	'/training': [step.timetable, step.nutrition, step.pricing],
	'/nutrition': [step.tools, step.training, step.pricing],
	'/timetable': [step.facilities, step.womens, step.pricing],
	'/womens': [step.timetable, step.coaches, step.pricing],
	'/facilities': [step.timetable, step.coaches, step.pricing],
	'/coaches': [step.method, step.stories, step.training],
	'/membership': [step.training, step.method, step.faq],
	'/success-stories': [step.method, step.training, step.pricing],
	'/app': [step.nutrition, step.training, step.journal],
	'/journal': [step.nutrition, step.method, step.training]
};

/*
	The home page is a story in four pictures, and then the price.

	It used to be six sections of cards and lists. Someone who does not spend
	their day on websites does not read a grid of four tiles as four choices —
	they read it as a wall of text and leave. So the page now walks through what
	actually happens to you, one big photograph and one short sentence at a
	time, in the order it happens in.

	Everything else the site can say has its own page. This one says four things.
*/

/** Four beats. Each one is a photograph, a heading and two sentences. */
export const homeStory: {
	n: string;
	title: string;
	body: string;
	image: string;
	alt: string;
}[] = [
	{
		n: '1',
		title: 'You come in and try it',
		body: 'The first session costs nothing and you sign nothing. We watch how you move, and we tell you straight whether this is the right place for you.',
		image: '/images/gym-floor.jpg',
		alt: 'The main gym floor with racks and platforms'
	},
	{
		n: '2',
		title: 'A coach shows you what to do',
		body: 'You never stand around wondering. Four people in a class, so somebody is watching you lift every single time.',
		image: '/images/coaching-spot.jpg',
		alt: 'A coach spotting a lifter through a set'
	},
	{
		n: '3',
		title: 'You get a plan on one page',
		body: 'What to lift. What to eat. Short enough to read on the way home, and yours, not somebody else’s.',
		image: '/images/method-rack.jpg',
		alt: 'A loaded barbell resting in a squat rack'
	},
	{
		n: '4',
		title: 'You get stronger',
		body: 'Every month we sit down and look at how it went. Then we change one thing. Never five things at once.',
		image: '/images/prog-strength.jpg',
		alt: 'Weight plates being loaded onto a barbell'
	}
];

/*
	Five questions, not eleven. The full set still lives on the pages that own
	them; these are the five that stop a first-timer booking, and a list long
	enough to scroll past is a list nobody opens.
*/
export const homeFaqQuestions = [
	'I have never lifted weights. Is that a problem?',
	'Do I have to sign a contract?',
	'How fast will I see a change?',
	'What if I am injured?',
	'Is there somewhere to pray?'
];

/** Not numbered: these run alongside each other, not in sequence. */
export const disciplines: {
	href: string;
	image: string;
	alt: string;
	name: string;
	summary: string;
	meta: string;
}[] = [
	{
		href: '/training#strength',
		image: '/images/prog-strength.jpg',
		alt: 'A lifter setting up under a loaded barbell in a squat rack',
		name: 'Strength',
		summary: 'Lift weights. Push, pull, squat, carry. A little heavier each week.',
		meta: '3 days a week'
	},
	{
		href: '/training#conditioning',
		image: '/images/prog-conditioning.jpg',
		alt: 'Someone mid-effort on a rower during a conditioning piece',
		name: 'Conditioning',
		summary: 'Get fit enough that stairs stop being hard work.',
		meta: '2 days a week'
	},
	{
		href: '/nutrition',
		image: '/images/nutrition-bowl.jpg',
		alt: 'A bowl of rice, vegetables and grilled protein on a kitchen counter',
		name: 'Food',
		summary: 'Eat the food you already eat. We help with how much.',
		meta: 'Every day'
	},
	{
		href: '/training#recovery',
		image: '/images/prog-recovery.jpg',
		alt: 'A mobility drill being held on a mat at the end of a session',
		name: 'Rest',
		summary: 'Sleep, stretching, and what to do on the days off.',
		meta: 'Every day'
	}
];

/** Numbered: the order is the point. */
export const method = [
	{
		n: '01',
		title: 'Assessment',
		body: 'Ninety minutes. We look at how you move, what you can lift today, how you sleep, and what a normal week of food actually looks like.'
	},
	{
		n: '02',
		title: 'The plan',
		body: 'One page. What you train, what you eat, and — the part most plans skip — what you stop doing.'
	},
	{
		n: '03',
		title: 'Coaching',
		body: 'Sessions on the floor with your form watched and your loads set for you. Between sessions, the week is written out.'
	},
	{
		n: '04',
		title: 'Review',
		body: 'Every four weeks we read the numbers together and change one thing. Never five things at once.'
	}
];

export const programmes = [
	{
		id: 'strength',
		icon: 'dumbbell' as IconName,
		name: 'Barbell Strength',
		image: '/images/prog-strength.jpg',
		alt: 'Weight plates being loaded onto a barbell on a gym floor',
		summary: 'The base everything else sits on. Five lifts, run in twelve-week blocks.',
		detail:
			'You learn the squat, deadlift, press, bench and row properly, then repeat them long enough to get strong at them. Weight goes up in the smallest useful increment, which is exactly why it keeps going up.',
		facts: [
			['Block', '12 weeks'],
			['Sessions', '3 per week'],
			['Length', '60 min'],
			['Group', '1–4 people']
		],
		suits: 'New lifters, and anyone who has trained for years without adding weight to the bar.'
	},
	{
		id: 'conditioning',
		icon: 'pulse' as IconName,
		name: 'Conditioning',
		image: '/images/prog-conditioning.jpg',
		alt: 'Battle ropes mid-wave in a training space',
		summary: 'Aerobic base first, hard intervals second. In that order.',
		detail:
			'Most people train conditioning too hard, too often, and stall. We build an easy aerobic base you can hold a conversation through, then layer the sharp work on top of it.',
		facts: [
			['Block', '8 weeks'],
			['Sessions', '2 per week'],
			['Length', '40 min'],
			['Group', '1–6 people']
		],
		suits: 'Anyone who gets out of breath before they get tired.'
	},
	{
		id: 'hybrid',
		icon: 'flame' as IconName,
		name: 'Strength & Conditioning',
		image: '/images/prog-hybrid.jpg',
		alt: 'A small group training with medicine balls',
		summary: 'Both, sequenced so they stop fighting each other.',
		detail:
			'Lifting and conditioning interfere when you stack them badly. This programme puts them in an order that lets you keep the strength you have built while your engine grows.',
		facts: [
			['Block', '12 weeks'],
			['Sessions', '4 per week'],
			['Length', '55 min'],
			['Group', '1–4 people']
		],
		suits: 'People with an event in the diary, and people who just want to be good at both.'
	},
	{
		id: 'recovery',
		icon: 'moon' as IconName,
		name: 'Recovery & Mobility',
		image: '/images/prog-recovery.jpg',
		alt: 'A lone runner on an open hillside path',
		summary: 'The work that happens on the days you are not lifting.',
		detail:
			'Range of motion where you actually need it, sleep you can rely on, and a short routine for the days between sessions. It is the least exciting part of the plan and usually the part that changes the most.',
		facts: [
			['Block', 'Ongoing'],
			['Sessions', '1 per week'],
			['Length', '30 min'],
			['Group', '1–8 people']
		],
		suits: 'Desk workers, anyone coming back from a niggle, anyone sleeping badly.'
	}
];

/** Drop-in classes, separate from the coached programme blocks. */
export const classes = [
	{
		id: 'barbell-club',
		name: 'Barbell Club',
		image: '/images/class-strength.jpg',
		alt: 'Hands gripping a loaded barbell before a lift',
		summary: 'Technique-led lifting for squat, bench, deadlift and press.',
		length: '60 min',
		level: 'All levels',
		cap: '8 people'
	},
	{
		id: 'engine',
		name: 'Engine Room',
		image: '/images/class-cycle.jpg',
		alt: 'A group of road cyclists riding in formation',
		summary: 'Bike, rower and ski erg intervals with the pacing set for you.',
		length: '45 min',
		level: 'All levels',
		cap: '10 people'
	},
	{
		id: 'sprint',
		name: 'Speed & Power',
		image: '/images/class-sprint.jpg',
		alt: 'A sprinter set in the blocks on a running track',
		summary: 'Short sprints, jumps and throws. Fully recovered between efforts.',
		length: '45 min',
		level: 'Intermediate',
		cap: '8 people'
	},
	{
		id: 'mobility',
		name: 'Mobility & Breath',
		image: '/images/prog-recovery.jpg',
		alt: 'A runner moving along a quiet hillside path',
		summary: 'Range of motion, breathing drills and a proper wind-down.',
		length: '30 min',
		level: 'All levels',
		cap: '12 people'
	}
];

// Ordered the way a Bangladeshi week runs: Sunday first, Friday off.
// `women` marks a women-only session on the separate floor.
export const timetable = [
	{
		day: 'Sunday',
		short: 'Sun',
		sessions: [
			{ time: '06:15', name: 'Barbell Club', coach: 'Yusuf', length: '60 min', women: false },
			{ time: '10:00', name: 'Strength — women only', coach: 'Amina', length: '60 min', women: true },
			{ time: '17:30', name: 'Engine Room', coach: 'Daniel', length: '45 min', women: false },
			{ time: '19:00', name: 'Barbell Club', coach: 'Yusuf', length: '60 min', women: false }
		]
	},
	{
		day: 'Monday',
		short: 'Mon',
		sessions: [
			{ time: '06:15', name: 'Engine Room', coach: 'Daniel', length: '45 min', women: false },
			{ time: '10:00', name: 'Mobility — women only', coach: 'Amina', length: '30 min', women: true },
			{ time: '18:00', name: 'Speed & Power', coach: 'Marcus', length: '45 min', women: false },
			{ time: '19:15', name: 'Mobility & Breath', coach: 'Omar', length: '30 min', women: false }
		]
	},
	{
		day: 'Tuesday',
		short: 'Tue',
		sessions: [
			{ time: '06:15', name: 'Barbell Club', coach: 'Marcus', length: '60 min', women: false },
			{ time: '10:00', name: 'Engine Room — women only', coach: 'Amina', length: '45 min', women: true },
			{ time: '17:30', name: 'Engine Room', coach: 'Daniel', length: '45 min', women: false },
			{ time: '19:00', name: 'Barbell Club', coach: 'Yusuf', length: '60 min', women: false }
		]
	},
	{
		day: 'Wednesday',
		short: 'Wed',
		sessions: [
			{ time: '06:15', name: 'Barbell Club', coach: 'Yusuf', length: '60 min', women: false },
			{ time: '10:00', name: 'Strength — women only', coach: 'Amina', length: '60 min', women: true },
			{ time: '18:00', name: 'Engine Room', coach: 'Daniel', length: '45 min', women: false },
			{ time: '19:15', name: 'Speed & Power', coach: 'Marcus', length: '45 min', women: false }
		]
	},
	{
		day: 'Thursday',
		short: 'Thu',
		sessions: [
			{ time: '06:15', name: 'Engine Room', coach: 'Daniel', length: '45 min', women: false },
			{ time: '10:00', name: 'Open floor — women only', coach: 'Amina', length: '90 min', women: true },
			{ time: '17:30', name: 'Barbell Club', coach: 'Yusuf', length: '60 min', women: false },
			{ time: '19:00', name: 'Mobility & Breath', coach: 'Omar', length: '30 min', women: false }
		]
	},
	{
		day: 'Friday',
		short: 'Fri',
		sessions: [
			{ time: '16:30', name: 'Barbell Club', coach: 'Marcus', length: '60 min', women: false },
			{ time: '18:00', name: 'Mobility & Breath', coach: 'Omar', length: '30 min', women: false }
		],
		note: 'Closed until 16:00 for Jumu‘ah.'
	},
	{
		day: 'Saturday',
		short: 'Sat',
		sessions: [
			{ time: '08:00', name: 'Barbell Club', coach: 'Yusuf', length: '60 min', women: false },
			{ time: '09:15', name: 'Engine Room', coach: 'Daniel', length: '45 min', women: false },
			{ time: '10:30', name: 'Strength — women only', coach: 'Amina', length: '60 min', women: true },
			{ time: '17:00', name: 'Open floor, coach on hand', coach: 'Omar', length: '90 min', women: false }
		]
	}
];

/** The women-only floor: separate room, separate hours, women coaches only. */
export const womensFloor = {
	hours: [
		['Sun–Thu', '09:30 – 13:00'],
		['Saturday', '10:00 – 13:00'],
		['Friday', 'Closed']
	],
	points: [
		{
			icon: 'users' as IconName,
			title: 'A separate floor',
			body: 'Its own room with its own entrance, screened from the main gym. No men on the floor during women’s hours, staff included.'
		},
		{
			icon: 'target' as IconName,
			title: 'Women coaches only',
			body: 'Every women-only session is coached by Amina. The programme is identical to the main floor — the same lifts, the same progression.'
		},
		{
			icon: 'moon' as IconName,
			title: 'Modest by default',
			body: 'Train in whatever you are comfortable in. No mirrors facing the entrance, no cameras, and no photography anywhere in the building.'
		},
		{
			icon: 'clock' as IconName,
			title: 'Prayer space',
			body: 'A private prayer room next to the women’s changing area, with wudu facilities, open through all women’s hours.'
		}
	]
};

export const plans = [
	{
		id: 'floor',
		name: 'Gym only',
		price: '2,500',
		period: 'a month',
		summary: 'Use the gym whenever we are open. You decide what to do.',
		includes: [
			'Come in any time we are open',
			'All the weights and machines',
			'Showers, lockers and changing rooms',
			'One session to show you around'
		],
		excludes: ['Classes with a coach', 'A plan made for you', 'Help with food'],
		featured: false,
		cta: 'Pick this one'
	},
	{
		id: 'coached',
		name: 'Gym + coach',
		price: '6,000',
		period: 'a month',
		summary: 'Everything above, plus classes and a plan made for you.',
		includes: [
			'Everything in Gym only',
			'As many classes as you want',
			'A 12-week plan made for you',
			'We check how it is going every month',
			'A coach watches you lift, every time'
		],
		excludes: ['One-to-one help with food'],
		featured: true,
		cta: 'Pick this one'
	},
	{
		id: 'full',
		name: 'Gym + coach + food',
		price: '11,000',
		period: 'a month',
		summary: 'Training and food together, handled by the same coach.',
		includes: [
			'Everything in Gym + coach',
			'One-to-one help with food',
			'We look at what you eat every month',
			'Two private sessions a month',
			'Message your coach any day'
		],
		excludes: [],
		featured: false,
		cta: 'Pick this one'
	}
];

export const coaches = [
	{
		id: 'yusuf',
		name: 'Yusuf Rahman',
		role: 'Head coach, strength',
		image: '/images/coach-1.jpg',
		alt: 'Portrait of Yusuf Rahman',
		bio: 'Fifteen years under a barbell and eight coaching it. Yusuf writes most of the strength blocks and will happily spend an entire session on your setup if that is what the lift needs.',
		focus: ['Squat and deadlift', 'Return from injury', 'First-time lifters']
	},
	{
		id: 'daniel',
		name: 'Daniel Okonjo',
		role: 'Conditioning',
		image: '/images/coach-2.jpg',
		alt: 'Portrait of Daniel Okonjo',
		bio: 'Ex-middle-distance runner who came to the conclusion that most people train their engine far too hard. He builds the aerobic base and sets the pacing for every Engine Room session.',
		focus: ['Aerobic base', 'Interval pacing', 'Event preparation']
	},
	{
		id: 'omar',
		name: 'Omar Haddad',
		role: 'Mobility and recovery',
		image: '/images/coach-3.jpg',
		alt: 'Portrait of Omar Haddad',
		bio: 'Came to coaching from twenty years of physiotherapy. Omar runs the mobility sessions and is the person we send you to when something hurts and you would rather ignore it.',
		focus: ['Mobility', 'Sleep and recovery', 'Working around a niggle']
	},
	{
		id: 'marcus',
		name: 'Marcus Bell',
		role: 'Speed and power',
		image: '/images/coach-4.jpg',
		alt: 'Portrait of Marcus Bell',
		bio: 'Sprints, jumps and throws. Marcus handles the sharp end of the programme and is strict about the thing everyone skips: being fully recovered before the next effort.',
		focus: ['Sprinting', 'Jumping and landing', 'Power for sport']
	},
	{
		id: 'amina',
		name: 'Amina Chowdhury',
		role: 'Head coach, women’s floor',
		image: '/images/coach-5.jpg',
		alt: 'Portrait of Amina Chowdhury',
		bio: 'Amina runs every session on the women’s floor and writes the programmes that go with them. Same lifts, same progression, same expectations as the main floor — in a room where you can get on with it.',
		focus: ['Strength for beginners', 'Postnatal return', 'Women’s programming']
	}
];

export const facilities = [
	{ icon: 'dumbbell' as IconName, name: 'Six lifting platforms', note: 'Calibrated plates and competition bars' },
	{ icon: 'scale' as IconName, name: 'Eight squat racks', note: 'No queue, even at six in the evening' },
	{ icon: 'pulse' as IconName, name: 'Rowers, bikes and ski ergs', note: 'Plus a twenty-metre sled track' },
	{ icon: 'moon' as IconName, name: 'Dedicated mobility room', note: 'Quiet, matted and away from the floor' },
	{ icon: 'users' as IconName, name: 'Changing rooms and showers', note: 'Secure lockers and towels provided' },
	{ icon: 'clock' as IconName, name: 'Two prayer rooms', note: 'Separate men’s and women’s, with wudu' },
	{ icon: 'target' as IconName, name: 'Separate women’s floor', note: 'Own entrance, own hours, women coaches' },
	{ icon: 'flame' as IconName, name: 'Full power backup', note: 'Generator and IPS — sessions never stop' }
];

// PLACEHOLDER COPY — written examples, not real members. Replace with
// genuine, permissioned quotes before launch.
export const testimonials = [
	{
		quote:
			'I had been going to gyms for six years and never once added weight to the bar on purpose. Twelve weeks here and I finally understand what I am doing.',
		name: 'Sample member',
		detail: 'Coached, ten months'
	},
	{
		quote:
			'The food side was the part I dreaded. Nobody told me to cut anything out — they just moved things around and set a protein number. It stuck.',
		name: 'Sample member',
		detail: 'Full Coaching, one year'
	},
	{
		quote:
			'Four people to a session means somebody actually watches you lift. That alone was worth changing gyms for.',
		name: 'Sample member',
		detail: 'Coached, two years'
	}
];

// `body` is a block list rather than HTML so the template owns typography
// and nothing authored here can inject markup.
export type Block = { type: 'h2' | 'p' | 'quote'; text: string } | { type: 'list'; items: string[] };

export const journal: {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	date: string;
	read: string;
	image: string;
	alt: string;
	author: string;
	body: Block[];
}[] = [
	{
		slug: 'protein-without-the-tubs',
		title: 'Hitting your protein without living on tubs',
		excerpt:
			'Four ordinary meals that get most people to their number, with nothing bought from a supplement shop.',
		category: 'Nutrition',
		date: '2026-07-14',
		read: '6 min',
		image: '/images/nutrition-plate.jpg',
		alt: 'A plate of fruit, nuts and yoghurt on a dark surface',
		author: 'Omar Haddad',
		body: [
			{
				type: 'p',
				text: 'Protein is the one number we ask people to be strict about, and it is also the number almost everybody guesses wrong. Most people are not short by a little. They are short by half.'
			},
			{
				type: 'p',
				text: 'The usual response to that is a tub of powder, which works but is an expensive way to solve a problem that four ordinary meals already solve. Here is what those meals look like.'
			},
			{ type: 'h2', text: 'Start with breakfast, because that is where the gap is' },
			{
				type: 'p',
				text: 'Breakfast is the meal where protein quietly disappears. Bread, jam and tea is a fine breakfast in every respect except this one. Adding eggs, dal or yoghurt to what you already eat closes most of the daily gap before you have left the house.'
			},
			{
				type: 'list',
				items: [
					'Two or three eggs with whatever you normally have',
					'A bowl of dal, which most kitchens have already',
					'Plain yoghurt with fruit, if mornings are rushed'
				]
			},
			{ type: 'h2', text: 'Put a fist of protein at every other meal' },
			{
				type: 'p',
				text: 'You do not need a scale for this. A portion of chicken, fish, beef, eggs, dal or paneer roughly the size of your own palm, at each of the remaining meals, gets almost everybody to a sensible number.'
			},
			{
				type: 'quote',
				text: 'If you are hitting protein at four meals, you are already doing better than most people who own a shaker.'
			},
			{ type: 'h2', text: 'Then stop counting' },
			{
				type: 'p',
				text: 'Track it for two weeks so you know what your normal actually is. After that, most people can hold the habit without writing anything down, and the ones who cannot usually only need to track the one meal they keep getting wrong.'
			},
			{
				type: 'p',
				text: 'Powder is not banned — nothing is. It is just the last thing to reach for, not the first.'
			}
		]
	},
	{
		slug: 'why-your-conditioning-stalled',
		title: 'Why your conditioning stopped improving',
		excerpt:
			'If every session feels hard, none of them are building a base. Here is what to do about the pacing.',
		category: 'Training',
		date: '2026-06-30',
		read: '8 min',
		image: '/images/prog-recovery.jpg',
		alt: 'A runner on an open hillside path at first light',
		author: 'Daniel Okonjo',
		body: [
			{
				type: 'p',
				text: 'The most common conditioning problem we see is not laziness. It is the opposite: people training hard every single session, and wondering why nothing has moved in eight months.'
			},
			{ type: 'h2', text: 'Hard sessions do not build a base' },
			{
				type: 'p',
				text: 'Aerobic fitness is built mostly by long, easy work — the kind where you could hold a conversation the whole way through. It feels like it is doing nothing. That feeling is the point. Hard intervals sharpen what the easy work built, and if there is nothing underneath them, there is nothing to sharpen.'
			},
			{
				type: 'p',
				text: 'When every session sits in the middle — too hard to recover from, too easy to be a real interval — you get the fatigue of hard training and the adaptation of neither.'
			},
			{ type: 'h2', text: 'A simple fix for the next eight weeks' },
			{
				type: 'list',
				items: [
					'Two easy sessions a week where you can talk in full sentences',
					'One hard session a week, fully recovered between efforts',
					'Nothing in the middle — if it is not clearly easy, it is a hard day'
				]
			},
			{
				type: 'quote',
				text: 'If you cannot say a whole sentence, you are not on an easy day, whatever the plan says.'
			},
			{ type: 'h2', text: 'What changes, and when' },
			{
				type: 'p',
				text: 'The first two weeks feel like a step backwards, because you are working less hard than you are used to. Around week four the easy pace starts getting faster at the same effort. That is the whole signal. It is not dramatic and it does not photograph well, which is why almost nobody does it.'
			}
		]
	},
	{
		slug: 'first-twelve-weeks',
		title: 'What actually happens in your first twelve weeks',
		excerpt:
			'A week-by-week account of the first block, including the two weeks where it stops feeling new.',
		category: 'Method',
		date: '2026-06-11',
		read: '9 min',
		image: '/images/equipment.jpg',
		alt: 'Kettlebell, medicine ball and rope resting on a wooden box',
		author: 'Yusuf Rahman',
		body: [
			{
				type: 'p',
				text: 'People ask what the first block is like, and the honest answer is that it is more boring than they expect and works better than they expect. Here is the shape of it.'
			},
			{ type: 'h2', text: 'Weeks one to three: learning five movements' },
			{
				type: 'p',
				text: 'The weight is light enough that you can think. That frustrates people who came in wanting to be tired, but you cannot practise a movement you are too fatigued to perform. By the end of week three most people can set up for a squat and a deadlift without being told.'
			},
			{ type: 'h2', text: 'Weeks four to eight: the boring part that works' },
			{
				type: 'p',
				text: 'Same five lifts, slightly more weight each week. This is where people expect variety and do not get it. It is also where the numbers start moving, which is usually enough to keep everyone honest.'
			},
			{
				type: 'quote',
				text: 'The block is repetitive on purpose. Repetition is the mechanism, not a shortcut we took.'
			},
			{ type: 'h2', text: 'Weeks nine to twelve: heavier, and then a step back' },
			{
				type: 'p',
				text: 'The last stretch is the heaviest, followed by a deliberately light week. People hate the light week and then come back stronger, every time. Then we sit down, read the numbers, change one thing, and start the next block.'
			},
			{
				type: 'list',
				items: [
					'Strength usually moves inside a month, because early progress is skill',
					'Body composition takes longer and depends more on food and sleep',
					'Nobody gets a new programme every week, and that is the point'
				]
			}
		]
	},
	{
		slug: 'training-around-shift-work',
		title: 'Training around shift work without falling apart',
		excerpt:
			'Three sessions you never miss beat five you plan and skip. How to build the week around a rota.',
		category: 'Training',
		date: '2026-05-22',
		read: '5 min',
		image: '/images/lifestyle-shoe.jpg',
		alt: 'Someone tying a running shoe on a city street',
		author: 'Amina Chowdhury',
		body: [
			{
				type: 'p',
				text: 'Most programmes are written for somebody with a fixed week. If your rota changes every fortnight, that plan does not survive contact with your actual life — and then you conclude that you are the problem. You are not.'
			},
			{ type: 'h2', text: 'Write the plan for the days you really have' },
			{
				type: 'p',
				text: 'Three sessions you never miss will take you further than five you plan and skip half of. Pick the smaller number honestly, and let the extra sessions be a bonus rather than a debt you are always behind on.'
			},
			{ type: 'h2', text: 'Make the sessions interchangeable' },
			{
				type: 'list',
					items: [
					'Every session is full body, so missing one does not skip a muscle group',
					'A session can move to any day of the week without breaking the order',
					'If the week collapses, you do the one session that matters most'
				]
			},
			{
				type: 'quote',
				text: 'A plan that only works on a perfect week is not a plan. It is a wish with a spreadsheet.'
			},
			{ type: 'h2', text: 'Protect sleep before you protect training' },
			{
				type: 'p',
				text: 'On a bad rota, sleep is the thing that decides whether training helps or digs the hole deeper. If you have to choose between a session and an hour of sleep after a night shift, take the sleep. The session will still be there.'
			}
		]
	}
];

export const nutritionPrinciples = [
	{
		icon: 'target' as IconName,
		title: 'Protein first',
		body: 'Set protein at every meal before anything else is decided. It is the one number worth being strict about.'
	},
	{
		icon: 'calendar' as IconName,
		title: 'Carbs around training',
		body: 'Carbohydrate is fuel, so it goes near the sessions that need it and eases off on the days that do not.'
	},
	{
		icon: 'leaf' as IconName,
		title: 'Fibre daily',
		body: 'Plants at every meal. Boring advice, and the thing most people are genuinely short of.'
	},
	{
		icon: 'check' as IconName,
		title: 'Nothing banned',
		body: 'No food is off the list. A plan you have to escape from at the weekend was never a plan.'
	}
];

export const sampleDay = [
	['07:30', 'Breakfast', 'Eggs, oats, berries', '38g'],
	['12:30', 'Lunch', 'Chicken, rice, salad, olive oil', '45g'],
	['16:00', 'Pre-session', 'Yoghurt and fruit', '18g'],
	['19:30', 'Dinner', 'Salmon, potatoes, greens', '42g']
];

export const faqs = [
	{
		question: 'I have never lifted weights. Is that a problem?',
		answer:
			'No. Most people here started there. Your first weeks are spent learning five moves, with weights light enough that you can think about what you are doing.'
	},
	{
		question: 'Do I have to count what I eat?',
		answer:
			'For the first two weeks, yes, so we both know where you are starting. After that most people only count protein, and plenty stop counting altogether.'
	},
	{
		question: 'How fast will I see a change?',
		answer:
			'You will get stronger within a month. Most of that early gain is skill, not muscle. How you look takes longer, and depends more on food and sleep than on training.'
	},
	{
		question: 'What if I am injured?',
		answer:
			'Tell us on day one. We train around it, and we work with your physio if you have one. We do not treat injuries ourselves.'
	},
	{
		question: 'I work shifts. Can I still train?',
		answer:
			'Yes. Classes run from 6:15 in the morning to 7:15 at night. We build your plan around the days you really have, not the days you wish you had.'
	},
	{
		question: 'Do I have to sign a contract?',
		answer:
			'No. You pay month by month and you can stop with 30 days’ notice.'
	},
	{
		question: 'Can I pause my membership?',
		answer:
			'Yes, for up to three months a year — travel, injury or Ramadan. Tell us before your payment date and the pause costs nothing.'
	},
	{
		question: 'Is there somewhere to pray?',
		answer:
			'Yes. Two prayer rooms, one next to each changing room, both with wudu. We are closed on Friday until 4pm for Jumu‘ah.'
	},
	{
		question: 'Is the women’s floor really separate?',
		answer:
			'Yes. It is its own room with its own door. Only Amina coaches there. No men on that floor during women’s hours, staff included. No photos anywhere in the building.'
	},
	{
		question: 'How do I pay?',
		answer:
			'bKash, Nagad, card or bank transfer, once a month. We send you a link after your first session. You pay nothing before you have trained here.'
	},
	{
		question: 'What happens in Ramadan?',
		answer:
			'Classes move to after Taraweeh and before Suhoor, and we train less. You can pause your membership for the month for free. We put the Ramadan timetable up two weeks before it starts.'
	}
];

/** The five picked above, in the order they are listed there. */
export const homeFaqs = homeFaqQuestions.map(
	(q) => faqs.find((f) => f.question === q) ?? { question: q, answer: '' }
);
