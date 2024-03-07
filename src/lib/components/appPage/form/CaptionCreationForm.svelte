<script context="module">
	import { writable } from 'svelte/store';

	export const currentCaption = writable('');
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import {
		MAX_CAPTION_PROMPT_LENGTH,
		captionFormZodSchema,
		type CaptionFormZodSchemaType
	} from '$validations/captionFormZodSchema';

	import CaptionLengthSelector from './CaptionLengthSelector.svelte';
	import CaptionToneSelector from './CaptionToneSelector.svelte';
	import FileDropZone from './FileDropZone.svelte';
	import SubmitButton from './SubmitButton.svelte';
	import TextArea from './TextArea.svelte';

	export let captionCreationForm: SuperValidated<Infer<CaptionFormZodSchemaType>>;

	let previousImage: File;

	const { enhance, form, delayed, message, errors } = superForm(captionCreationForm, {
		resetForm: false,
		validators: zodClient(captionFormZodSchema),

		onResult: ({ result }) => {
			if (result.type === 'success' && $form.image) {
				previousImage = $form.image;
			}
		},

		onUpdated: () => {
			if (previousImage) $form.image = previousImage;

			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'error') {
				toast.error(alertText);
			}

			if (alertType === 'success') {
				$currentCaption = alertText;

				toast.success('Caption Created!');
			}
		}
	});
</script>

<form method="post" use:enhance enctype="multipart/form-data" class="grid gap-8">
	<FileDropZone bind:chosenImageFile={$form.image} errorMessage={$errors.image} />

	<div class="flex flex-col gap-8 sm:flex-row">
		<CaptionToneSelector bind:value={$form.captionTone} errorMessage={$errors.captionTone} />

		<CaptionLengthSelector bind:value={$form.captionLength} errorMessage={$errors.captionLength} />
	</div>

	<TextArea
		name="captionContext"
		label="Context"
		bind:value={$form.captionPrompt}
		errorMessage={$errors.captionPrompt}
		placeholder={`Provide context or themes to help guide the generation of your caption. \n\nExample: Emphasis on fashion and aesthetics, or no hashtags`}
		maxlength={MAX_CAPTION_PROMPT_LENGTH}
	>
		<svelte:fragment slot="label">
			Context <span class="text-muted-foreground">(optional)</span>
		</svelte:fragment>
	</TextArea>

	<SubmitButton disabled={$delayed}>
		{#if $delayed}
			Generating...
		{:else}
			Generate Caption
		{/if}
	</SubmitButton>
</form>
