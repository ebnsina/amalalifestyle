<script lang="ts">
	import {
		BodyWeightIcon, Book02Icon, CheckListIcon, Dumbbell01Icon, Mosque01Icon, SpoonAndForkIcon,
	} from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import InstallCard from '#lib/components/InstallCard.svelte';
	import Screen from '#lib/components/Screen.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { num, dateLabel, dayKey } from '#lib/format.js';
	import { dailyTarget, kcalOf } from '#lib/nutrition.js';
	import { t } from '#lib/i18n.svelte.js';
	import { fard } from '#lib/prayer.js';
	import { store } from '#lib/store.svelte.js';
	import { inView } from '#lib/tasks.js';

	const greeting = (h = new Date().getHours()) =>
		h < 12 ? t('শুভ সকাল', 'Good morning') : h < 17 ? t('শুভ দুপুর', 'Good afternoon')
			: h < 20 ? t('শুভ সন্ধ্যা', 'Good evening') : t('শুভ রাত্রি', 'Good night');

	// Every tool in the app. A new feature = one entry here plus its route.
	const tools = $derived([
		{ href: resolve('/(tabs)/food'), icon: SpoonAndForkIcon, title: t('খাবারের হিসাব', 'Food log'), sub: t('কী আর কতটুকু খাবেন', 'What and how much to eat'), tint: '--accent-soft', ink: '--ui-accent' },
		{ href: resolve('/prayer'), icon: Mosque01Icon, title: t('নামাজ', 'Prayer'), sub: t('পাঁচ ওয়াক্তের হিসাব', 'Track the five daily prayers'), tint: '--blue-soft', ink: '--blue' },
		{ href: resolve('/fitness'), icon: Dumbbell01Icon, title: t('ফিটনেস', 'Fitness'), sub: t('ঘরে ও জিমে ব্যায়াম', 'Workouts at home and the gym'), tint: '--warm-soft', ink: '--warm' },
		{ href: resolve('/books'), icon: Book02Icon, title: t('বই পড়া', 'Reading'), sub: t('কত পৃষ্ঠা পড়লেন', 'Pages you’ve read'), tint: '--plum-soft', ink: '--plum' },
		{ href: resolve('/tasks'), icon: CheckListIcon, title: t('আজকের কাজ', 'Today’s tasks'), sub: t('তারিখ আর গুরুত্ব দিয়ে কাজের তালিকা', 'To-dos with dates and priority'), tint: '--plum-soft', ink: '--plum' },
		{ href: resolve('/bmi'), icon: BodyWeightIcon, title: t('বিএমআই', 'BMI'), sub: t('ওজন ঠিক আছে কিনা', 'Is your weight healthy?'), tint: '--warm-soft', ink: '--warm' },
	]);

	const left = $derived(dailyTarget(store.profile!) - Math.round(store.today.reduce((s, m) => s + kcalOf(m.portions), 0)));
	const stats = $derived([
		[num(Math.max(0, left)), t('ক্যালরি বাকি', 'kcal left'), resolve('/(tabs)/food')],
		[`${num(fard.filter((p) => store.prayers[dayKey()]?.includes(p.id)).length)}/${num(5)}`, t('নামাজ', 'Prayers'), resolve('/prayer')],
		[num(inView(store.tasks, 'today').length), t('আজ কাজ বাকি', 'tasks today'), resolve('/tasks')],
	]);
</script>

<svelte:head><title>{t('আমালা লাইফস্টাইল', 'AMALA Lifestyle')}</title></svelte:head>

<Screen tabs>
	<div>
		<p class="small muted">{dateLabel(new Date())}</p>
		<h1 class="big">{greeting()}</h1>
	</div>

	<Card class="enter">
		<div class="stats">
			{#each stats as [value, label, href] (label)}
				<a {href}><b>{value}</b><span class="xs muted">{label}</span></a>
			{/each}
		</div>
	</Card>

	<InstallCard dismissible />

	<h2 class="section">{t('সেবাসমূহ', 'Tools')}</h2>
	<div class="tools">
		{#each tools as t, i (t.title)}
			<a href={t.href} class="tool enter" style="--i: {i + 1}">
				<span class="badge" style:background="var({t.tint})" style:color="var({t.ink})"><Icon icon={t.icon} size={22} /></span>
				<span><b>{t.title}</b><br /><span class="xs muted">{t.sub}</span></span>
			</a>
		{/each}
	</div>
</Screen>

<style>
	.tools {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}
	.tool {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: calc(var(--ui-radius) * 1.5);
		background: var(--ui-surface);
		box-shadow: var(--ui-shadow-xs);
		color: inherit;
		text-decoration: none;
		transition: transform var(--ui-dur-press) var(--ui-ease-out);
	}
	.tool:active {
		transform: scale(0.97);
	}
	.tool b {
		font-weight: 600;
	}
	.badge {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: var(--ui-radius);
	}
</style>
