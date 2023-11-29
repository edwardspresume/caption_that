<script lang="ts">
	import type { PageData } from './$types';

	import StarredTitle from '$components/StarredTitle.svelte';
	import CaptionContextForm from '$components/form/CaptionContextForm.svelte';
	import Button from '$components/ui/button/button.svelte';

	export let data: PageData;

	let currentCaption = '';
	let captionCopied = false;
	let captionSectionRef: HTMLElement;

	$: if (currentCaption && captionSectionRef) {
		captionSectionRef.scrollIntoView();
	}

	function copyCaptionClipboard() {
		navigator.clipboard.writeText(currentCaption);

		captionCopied = true;

		setTimeout(() => {
			captionCopied = false;
		}, 2000);
	}
</script>

<div class="container max-w-xl p-2 pb-8">
	<header class="mb-5 text-center">
		<h1 class="flex items-center justify-center gap-1 mb-1 text-2xl font-bold">
			<StarredTitle>Image Caption Creator</StarredTitle>
		</h1>

		<p class="text-muted-foreground">
			Upload your image to receive a unique and descriptive caption
		</p>
	</header>

	<CaptionContextForm captionContextForm={data.captionContextForm} bind:currentCaption />

	{#if currentCaption}
		<section class="p-4 mt-10 border rounded-md" aria-live="polite" bind:this={captionSectionRef}>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-xl font-bold">Caption</h2>

				<Button class="flex items-center gap-1" on:click={copyCaptionClipboard}>
					{#if captionCopied}
						Copied 👍
					{:else}
						<iconify-icon icon="akar-icons:copy" class="text-lg"></iconify-icon>
						<span>Copy to Clipboard</span>
					{/if}
				</Button>
			</div>

			<p class="p-3 bg-accent rounded-md max-h-[400px] shadow-md overflow-hidden overflow-y-auto">
				{currentCaption}
			</p>
		</section>
	{/if}
</div>
