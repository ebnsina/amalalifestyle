<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import {
		enquiryGoals,
		validateEnquiry,
		type EnquiryErrors
	} from '$lib/schemas/enquiry';

	let { form } = $props();

	let submitting = $state(false);
	let clientErrors = $state<EnquiryErrors>({});

	// Server issues win on first paint; typing then hands over to the client.
	const errors = $derived({ ...(form?.errors ?? {}), ...clientErrors });

	// Same schema as the action, so a message can never drift between the two.
	function checkBeforeSubmit(formEl: HTMLFormElement) {
		const { errors: found } = validateEnquiry(Object.fromEntries(new FormData(formEl)));
		clientErrors = found ?? {};
		return !found;
	}

	const details = [
		{ icon: 'pin' as const, label: 'Gym', value: site.addressLines.join(', ') },
		{
			icon: 'clock' as const,
			label: 'Hours',
			value: site.hours.map(([d, t]) => `${d} ${t}`).join(' · ')
		},
		{ icon: 'mail' as const, label: 'Email', value: site.email, href: `mailto:${site.email}` },
		{
			icon: 'phone' as const,
			label: 'Phone',
			value: site.phone,
			href: `tel:${site.phone.replace(/\s/g, '')}`
		},
		{
			icon: 'whatsapp' as const,
			label: 'WhatsApp',
			value: site.whatsapp,
			href: 'https://wa.me/8801712345678'
		}
	];
</script>

<Seo
	title="Contact"
	description="Book a free first session at Amala Lifestyle in Dhaka. Ninety minutes, nothing to sign, no sales pitch."
	image="/images/studio.jpg"
/>

<PageHeader
	title="Book the first session"
	standfirst="Ninety minutes, free, and nothing to sign at the end. Tell us roughly where you are now and we will come back within one working day."
	image="/images/studio.jpg"
	alt="The training floor at Amala Lifestyle, set up and empty before a session"
/>

<Section ruled={false}>
	<div class="contact">
		<div class="contact__form">
			{#if form?.sent}
				<div class="sent">
					<span class="icon-badge icon-badge--solid"><Icon name="check" size={30} /></span>
					<h2 class="t-h3 sent__title">Thanks — that reached us.</h2>
					<p class="t-body sent__body">
						We will reply within one working day. If it is urgent, call the gym on
						<a href="tel:{site.phone.replace(/\s/g, '')}" class="sent__link t-num">{site.phone}</a>.
					</p>
				</div>
			{:else}
				<form
					method="POST"
					novalidate
					onsubmit={(e) => {
						if (!checkBeforeSubmit(e.currentTarget)) e.preventDefault();
					}}
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<!-- Honeypot: hidden from people, irresistible to bots. -->
					<div class="honeypot" aria-hidden="true">
						<label for="company">Company</label>
						<input id="company" name="company" type="text" tabindex="-1" autocomplete="off" />
					</div>

					<div class="field-group">
						<label class="t-label" for="name">Name</label>
						<input
							class="field"
							id="name"
							name="name"
							type="text"
							autocomplete="name"
							required
							value={form?.values?.name ?? ''}
							aria-invalid={errors.name ? 'true' : undefined}
							aria-describedby={errors.name ? 'name-error' : undefined}
						/>
						{#if errors.name}
							<p class="error" id="name-error">{errors.name}</p>
						{/if}
					</div>

					<div class="field-group">
						<label class="t-label" for="email">Email</label>
						<input
							class="field"
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							value={form?.values?.email ?? ''}
							aria-invalid={errors.email ? 'true' : undefined}
							aria-describedby={errors.email ? 'email-error' : undefined}
						/>
						{#if errors.email}
							<p class="error" id="email-error">{errors.email}</p>
						{/if}
					</div>

					<fieldset class="field-group">
						<legend class="t-label">What are you after</legend>
						<div class="goals">
							{#each enquiryGoals as [value, label] (value)}
								<label class="goal">
									<input
										type="radio"
										name="goal"
										{value}
										checked={form?.values?.goal === value}
										required
									/>
									<span class="t-label-sm goal__text">{label}</span>
								</label>
							{/each}
						</div>
						{#if errors.goal}
							<p class="error">{errors.goal}</p>
						{/if}
					</fieldset>

					<div class="field-group">
						<label class="t-label" for="message">Anything we should know</label>
						<textarea
							class="field"
							id="message"
							name="message"
							rows="5"
							placeholder="Injuries, how many days a week you can train, what you have tried before."
							aria-describedby={errors.message ? 'message-error' : undefined}
							>{form?.values?.message ?? ''}</textarea
						>
						{#if errors.message}
							<p class="error" id="message-error">{errors.message}</p>
						{/if}
					</div>

					<div class="submit">
						<Button type="submit" variant="solid" arrow disabled={submitting}>
							{submitting ? 'Sending' : 'Send enquiry'}
						</Button>
						<p class="t-label submit__note">We reply within one working day</p>
					</div>
				</form>
			{/if}
		</div>

		<aside class="contact__details">
			<dl>
				{#each details as d (d.label)}
					<div class="detail">
						<dt class="t-label detail__term">
							<Icon name={d.icon} size={13} />
							{d.label}
						</dt>
						<dd class="detail__value">
							{#if d.href}
								<a href={d.href} class="detail__link">{d.value}</a>
							{:else}
								{d.value}
							{/if}
						</dd>
					</div>
				{/each}
			</dl>

			<p class="t-body detail__note">
				Sessions are booked in advance. Walk in during opening hours and someone will show you
				around, but the assessment needs a slot.
			</p>
		</aside>
	</div>
</Section>

<style>
	.contact {
		display: grid;
		gap: 56px;
	}

	@media (min-width: 980px) {
		.contact {
			grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
			gap: 80px;
		}
	}

	.contact__form {
		max-width: 46rem;
	}

	.field-group {
		display: grid;
		gap: 10px;
		margin-bottom: 28px;
		border: 0;
		padding: 0;
	}

	.goals {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 4px;
	}

	.goal {
		position: relative;
		display: inline-flex;
	}

	.goal input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		margin: 0;
	}

	.goal__text {
		display: inline-flex;
		align-items: center;
		height: 44px;
		padding-inline: 18px;
		border: 1px solid var(--rule-strong);
		color: var(--muted);
		transition:
			border-color 160ms ease,
			background-color 160ms ease,
			color 160ms ease;
	}

	.goal input:hover + .goal__text {
		border-color: var(--ink);
		color: var(--ink);
	}

	/* Selected is a lime fill, the same fill the primary button uses. */
	.goal input:checked + .goal__text {
		background: var(--sun);
		border-color: var(--sun);
		color: var(--ink);
	}

	.goal input:focus-visible + .goal__text {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}

	textarea.field {
		resize: vertical;
		line-height: 1.6;
	}

	/* Errors carry no hue — the system has none to spend. A hairline marker and
	   mono type is enough to separate them from help text. */
	.error {
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 1.5;
		letter-spacing: 0.04em;
		color: var(--ink);
		border-left: 2px solid var(--ink);
		padding-left: 10px;
	}

	.submit {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 20px;
		margin-top: 8px;
	}

	.submit__note {
		margin: 0;
	}

	.honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.sent {
		background: var(--paper);
		border: 1px solid var(--rule);
		padding: 40px 36px 44px;
		max-width: 42ch;
	}

	.sent__title {
		margin-top: 20px;
	}

	.sent__body {
		margin-top: 12px;
		color: var(--muted);
	}

	.sent__link {
		color: var(--ink);
		border-bottom: 1px solid var(--rule-strong);
	}

	.detail {
		padding-block: 20px;
		border-top: 1px solid var(--rule);
	}

	.detail:last-of-type {
		border-bottom: 1px solid var(--rule);
	}

	.detail__term {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.detail__value {
		margin-top: 8px;
		font-size: 15px;
	}

	.detail__link {
		color: var(--ink);
		border-bottom: 1px solid var(--rule-strong);
		transition: border-color 160ms ease;
	}

	.detail__link:hover {
		border-bottom-color: var(--ink);
	}

	.detail__note {
		margin-top: 24px;
		color: var(--muted);
	}
</style>
