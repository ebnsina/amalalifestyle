<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import NextUp from '$lib/components/NextUp.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import BodyTool from '$lib/components/tools/BodyTool.svelte';
	import CaloriesTool from '$lib/components/tools/CaloriesTool.svelte';
	import MealsTool from '$lib/components/tools/MealsTool.svelte';
	import OneRepMaxTool from '$lib/components/tools/OneRepMaxTool.svelte';
	import PlatesTool from '$lib/components/tools/PlatesTool.svelte';
	import type { IconName } from '$lib/icons';
	import { site } from '$lib/data/site';

	const tools = [
		{
			id: 'body',
			name: 'Body check',
			icon: 'scale' as IconName,
			blurb: 'BMI on South Asian cut-offs, your healthy weight range, waist-to-height and a body-fat estimate.',
			needs: 'Height, weight, tape optional',
			component: BodyTool
		},
		{
			id: 'calories',
			name: 'Calories & macros',
			icon: 'flame' as IconName,
			blurb: 'What you burn, what to eat for your goal, and how to split it into protein, carbs and fat.',
			needs: 'Height, weight, age, activity',
			component: CaloriesTool
		},
		{
			id: 'meals',
			name: 'Meal plan',
			icon: 'leaf' as IconName,
			blurb: 'Your macros turned into portions of ordinary food, weighted around the session that needs it.',
			needs: 'Same details as calories',
			component: MealsTool
		},
		{
			id: 'max',
			name: 'One-rep max',
			icon: 'dumbbell' as IconName,
			blurb: 'Estimate your max from a set you have already done, then read off every working weight.',
			needs: 'A weight and a rep count',
			component: OneRepMaxTool
		},
		{
			id: 'plates',
			name: 'Plate loader',
			icon: 'target' as IconName,
			blurb: 'What goes on each side of the bar. For when you are three sets deep and the maths stops working.',
			needs: 'A target weight',
			component: PlatesTool
		}
	];

	// Local state is the source of truth; the URL is kept in step so a tool
	// can be linked to.
	let openId = $state<string | null>(page.url.searchParams.get('tool'));
	const active = $derived(tools.find((t) => t.id === openId) ?? null);

	function open(id: string | null) {
		openId = id;

		const url = new URL(page.url);
		if (id) url.searchParams.set('tool', id);
		else url.searchParams.delete('tool');
		replaceState(url, {});

		if (id) queueMicrotask(() => document.getElementById('tool')?.focus());
		else scrollTo({ top: 0, behavior: 'instant' });
	}
</script>

<Seo
	title={active ? `${active.name} — App` : 'App'}
	description="Free training and nutrition tools: BMI on South Asian cut-offs, calorie and macro targets, a meal plan in local food, one-rep-max and plate loading."
	image="/images/equipment.jpg"
/>

{#if !active}
	<PageHeader
		title="Pick a tool"
		standfirst="Everything here runs in your browser from published formulas — no accounts, nothing sent anywhere, nothing stored. Your details carry across tools while the tab is open."
		image="/images/equipment.jpg"
		alt="A kettlebell, medicine ball and rope resting on a wooden box"
	/>

	<Section ruled={false}>
		<ul class="picker">
			{#each tools as t (t.id)}
				<li>
					<button type="button" class="card" onclick={() => open(t.id)}>
						<span class="icon-badge"><Icon name={t.icon} size={22} /></span>
						<span class="t-h3 card__name">{t.name}</span>
						<span class="t-body card__blurb">{t.blurb}</span>
						<span class="card__foot">
							<span class="t-label">{t.needs}</span>
							<Icon name="arrow-right" size={16} class="card__arrow" />
						</span>
					</button>
				</li>
			{/each}
		</ul>

		<p class="hint foot-note">
			These are estimates from population formulas — they describe an average person your size, not
			you. Treat them as a starting point, then adjust from what actually happens over a fortnight.
			Coaching, not medical advice.
		</p>
	</Section>
{:else}
	<div class="container tool-head">
		<button type="button" class="back t-label" onclick={() => open(null)}>
			<Icon name="arrow-right" size={13} class="back__icon" />
			All tools
		</button>

		<h1 class="t-h1 tool-head__title" id="tool" tabindex="-1">{active.name}</h1>

		<nav class="switch" aria-label="Tools">
			{#each tools as t (t.id)}
				<button
					type="button"
					class="switch__btn t-label-sm"
					class:is-on={t.id === active.id}
					aria-current={t.id === active.id ? 'page' : undefined}
					onclick={() => open(t.id)}>{t.name}</button
				>
			{/each}
		</nav>
	</div>

	<Section ruled={false}>
		<p class="t-label">{active.needs}</p>
		<active.component />
	</Section>
{/if}

<NextUp />

<CtaBand
	title="Numbers are easy. Twelve weeks is the hard part."
	body="Bring your figures to a free first session and we will tell you which of them matter for you and which to ignore."
	primary={{ href: '/contact', text: 'Book a free session' }}
	secondary={{ href: '/nutrition', text: 'Nutrition' }}
	image="/images/nutrition-prep.jpg"
/>

<style>
	.picker {
		display: grid;
		gap: 12px;
	}

	@media (min-width: 660px) {
		.picker {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1060px) {
		.picker {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
		width: 100%;
		height: 100%;
		text-align: left;
		background: var(--paper);
		border: 1px solid var(--rule);
		padding: 26px 24px 24px;
		cursor: pointer;
		transition: border-color 200ms ease;
	}

	.card:hover,
	.card:focus-visible {
		border-color: var(--rule-strong);
	}

	.card__name {
		margin-top: 20px;
	}

	.card__blurb {
		margin-top: 10px;
		color: var(--muted);
	}

	.card__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		width: 100%;
		margin-top: auto;
		padding-top: 24px;
	}

	.card :global(.card__arrow) {
		color: var(--faint);
		transition:
			transform 160ms ease,
			color 160ms ease;
	}

	.card:hover :global(.card__arrow) {
		color: var(--ink);
		transform: translateX(4px);
	}

	.foot-note {
		margin-top: 28px;
		max-width: 72ch;
	}

	.tool-head {
		padding-block: clamp(40px, 5vw, 64px) 0;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		color: var(--muted);
	}

	.back:hover {
		color: var(--ink);
	}

	.back :global(.back__icon) {
		transform: rotate(180deg);
	}

	.tool-head__title {
		margin-top: 22px;
	}

	.tool-head__title:focus {
		outline: none;
	}

	.switch {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 32px;
	}

	.switch__btn {
		height: 42px;
		padding-inline: 16px;
		border: 1px solid var(--rule-strong);
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	.switch__btn:hover {
		border-color: var(--ink);
		color: var(--ink);
	}

	.switch__btn.is-on {
		background: var(--lime);
		border-color: var(--lime);
		color: #0b0b0d;
	}

	.hint {
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}
</style>
