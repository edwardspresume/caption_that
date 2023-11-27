<script lang="ts">
	import type { PageData } from './$types';

	import { Toaster, toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	import {
		MAX_CAPTION_PROMPT_LENGTH,
		captionContextSchema
	} from '$validations/captionContextSchema';

	import StarredTitle from '$components/StarredTitle.svelte';
	import CaptionLengthSelector from '$components/form/CaptionLengthSelector.svelte';
	import SubmitButton from '$components/form/SubmitButton.svelte';
	import TextArea from '$components/form/TextArea.svelte';
	import Button from '$components/ui/button/button.svelte';

	export let data: PageData;

	const MAX_IMAGE_SIZE_MB = 10;
	let uploadedImageUrl: string | null = null;
	let isImageUploadInProgress = false;
	let captionCopied = false;
	$: currentCaption = '';

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;

		if (input.files?.[0]) {
			const file = input.files[0];

			// Check if the image size exceeds the maximum limit
			if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
				toast.error(`Image size must be less than ${MAX_IMAGE_SIZE_MB} MB`);
				return;
			}

			isImageUploadInProgress = true;

			try {
				// Revoke the old URL if it exists
				uploadedImageUrl && URL.revokeObjectURL(uploadedImageUrl);
				uploadedImageUrl = URL.createObjectURL(file);

				// Reset caption when a new image is uploaded
				currentCaption = '';
			} catch (e) {
				toast.error('Failed to upload image. Please try again.');
			} finally {
				isImageUploadInProgress = false;
			}
		}
	}

	function copyCaptionClipboard() {
		navigator.clipboard.writeText(currentCaption);

		captionCopied = true;

		setTimeout(() => {
			captionCopied = false;
		}, 2000);
	}

	const { enhance, form, delayed, message, errors } = superForm(data.captionContextForm, {
		resetForm: false,
		validators: captionContextSchema,
		taintedMessage: null,

		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'error') {
				toast.error(alertText);
			}

			if (alertType === 'success') {
				toast.success('Caption Created! Scroll down to view 👇');
				currentCaption = alertText;
			}
		}
	});
</script>

<Toaster richColors closeButton position="top-right" />

<div class="container max-w-xl p-2 pb-8">
	<header class="mb-6 text-center">
		<h1 class="flex items-center justify-center gap-1 mb-1 text-2xl font-bold">
			<StarredTitle>Image Caption Creator</StarredTitle>
		</h1>

		<p class="text-muted-foreground">
			Upload your image to receive a unique and descriptive caption
		</p>
	</header>

	<form method="post" use:enhance enctype="multipart/form-data" class="grid gap-8">
		<label
			class="relative grid gap-2 p-4 transition-colors duration-300 border-2 border-dashed rounded-md border-foreground/30 place-content-center justify-items-center hover:bg-accent/40"
		>
			<input
				type="file"
				accept="image/*"
				name="uploadedImage"
				class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
				on:change={handleImageUpload}
			/>

			{#if isImageUploadInProgress}
				<iconify-icon icon="eos-icons:bubble-loading" class="text-5xl"></iconify-icon>
			{:else if uploadedImageUrl}
				<img
					src={uploadedImageUrl}
					alt="Uploaded Preview"
					class="object-contain border rounded-md border-foreground/10 max-h-28"
				/>
			{:else}
				<iconify-icon icon="flat-color-icons:add-image" class="text-5xl"></iconify-icon>
			{/if}

			<p>
				Upload image or drag and drop

				<span class="text-sm text-muted-foreground">
					(Max file size: {MAX_IMAGE_SIZE_MB}MB)
				</span>
			</p>
		</label>

		<CaptionLengthSelector />

		<TextArea
			name="captionContext"
			label="Context for Caption (optional)"
			placeholder={`Provide context or themes to help guide the generation of your caption. \n\nExample: Emphasis on fashion and aesthetics`}
			maxlength={MAX_CAPTION_PROMPT_LENGTH}
		/>

		<SubmitButton disabled={$delayed}>
			{#if $delayed}
				Generating...
			{:else}
				Generate Caption
			{/if}
		</SubmitButton>
	</form>

	{#if currentCaption}
		<section class="p-4 mt-10 border rounded-md" aria-live="polite">
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
