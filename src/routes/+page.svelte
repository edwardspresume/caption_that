<script lang="ts">
	import type { PageData } from './$types';

	import { Toaster, toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	import { CaptionPromptSchema, MAX_CAPTION_PROMPT_LENGTH } from '$validations/captionPromptSchema';

	import StarredTitle from '$components/StarredTitle.svelte';
	import SubmitButton from '$components/form/SubmitButton.svelte';
	import TextArea from '$components/form/TextArea.svelte';

	export let data: PageData;

	let uploadedImageUrl: string | null = null;
	let isImageUploadInProgress: boolean = false;

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

	const { enhance, form, delayed, message, errors } = superForm(data.captionPromptForm, {
		resetForm: false,
		validators: CaptionPromptSchema
	});
</script>

<Toaster />

<div class="container max-w-lg p-2">
	<header class="text-center mb-7">
		<h1 class="flex items-center justify-center gap-1 mb-3 text-2xl font-bold">
			<StarredTitle>Image Caption Creator</StarredTitle>
		</h1>

		<p class="text-muted-foreground">
			Upload your image and provide a prompt to receive a unique and descriptive caption.
		</p>
	</header>

	<form method="post" use:enhance enctype="multipart/form-data" class="grid gap-7">
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

		<TextArea
			name="captionPrompt"
			label="Caption Prompt"
			placeholder="Enter prompt here"
			bind:value={$form.prompt}
			errorMessage={$errors.prompt}
			maxlength={MAX_CAPTION_PROMPT_LENGTH}
		/>

		<SubmitButton disabled={$delayed}>Generate Caption</SubmitButton>
	</form>
</div>
