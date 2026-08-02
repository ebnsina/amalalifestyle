<script lang="ts">
	import Button from './Button.svelte';

	let email = $state('');
	let done = $state(false);

	function submit(event: SubmitEvent) {
		event.preventDefault();
		// TODO: connect to the gym's mailing list provider. Nothing is sent yet.
		done = true;
	}
</script>

<section class="signup">
	<div class="container">
		<div class="signup__grid">
			<div>
				<p class="t-label">Once a month</p>
				<h2 class="t-h2 signup__title">One email. No hype.</h2>
				<p class="t-body signup__body">
					A short note with one training idea, one thing to eat and whatever we changed on the
					timetable. Unsubscribe in a click.
				</p>
			</div>

			{#if done}
				<p class="t-body signup__done">
					You are on the list. The next one goes out at the start of the month.
				</p>
			{:else}
				<form class="signup__form" onsubmit={submit}>
					<label class="t-label" for="signup-email">Email address</label>
					<div class="signup__row">
						<input
							class="field"
							id="signup-email"
							type="email"
							name="email"
							required
							placeholder="you@example.com"
							bind:value={email}
						/>
						<Button type="submit" variant="solid" arrow>Sign up</Button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</section>

<style>
	.signup {
		background: var(--surface);
		padding-block: clamp(48px, 6vw, 80px);
	}

	.signup__grid {
		display: grid;
		gap: 32px;
		align-items: center;
	}

	@media (min-width: 900px) {
		.signup__grid {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 64px;
		}
	}

	.signup__title {
		margin-top: 16px;
	}

	.signup__body {
		margin-top: 14px;
		color: var(--muted);
	}

	.signup__form {
		display: grid;
		gap: 10px;
	}

	.signup__row {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.signup__row .field {
		flex: 1 1 240px;
		background: var(--paper);
	}

	.signup__done {
		color: var(--muted);
	}
</style>
