<script lang="ts">
	import Screen from '#lib/components/Screen.svelte';
	import Alert from '#lib/sinaui/ui/Alert.svelte';
	import Card from '#lib/sinaui/ui/Card.svelte';
	import Input from '#lib/sinaui/ui/Input.svelte';
	import { BANDS, bmi, bmiBand, healthyRange, type BmiBand } from '#lib/bmi.js';
	import { num, parseNum } from '#lib/format.js';
	import { name, t } from '#lib/i18n.svelte.js';
	import { store } from '#lib/store.svelte.js';

	const bandColor: Record<BmiBand, string> = { under: '--blue', normal: '--carbs', over: '--protein', obese: '--fat' };
	const LO = 15, HI = 35; // visible span of the scale
	const at = (x: number) => (Math.min(HI, Math.max(LO, x)) - LO) / (HI - LO);
	const span = (i: number) => (BANDS[i + 1]?.from ?? HI) - Math.max(LO, BANDS[i].from);

	const inches = store.profile ? Math.round(store.profile.heightCm / 2.54) : 0;
	let ft = $state(store.profile ? num(Math.floor(inches / 12)) : '');
	let inch = $state(store.profile ? num(inches % 12) : '');
	let kg = $state(store.profile ? num(store.profile.weightKg) : '');

	const nFt = $derived(parseNum(ft)), nIn = $derived(parseNum(inch || '0')), nKg = $derived(parseNum(kg));
	const heightCm = $derived((nFt * 12 + nIn) * 2.54);
	const valid = $derived(nFt >= 4 && nFt <= 7 && nIn >= 0 && nIn < 12 && nKg >= 30 && nKg <= 250);
	const value = $derived(valid ? bmi(nKg, heightCm) : null);
	const band = $derived(value === null ? null : BANDS.find((b) => b.id === bmiBand(value))!);
	const range = $derived(valid ? healthyRange(heightCm) : null);
	const numeric = { inputmode: 'decimal', autocomplete: 'off' } as const;
</script>

<Screen title={t('বিএমআই মাপুন', 'BMI check')}>
	<p class="muted">{t('উচ্চতা আর ওজন দিন। আপনার প্রোফাইল থেকে আগেই বসানো আছে, চাইলে অন্য কারও জন্যও মাপতে পারেন।', 'Enter height and weight. Yours are filled in from your profile; you can check for someone else too.')}</p>
	<div class="row">
		<Input class="grow" label={t('উচ্চতা (ফুট)', 'Height (ft)')} bind:value={ft} {...numeric}>{#snippet end()}<span class="muted">{t('ফুট', 'ft')}</span>{/snippet}</Input>
		<Input class="grow" label={t('ইঞ্চি', 'Inches')} bind:value={inch} {...numeric}>{#snippet end()}<span class="muted">{t('ইঞ্চি', 'in')}</span>{/snippet}</Input>
	</div>
	<Input label={t('ওজন', 'Weight')} bind:value={kg} {...numeric}>{#snippet end()}<span class="muted">{t('কেজি', 'kg')}</span>{/snippet}</Input>

	{#if value === null || !band || !range}
		<Alert tone="warning" title={t('ফলাফল দেখাতে আরও তথ্য লাগবে', 'Need a bit more to show a result')}>{t('উচ্চতা (৪–৭ ফুট) আর ওজন (৩০–২৫০ কেজি) ঠিকমতো লিখলে ফলাফল দেখাবে।', 'Enter a height of 4–7 ft and a weight of 30–250 kg.')}</Alert>
	{:else}
		<Card class="enter">
			<div class="result" style:--band="var({bandColor[band.id]})">
				<div class="center">
					<p class="muted">{t('আপনার বিএমআই', 'Your BMI')}</p>
					<p class="value num" aria-live="polite">{num(Math.round(value * 10) / 10)}</p>
					<span class="chip">{name(band)}</span>
				</div>

				<div class="scale" aria-hidden="true">
					<span class="marker" style:left="{at(value) * 100}%"></span>
					<div class="bands">
						{#each BANDS as b, i (b.id)}<span style:flex={span(i)} style:background="var({bandColor[b.id]})"></span>{/each}
					</div>
					<div class="names">
						{#each BANDS as b, i (b.id)}<span class="xs muted" style:flex={span(i)}>{name(b)}</span>{/each}
					</div>
				</div>

				<div class="soft">
					<p class="small muted">{t('এই উচ্চতায় স্বাভাবিক ওজন', 'Healthy weight for this height')}</p>
					<p class="range num">{num(range.min)} – {num(range.max)} {t('কেজি', 'kg')}</p>
				</div>
			</div>
		</Card>
	{/if}

	<Alert title={t('বিএমআই শুধু একটা মোটামুটি ধারণা', 'BMI is only a rough guide')}>
		{t('পেশি, বয়স বা শরীরের গঠন এতে ধরা পড়ে না। এখানে বাংলাদেশিদের জন্য উপযোগী এশীয় মাপকাঠি ব্যবহার করা হয়েছে। শিশু, গর্ভবতী বা অসুস্থ হলে ডাক্তারের পরামর্শ নিন।', 'It doesn’t account for muscle, age or body shape. It uses the Asian cut-offs, which suit people in Bangladesh. For children, pregnancy or illness, ask a doctor.')}
	</Alert>
</Screen>

<style>
	.result {
		display: grid;
		gap: 1rem;
	}
	.value {
		font-size: 3.25rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--band);
	}
	.chip {
		display: inline-block;
		padding: 0.25rem 1rem;
		border-radius: 999px;
		background: var(--band);
		color: #fff;
		font-weight: 600;
	}
	.scale {
		position: relative;
		padding-top: 14px;
	}
	.marker {
		position: absolute;
		top: 0;
		width: 0;
		height: 0;
		margin-left: -9px;
		border: 9px solid transparent;
		border-top: 12px solid var(--ui-fg);
		border-bottom: 0;
		transition: left var(--ui-dur-spring) var(--ui-ease-spring);
	}
	.bands, .names {
		display: flex;
	}
	.bands {
		height: 12px;
		border-radius: 999px;
		overflow: hidden;
	}
	.names {
		margin-top: 0.5rem;
		text-align: center;
	}
	.range {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--ui-accent);
	}
</style>
