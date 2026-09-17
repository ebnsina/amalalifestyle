<script lang="ts">
	let { href = '/', tone = 'ink' }: { href?: string; tone?: 'ink' | 'light' } = $props();
</script>

<a class="wordmark" class:wordmark--light={tone === 'light'} {href} aria-label="Amala Lifestyle — home">
	<span class="wordmark__badge" aria-hidden="true">A</span>
	<span class="wordmark__text">
		<span class="wordmark__name">Amala</span>
		<span class="wordmark__suffix">Lifestyle</span>
	</span>
</a>

<style>
	.wordmark {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: var(--ink);
	}

	.wordmark--light {
		color: var(--band-ink);
	}

	.wordmark__badge {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: var(--r-pill);
		background: var(--ember);
		color: var(--ember-ink);
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 17px;
		line-height: 1;
	}

	.wordmark__text {
		display: flex;
		align-items: baseline;
		gap: 0.36em;
		font-family: var(--font-display);
		font-size: 19px;
		letter-spacing: -0.024em;
	}

	.wordmark__name {
		font-weight: 800;
	}

	.wordmark__suffix {
		font-weight: 400;
		color: var(--muted);
	}

	.wordmark--light .wordmark__suffix {
		color: rgb(250 247 241 / 0.66);
	}
</style>
