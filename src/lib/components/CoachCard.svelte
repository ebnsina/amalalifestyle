<script lang="ts">
	let {
		name,
		role,
		image,
		alt,
		bio,
		focus,
		compact = false
	}: {
		name: string;
		role: string;
		image: string;
		alt: string;
		bio: string;
		focus: string[];
		compact?: boolean;
	} = $props();
</script>

<article class="coach">
	<div class="media media--portrait media--muted">
		<img src={image} {alt} width="700" height="933" loading="lazy" decoding="async" />
	</div>

	<div class="coach__body">
		<p class="t-label">{role}</p>
		<h3 class="t-h3 coach__name">{name}</h3>

		{#if !compact}
			<p class="t-body coach__bio">{bio}</p>
			<ul class="coach__focus">
				{#each focus as item (item)}
					<li class="t-label-sm">{item}</li>
				{/each}
			</ul>
		{/if}
	</div>
</article>

<style>
	.coach__body {
		padding-top: 20px;
	}

	.coach__name {
		margin-top: 8px;
	}

	.coach__bio {
		margin-top: 14px;
		color: var(--muted);
	}

	.coach__focus {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 20px;
	}

	.coach__focus li {
		border: 1px solid var(--rule-strong);
		color: var(--muted);
		padding: 8px 12px;
	}
</style>
