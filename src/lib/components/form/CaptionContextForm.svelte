<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import { toast } from 'svelte-sonner';

	import {
		MAX_CAPTION_PROMPT_LENGTH,
		captionContextSchema,
		type CaptionContextSchema
	} from '$validations/captionContextSchema';
	import { MAX_FILE_SIZE_MB, imageValidationSchema } from '$validations/imageValidationSchema';

	import CaptionLengthSelector from '$components/form/CaptionLengthSelector.svelte';
	import SubmitButton from '$components/form/SubmitButton.svelte';
	import TextArea from '$components/form/TextArea.svelte';
	import CaptionToneSelector from './CaptionToneSelector.svelte';

	export let currentCaption = '';
	export let captionContextForm: SuperValidated<CaptionContextSchema>;

	let uploadedImageUrl: string | null = null;
	let isImageUploadInProgress = false;

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;

		if (input.files?.[0]) {
			const file = input.files[0];
			const imageValidationResult = imageValidationSchema.safeParse({ uploadedImage: file });

			if (!imageValidationResult.success) {
				const errorMessage =
					imageValidationResult.error.errors[0]?.message || 'An unexpected error occurred';

				toast.error(errorMessage);

				// Reset input to allow re-triggering upload of the same file, enabling error message display on repeated attempts.
				input.value = '';

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

	const { enhance, form, delayed, message, errors } = superForm(captionContextForm, {
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

<form method="post" use:enhance enctype="multipart/form-data" class="grid gap-8">
	<label
		class="relative grid gap-2 p-4 text-sm text-center transition-colors duration-300 border-2 border-dashed rounded-md border-foreground/30 place-content-center justify-items-center hover:bg-accent/40"
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
				(Max file size: {MAX_FILE_SIZE_MB}MB)
			</span>
		</p>

		<p class="text-muted-foreground">
			<span class="font-semibold">Privacy Notice:</span> We respect your privacy. Images uploaded are
			not saved on our servers and are only used for caption generation
		</p>
	</label>

	<div class="flex flex-col gap-8 sm:flex-row">
		<CaptionToneSelector />

		<CaptionLengthSelector />
	</div>

	<TextArea
		name="captionContext"
		label="Context (optional)"
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
