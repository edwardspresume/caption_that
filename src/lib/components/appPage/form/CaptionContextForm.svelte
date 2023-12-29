<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import { toast } from 'svelte-sonner';

	import { currentCaption } from '$lib/store';

	import {
		MAX_CAPTION_PROMPT_LENGTH,
		captionContextSchema,
		type CaptionContextSchemaType
	} from '$validations/captionContextSchema';

	import CaptionLengthSelector from '$components/appPage/form/CaptionLengthSelector.svelte';
	import SubmitButton from '$components/appPage/form/SubmitButton.svelte';
	import TextArea from '$components/appPage/form/TextArea.svelte';
	import CaptionToneSelector from './CaptionToneSelector.svelte';
	import FileDropZone from './FileDropZone.svelte';

	export let captionContextForm: SuperValidated<CaptionContextSchemaType>;

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
				$currentCaption = alertText;

				toast.success('Caption Created!');
			}
		}
	});
</script>

<form method="post" use:enhance enctype="multipart/form-data" class="grid gap-8">
	<FileDropZone />

	<div class="flex flex-col gap-8 sm:flex-row">
		<CaptionToneSelector bind:value={$form.captionTone} errorMessage={$errors.captionTone} />

		<CaptionLengthSelector bind:value={$form.captionLength} errorMessage={$errors.captionLength} />
	</div>

	<TextArea
		name="captionContext"
		label="Context (optional)"
		bind:value={$form.captionContext}
		errorMessage={$errors.captionContext}
		placeholder={`Provide context or themes to help guide the generation of your caption. \n\nExample: Emphasis on fashion and aesthetics, or no hashtags`}
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
