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

	let uploadedImageUrl: string | null = null;
	let isImageUploadInProgress = false;
	let captionCopied = false;
	$: generatedCaption = '';

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;

		if (input.files?.[0]) {
			const file = input.files[0];

			isImageUploadInProgress = true;

			try {
				// Revoke the old URL if it exists
				uploadedImageUrl && URL.revokeObjectURL(uploadedImageUrl);
				uploadedImageUrl = URL.createObjectURL(file);
			} catch (e) {
				toast.error('Failed to upload image. Please try again.');
			} finally {
				isImageUploadInProgress = false;
			}
		}
	}

	function copyCaptionClipboard() {
		navigator.clipboard.writeText(generatedCaption);

		captionCopied = true;

		setTimeout(() => {
			captionCopied = false;
		}, 1000);
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
				toast.success('Caption Created!');
				generatedCaption = alertText;
			}
		}
	});
</script>

<Toaster richColors closeButton />

<div class="container max-w-xl p-2 pb-10">
	<section>
		<header class="text-center mb-7">
			<h1 class="flex items-center justify-center gap-1 mb-3 text-2xl font-bold">
				<StarredTitle>Image Caption Creator</StarredTitle>
			</h1>

			<p class="text-muted-foreground">
				Upload your image to receive a unique and descriptive caption.
			</p>
		</header>

		<form method="post" use:enhance enctype="multipart/form-data" class="grid gap-8">
			<label
				class="relative grid gap-2 p-4 transition-colors duration-300 border-2 border-dashed rounded-lgborder-foreground/30 place-content-center justify-items-center hover:bg-accent/40"
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
						class="object-cover border rounded border-foreground/10 max-h-28"
					/>
				{:else}
					<iconify-icon icon="flat-color-icons:add-image" class="text-5xl"></iconify-icon>
				{/if}

				<p>Upload image or drag and drop</p>
			</label>

			<CaptionLengthSelector />

			<TextArea
				name="captionContext"
				rows="4"
				label="Context for Caption (optional)"
				placeholder={`Provide context or themes to help guide the generation of your caption. \n\nExample: Emphasis on fashion and aesthetics`}
				maxlength={MAX_CAPTION_PROMPT_LENGTH}
			/>

			<SubmitButton disabled={$delayed}>Generate Caption</SubmitButton>
		</form>
	</section>

	{#if generatedCaption}
		<section class="p-5 mt-10 border rounded-md">
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-xl font-bold text-center">Caption</h2>

				<Button class="flex items-center gap-1" on:click={copyCaptionClipboard}>
					{#if captionCopied}
						Copied 👍
					{:else}
						<iconify-icon icon="akar-icons:copy" class="text-lg"></iconify-icon>
						<span>Copy to Clipboard</span>
					{/if}
				</Button>
			</div>

			<p class="p-4 space-y-5 bg-accent rounded max-h-[400px] overflow-hidden overflow-y-auto">
				{generatedCaption}
			</p>
		</section>
	{/if}
</div>
