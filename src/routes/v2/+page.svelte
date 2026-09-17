<script lang="ts">
	import heroField from '$lib/images/hero-field.jpg?enhanced';
	import coachingSpot from '$lib/images/coaching-spot.jpg?enhanced';
	import methodRack from '$lib/images/method-rack.jpg?enhanced';
	import gymFloor from '$lib/images/gym-floor.jpg?enhanced';
	import nutritionPlate from '$lib/images/nutrition-plate.jpg?enhanced';
	import womensStrength from '$lib/images/womens-strength.jpg?enhanced';

	const brand = 'আমালা লাইফস্টাইল';
	const phone = '+880 1712 345 678';
	const tel = '+8801712345678';
	const wa = 'https://wa.me/8801712345678';
	const address = 'হাউস ৪২, রোড ১১, ঢাকা ১২১৩';

	// Four beats, in the order they happen to you. Same shape as the English
	// home page, told as a story rather than as a grid of choices.
	const story = [
		{
			n: '১',
			image: coachingSpot,
			alt: 'একজন কোচ পাশে দাঁড়িয়ে দেখিয়ে দিচ্ছেন',
			title: 'প্রথম দিন শুধু কথা হবে',
			body: 'কিছু জানার দরকার নেই, কিছু নিয়ে আসারও দরকার নেই। আপনি কী চান আর শরীর এখন কেমন আছে — এটুকু শুনেই আমরা শুরু করি।'
		},
		{
			n: '২',
			image: methodRack,
			alt: 'জিমের র‍্যাকে সাজানো ওজন',
			title: 'আপনার জন্য আলাদা প্ল্যান',
			body: 'সবার এক রুটিন এখানে নেই। আপনার সময়, বয়স আর পুরোনো ব্যথা মাথায় রেখে ১২ সপ্তাহের একটা প্ল্যান বানিয়ে দেওয়া হয়।'
		},
		{
			n: '৩',
			image: gymFloor,
			alt: 'জিমের খোলা ফ্লোরে সদস্যরা অনুশীলন করছেন',
			title: 'প্রতিদিন কোচ পাশে থাকেন',
			body: 'ভুল ভঙ্গিতে একটা রেপও যাতে না হয়, কোচ সেটা দেখেন। ভারী ওজন পরে, আগে ঠিক নিয়মটা।'
		},
		{
			n: '৪',
			image: nutritionPlate,
			alt: 'একটি সাজানো খাবারের প্লেট',
			title: 'খাওয়াটাও আমরা ঠিক করে দিই',
			body: 'ভাত, মাছ, ডাল — যা বাসায় রান্না হয় তা দিয়েই। আলাদা কিছু কিনতে হবে না, ডায়েট বলে না খেয়ে থাকতেও হবে না।'
		}
	];

	const plans = [
		{
			name: 'শুধু জিম',
			price: '২,৫০০',
			summary: 'খোলা থাকলে যখন খুশি আসুন। কী করবেন আপনি ঠিক করবেন।',
			has: ['সব ওজন আর মেশিন', 'শাওয়ার, লকার, চেঞ্জিং রুম', 'ঘুরিয়ে দেখানোর একটা সেশন'],
			featured: false
		},
		{
			name: 'জিম + কোচ',
			price: '৬,০০০',
			summary: 'উপরের সবকিছু, সাথে ক্লাস আর আপনার নিজের প্ল্যান।',
			has: [
				'যত খুশি ক্লাস',
				'১২ সপ্তাহের নিজস্ব প্ল্যান',
				'প্রতি মাসে অগ্রগতি দেখা',
				'প্রতিবার কোচ পাশে'
			],
			featured: true
		},
		{
			name: 'জিম + কোচ + খাবার',
			price: '১১,০০০',
			summary: 'অনুশীলন আর খাওয়া — দুটোই একজন কোচের হাতে।',
			has: ['একান্ত খাবারের পরামর্শ', 'মাসে দুটো প্রাইভেট সেশন', 'যেকোনো দিন কোচকে মেসেজ'],
			featured: false
		}
	];

	const faqs = [
		{
			q: 'আগে কখনো জিম করিনি, পারব তো?',
			a: 'এখানে বেশিরভাগ মানুষই প্রথমবার আসেন। প্রথম দিন কেউ আপনাকে ভারী কিছু তুলতে বলবে না — কোচ দেখিয়ে দেবেন, আপনি শুধু করবেন।'
		},
		{
			q: 'প্রথম সেশনের জন্য টাকা লাগবে?',
			a: 'না। প্রথম সেশন ফ্রি, এবং তারপর ভর্তি না হলেও কোনো সমস্যা নেই। কোনো ভর্তি ফি-ও নেই।'
		},
		{
			q: 'সময় পাই না, সপ্তাহে কয়দিন লাগবে?',
			a: 'সপ্তাহে তিন দিন, প্রতিবার ৪৫ মিনিট — এতেই কাজ হয়। শিফটে কাজ করলে কোচ সেই অনুযায়ী প্ল্যান সাজিয়ে দেবেন।'
		},
		{
			q: 'হাঁটু বা কোমরে পুরোনো ব্যথা আছে।',
			a: 'প্রথম দিনই সেটা বলবেন। যে নড়াচড়ায় ব্যথা বাড়ে সেটা বাদ দিয়ে প্ল্যান হবে। ডাক্তার নিষেধ করলে আমরা সেটার উপরে যাই না।'
		},
		{
			q: 'মেম্বারশিপ বন্ধ বা বিরতি দেওয়া যায়?',
			a: 'যায়। এক মাসের নোটিশে বন্ধ করা যায়, আর দেশের বাইরে গেলে বা অসুস্থ হলে বিরতি নেওয়া যায়।'
		}
	];
</script>

<svelte:head>
	<title>{brand} — ঢাকার জিম, কোচসহ</title>
	<meta
		name="description"
		content="ঢাকার একটি জিম, যেখানে একজন কোচ পাশে থেকে দেখিয়ে দেন কী করতে হবে। প্রথম সেশন ফ্রি।"
	/>
	<meta property="og:title" content="{brand} — ঢাকার জিম, কোচসহ" />
	<meta property="og:locale" content="bn_BD" />
</svelte:head>

<div class="bn">
	<header class="bar">
		<a class="bar__name" href="/v2">{brand}</a>
		<a class="btn btn--sm" href="tel:{tel}">কল করুন</a>
	</header>

	<section class="hero">
		<enhanced:img
			src={heroField}
			alt="খোলা আকাশের নিচে সবুজ মাঠ"
			sizes="100vw"
			fetchpriority="high"
		/>
		<div class="hero__inner wrap">
			<h1>শরীরটা আপনার।<br /><span class="mark">শুরুটা</span> এখানে হোক।</h1>
			<p>জিমে ঢুকে কী করবেন, সেটা একজন কোচ পাশে থেকে দেখিয়ে দেবেন। প্রথম দিনটা ফ্রি।</p>
			<a class="btn" href="{wa}">ফ্রি সেশন বুক করুন</a>
		</div>
	</section>

	<section class="wrap block">
		<h2>এখানে আসলে কী হয়</h2>
		<ol class="story">
			{#each story as beat (beat.n)}
				<li>
					<enhanced:img
						src={beat.image}
						alt={beat.alt}
						sizes="(min-width: 900px) 46vw, 100vw"
						loading="lazy"
					/>
					<div>
						<span class="num">{beat.n}</span>
						<h3>{beat.title}</h3>
						<p>{beat.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="womens">
		<enhanced:img
			src={womensStrength}
			alt="মেয়েদের আলাদা ফ্লোরে অনুশীলন"
			sizes="100vw"
			loading="lazy"
		/>
		<div class="wrap">
			<h2>মেয়েদের জন্য আলাদা ফ্লোর</h2>
			<p>
				আলাদা ঘর, আলাদা ঢোকার পথ, নারী কোচ। কেউ তাকিয়ে আছে কি না ভেবে সময় নষ্ট করতে হবে না।
			</p>
		</div>
	</section>

	<section class="wrap block" id="price">
		<h2>খরচ কত</h2>
		<p class="lede">মাসে মাসে। ভর্তি ফি নেই, লুকোনো খরচ নেই।</p>
		<div class="plans">
			{#each plans as plan (plan.name)}
				<article class="plan" class:plan--hot={plan.featured}>
					{#if plan.featured}<span class="flag">বেশিরভাগ মানুষ এটাই নেন</span>{/if}
					<h3>{plan.name}</h3>
					<p class="price">৳ {plan.price}<span>/মাস</span></p>
					<p>{plan.summary}</p>
					<ul>
						{#each plan.has as line (line)}<li>{line}</li>{/each}
					</ul>
					<a class="btn btn--block" class:btn--ink={plan.featured} href="{wa}">এটাই নেব</a>
				</article>
			{/each}
		</div>
	</section>

	<section class="wrap block">
		<h2>যা সবাই জিজ্ঞেস করেন</h2>
		<div class="faq">
			{#each faqs as faq (faq.q)}
				<details>
					<summary>{faq.q}</summary>
					<p>{faq.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<footer class="end wrap" id="contact">
		<h2>আসতে চাইলে</h2>
		<p class="lede">ফোন করুন বা হোয়াটসঅ্যাপে লিখুন — একই দিনে উত্তর পাবেন।</p>
		<div class="end__actions">
			<a class="btn" href="{wa}">হোয়াটসঅ্যাপে লিখুন</a>
			<a class="btn btn--quiet" href="tel:{tel}">{phone}</a>
		</div>
		<dl class="end__facts">
			<div>
				<dt>ঠিকানা</dt>
				<dd>{address}</dd>
			</div>
			<div>
				<dt>খোলা থাকে</dt>
				<dd>রবি–বৃহস্পতি ৬টা–১০টা · শনি ৮টা–৮টা · শুক্র বিকেল ৪টা–৯টা</dd>
			</div>
		</dl>
	</footer>
</div>

<style>
	/* Anek Bangla carries both scripts, so the whole page is one face. */
	@import '@fontsource-variable/anek-bangla/wght.css';

	/* v2's own palette — it borrows nothing from the old site's layout.css. */
	.bn {
		--paper: #fffdf9;
		--surface: #f6f1e7;
		--ink: #1c1a17;
		--muted: #57524a;
		--rule: #e9e2d5;
		--rule-strong: #d3cabb;
		--sun: #ffc24d;
		--sun-wash: #fff5e2;
		--ember: #d9481f;
		--ember-deep: #b93a16;
		--ember-ink: #fffdf9;
		--band-ink: #faf7f1;
		--r-sm: 8px;
		--r-lg: 22px;
		--r-pill: 999px;

		font-family: 'Anek Bangla Variable', ui-sans-serif, system-ui, sans-serif;
		font-size: 18px;
		line-height: 1.75;
		background: var(--paper);
	}

	.bn :global(img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.wrap {
		max-width: 1080px;
		margin-inline: auto;
		padding-inline: clamp(20px, 5vw, 40px);
	}

	h1,
	h2,
	h3 {
		font-family: inherit;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: 0;
		text-wrap: balance;
	}

	h2 {
		font-size: clamp(30px, 4.5vw, 46px);
		margin: 0 0 12px;
	}

	h3 {
		font-size: clamp(22px, 2.6vw, 28px);
		margin: 0 0 8px;
	}

	p {
		margin: 0 0 16px;
		max-width: 56ch;
		color: var(--muted);
	}

	.lede {
		font-size: 20px;
		margin-bottom: 32px;
	}

	.block {
		padding-block: clamp(64px, 9vw, 120px);
	}

	/* Bar — a name and one action. Nothing to hunt through. */
	.bar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px clamp(20px, 5vw, 40px);
		background: var(--paper);
		border-bottom: 1px solid var(--rule);
	}

	.bar__name {
		font-weight: 700;
		font-size: 20px;
		color: var(--ink);
		text-decoration: none;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 14px 26px;
		border-radius: var(--r-pill);
		background: var(--ember);
		color: var(--ember-ink);
		font-weight: 600;
		font-size: 18px;
		text-decoration: none;
	}

	.btn:hover {
		background: var(--ember-deep);
	}

	.btn--sm {
		padding: 8px 18px;
		font-size: 16px;
	}

	.btn--block {
		display: flex;
		margin-top: auto;
	}

	.btn--ink {
		background: var(--ink);
	}

	.btn--ink:hover {
		background: #000;
	}

	.btn--quiet {
		background: transparent;
		color: var(--ink);
		border: 1px solid var(--rule-strong);
	}

	.btn--quiet:hover {
		background: var(--surface);
	}

	/* Hero — ink type on a bright photograph, washed pale rather than darkened. */
	.hero {
		position: relative;
		display: grid;
		align-items: center;
		min-height: 72svh;
		isolation: isolate;
	}

	.hero :global(picture) {
		position: absolute;
		inset: 0;
		z-index: -2;
	}

	.hero :global(img) {
		object-position: center 74%;
	}

	.hero::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgb(255 253 249 / 0.62);
	}

	.hero__inner {
		width: 100%;
		padding-block: 72px;
		text-align: center;
	}

	.hero h1 {
		font-size: clamp(40px, 8vw, 84px);
		margin: 0 0 20px;
	}

	.hero p {
		margin-inline: auto;
		max-width: 34ch;
		font-size: 20px;
		color: var(--ink);
	}

	.mark {
		display: inline-block;
		background: var(--sun);
		padding-inline: 0.16em;
		line-height: 1.1;
		border-radius: var(--r-sm);
	}

	/* Story — one photograph, one heading, one paragraph, four times. */
	.story {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(48px, 7vw, 88px);
	}

	.story li {
		display: grid;
		gap: 24px;
		align-items: center;
	}

	.story :global(picture) {
		display: block;
		aspect-ratio: 4 / 3;
		border-radius: var(--r-lg);
		overflow: hidden;
	}

	.num {
		display: inline-grid;
		place-items: center;
		width: 40px;
		height: 40px;
		margin-bottom: 12px;
		border-radius: var(--r-pill);
		background: var(--sun);
		color: var(--ink);
		font-weight: 700;
	}

	.womens {
		position: relative;
		display: grid;
		align-items: end;
		min-height: 60svh;
		padding-block: 64px;
		isolation: isolate;
	}

	.womens :global(picture) {
		position: absolute;
		inset: 0;
		z-index: -2;
	}

	.womens::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(to top, rgb(28 26 23 / 0.85), rgb(28 26 23 / 0.15));
	}

	.womens h2,
	.womens p {
		color: var(--band-ink);
	}

	/* Plans — three cards, the middle one filled. */
	.plans {
		display: grid;
		gap: 20px;
	}

	.plan {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 28px;
		border-radius: var(--r-lg);
		background: var(--sun-wash);
	}

	.plan--hot {
		background: var(--sun);
	}

	.flag {
		align-self: flex-start;
		padding: 4px 12px;
		border-radius: var(--r-pill);
		background: var(--ink);
		color: var(--paper);
		font-size: 14px;
		font-weight: 600;
	}

	.price {
		font-size: clamp(34px, 5vw, 44px);
		font-weight: 700;
		color: var(--ink);
		margin: 0;
	}

	.price span {
		font-size: 17px;
		font-weight: 500;
		color: var(--muted);
	}

	.plan ul {
		margin: 4px 0 20px;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 8px;
	}

	.plan li {
		padding-left: 26px;
		position: relative;
		color: var(--ink);
	}

	.plan li::before {
		content: '✓';
		position: absolute;
		left: 0;
		font-weight: 700;
	}

	/* FAQ — native disclosure, no script. */
	.faq {
		border-top: 1px solid var(--rule);
	}

	details {
		border-bottom: 1px solid var(--rule);
	}

	summary {
		padding: 20px 0;
		font-size: 20px;
		font-weight: 600;
		cursor: pointer;
	}

	details p {
		margin-bottom: 20px;
	}

	.end {
		padding-block: clamp(64px, 9vw, 120px);
		border-top: 1px solid var(--rule);
	}

	.end__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 40px;
	}

	.end__facts {
		display: grid;
		gap: 20px;
		margin: 0;
	}

	dt {
		font-weight: 600;
		color: var(--ink);
	}

	dd {
		margin: 0;
		color: var(--muted);
	}

	@media (max-width: 559px) {
		.btn {
			width: 100%;
		}

		.bar .btn {
			width: auto;
		}
	}

	@media (min-width: 900px) {
		.story li {
			grid-template-columns: 1fr 1fr;
			gap: 48px;
		}

		.story li:nth-child(even) :global(picture) {
			order: 2;
		}

		.plans {
			grid-template-columns: repeat(3, 1fr);
		}

		.end__facts {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
