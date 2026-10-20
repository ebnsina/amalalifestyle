<script lang="ts">
	import Screen from '#lib/components/Screen.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import { t } from '#lib/i18n.svelte.js';

	const sections = $derived([
		{ title: t('অ্যাপটি কী', 'What it is'), body: t('ভালো অভ্যাস দিয়ে ভালো জীবন গড়ার সঙ্গী। ঘরের খাবারের হিসাব, নামাজ, ব্যায়াম, বই পড়া, রোজকার কাজ আর বিএমআই — সব এক জায়গায়।',
			'A companion for building a better life through better habits. Home food log, prayer, exercise, reading, daily tasks and BMI — all in one place.') },
		{ title: t('আপনার তথ্য', 'Your data'), body: t('কোনো অ্যাকাউন্ট লাগে না। একবার খোলার পর ইন্টারনেট ছাড়াও চলে। আপনার সব তথ্য শুধু এই ফোনেই থাকে — কোথাও পাঠানো হয় না, কোনো বিজ্ঞাপন বা নজরদারি নেই।',
			'No account needed. After the first visit it works without internet. Everything stays on this phone — nothing is sent anywhere, with no ads and no tracking.') },
		{ title: t('ফোনে বসিয়ে নিন', 'Install it'), body: t('ব্রাউজারের মেনু থেকে “হোম স্ক্রিনে যোগ করুন” বা “ইনস্টল” চাপলে অ্যাপটা অন্য অ্যাপের মতোই খুলবে।',
			'Choose “Add to Home screen” or “Install” in your browser menu and it opens like any other app.') },
		{ title: t('মনে রাখবেন', 'Keep in mind'), body: t('সব হিসাব আনুমানিক। এটি চিকিৎসার পরামর্শ নয় — অসুখ থাকলে বা সন্দেহ হলে ডাক্তার বা পুষ্টিবিদের সাথে কথা বলুন।',
			'All numbers are estimates. This isn’t medical advice — if you’re unwell or unsure, talk to a doctor or dietitian.') },
	]);
</script>

<Screen title={t('অ্যাপ সম্পর্কে', 'About')}>
	<div class="head">
		<span class="logo" aria-hidden="true">🍛</span>
		<h2 class="big">{t('আমালা লাইফস্টাইল', 'AMALA Lifestyle')}</h2>
		<p class="muted center">{t('ভালো অভ্যাসে গড়ে ওঠে ভালো জীবন।', 'Where Better Habits Build Better Lives.')}</p>
	</div>
	{#each sections as s, i (s.title)}
		<Card class="enter" style="--i: {i}" title={s.title}><p class="muted">{s.body}</p></Card>
	{/each}
	<p class="xs muted center">
		<a class="credit" href="https://m.me/ebnsina.dev" target="_blank" rel="noopener noreferrer">
			{t('তৈরি করেছেন ইবনে সিনা', 'Made by Ebn Sina')}
		</a>
	</p>
</Screen>

<style>
	.head {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		padding-block: 1rem;
	}
	.credit {
		color: inherit;
		text-underline-offset: 3px;
	}
	.logo {
		display: grid;
		place-items: center;
		width: 96px;
		height: 96px;
		border-radius: 50%;
		background: var(--accent-soft);
		font-size: 48px;
	}
</style>
