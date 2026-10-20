<script lang="ts">
	import {
		ArrowRight01Icon, Database01Icon, FavouriteIcon, InformationCircleIcon, PencilEdit02Icon, UserIcon,
	} from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Button from '#lib/sinaui/ui/Button.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Icon from '#lib/sinaui/ui/Icon.svelte';
	import { num } from '#lib/format.js';
	import { activityOptions, goalOptions } from '#lib/labels.js';
	import { dailyTarget } from '#lib/nutrition.js';
	import InstallCard from '#lib/components/InstallCard.svelte';
	import LangSwitch from '#lib/components/LangSwitch.svelte';
	import ThemeSwitch from '#lib/components/ThemeSwitch.svelte';
	import { i18n, name, t } from '#lib/i18n.svelte.js';
	import { phonetic, setPhonetic } from '#lib/phonetic.svelte.js';
	import Switch from '#lib/sinaui/ui/Switch.svelte';
	import { store } from '#lib/store.svelte.js';

	const menu = $derived([
		{ href: resolve('/favourites'), icon: FavouriteIcon, title: t('প্রিয় খাবার', 'Favourite foods'), sub: t('যেগুলোতে ♡ দিয়েছেন', 'The ones you’ve ♡’d') },
		{ href: resolve('/data'), icon: Database01Icon, title: t('ব্যাকআপ ও ফিরিয়ে আনা', 'Backup & restore'), sub: t('ফোনে ফাইল হিসেবে সেভ করুন', 'Save everything as a file') },
		{ href: resolve('/about'), icon: InformationCircleIcon, title: t('অ্যাপ সম্পর্কে', 'About'), sub: t('গোপনীয়তা ও নির্মাতা', 'Privacy and who made it') },
	]);

	const p = $derived(store.profile!);
	const goal = $derived(goalOptions.find((g) => g.id === p.goal)!);
	const activity = $derived(activityOptions.find((a) => a.id === p.activity)!);
	const stats = $derived([
		[t('বয়স', 'Age'), `${num(p.age)} ${t('বছর', 'yrs')}`],
		[t('উচ্চতা', 'Height'), `${num(Math.floor(p.heightCm / 30.48))}' ${num(Math.round((p.heightCm / 2.54) % 12))}"`],
		[t('ওজন', 'Weight'), `${num(p.weightKg)} ${t('কেজি', 'kg')}`],
	]);
</script>

<svelte:head><title>{t('প্রোফাইল', 'Profile')} · {t('আমালা', 'AMALA')}</title></svelte:head>

<Screen tabs>
	<div class="head">
		<span class="avatar"><Icon icon={UserIcon} size={32} /></span>
		<h1 class="big">{goal.emoji} {name(goal)}</h1>
	</div>

	<div class="row">
		{#each stats as [k, v] (k)}
			<Card class="grow center"><b class="num">{v}</b><br /><span class="small muted">{k}</span></Card>
		{/each}
	</div>

	<div class="hero">
		<p class="small">{t('আপনার দিনের আনুমানিক লক্ষ্য', 'Your estimated daily target')}</p>
		<p class="target heading">{num(dailyTarget(p))} <span>{t('ক্যালরি', 'kcal')}</span></p>
	</div>

	<Card>
		<dl>
			<dt class="muted">{t('কাজকর্ম', 'Activity')}</dt><dd>{activity.emoji} {name(activity)}</dd>
			<dt class="muted">{t('দিনে খান', 'Meals a day')}</dt><dd>{num(p.mealsPerDay)} {t('বার', '')}</dd>
		</dl>
	</Card>

	<div class="actions"><Button variant="secondary" href={resolve('/onboarding')}><Icon icon={PencilEdit02Icon} size={18} /> {t('তথ্য বদলান', 'Edit details')}</Button></div>

	<InstallCard />

	<Card>
		<div class="prefs">
			<LangSwitch />
			{#if i18n.lang === 'bn'}
				<div>
					<Switch bind:checked={() => phonetic.on, setPhonetic}>ইংরেজি কিবোর্ডে বাংলা লিখুন</Switch>
					<p class="xs muted hint">যেমন “ami bhalo achi” লিখে স্পেস দিলে হবে “আমি ভালো আছি”। ইংরেজি শব্দ রাখতে চাইলে বন্ধ করুন।</p>
				</div>
			{/if}
			<ThemeSwitch />
		</div>
	</Card>

	<Card>
		{#each menu as m (m.title)}
			<a href={m.href} class="item">
				<span class="avatar small-avatar"><Icon icon={m.icon} size={20} /></span>
				<span class="grow"><b>{m.title}</b><br /><span class="small muted">{m.sub}</span></span>
				<Icon icon={ArrowRight01Icon} size={20} />
			</a>
		{/each}
	</Card>

	<Alert title={t('ডাক্তারের পরামর্শ', 'Medical advice')}>
		{t('এই হিসাব একটি প্রচলিত সূত্র থেকে আন্দাজ করা। গর্ভাবস্থা, ডায়াবেটিস, কিডনি বা অন্য কোনো অসুখ থাকলে ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।', 'This target is estimated with a standard formula. If you are pregnant, or have diabetes, kidney disease or another condition, follow your doctor or dietitian.')}
	</Alert>
</Screen>

<style>
	.hint {
		margin-top: 0.25rem;
	}
	.prefs {
		display: grid;
		gap: 1rem;
	}
	.head {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		padding-top: 1rem;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--ui-accent);
	}
	.small-avatar {
		width: 40px;
		height: 40px;
	}
	.target {
		font-size: 2rem;
		font-weight: 600;
	}
	.target span {
		font-size: 1rem;
		font-weight: 400;
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		margin: 0;
	}
	dt, dd {
		margin: 0;
		padding: 0.75rem 0;
	}
	dd {
		text-align: end;
		font-weight: 600;
	}
	dt + dd ~ dt, dt + dd ~ dt + dd {
		border-top: 1px solid var(--line);
	}
	.item {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-height: 64px;
		color: inherit;
		text-decoration: none;
	}
	.item + .item {
		border-top: 1px solid var(--line);
	}
	.item b {
		font-weight: 600;
	}
</style>
