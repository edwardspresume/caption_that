<script lang="ts">
	import { currentCaption } from './CaptionCreationForm.svelte';

	import { MAX_FILE_SIZE_MB } from '$validations/captionFormZodSchema';

	export let chosenImageFile: File | null = null;
	export let errorMessage: object | undefined = undefined;

	let uploadedImageUrl: string | null = null;

	$: if (errorMessage) {
		uploadedImageUrl = null;
	}

	function handleImageUpload(event: Event) {
		const input = event.currentTarget as HTMLInputElement | null;

		chosenImageFile = input?.files?.item(0) as File;

		// Revoke the old URL if it exists
		if (uploadedImageUrl) {
			URL.revokeObjectURL(uploadedImageUrl);
		}

		uploadedImageUrl = URL.createObjectURL(chosenImageFile);

		// Reset caption when a new image is uploaded
		$currentCaption = '';
	}
</script>

<fieldset class="space-y-2">
	<label
		class="relative grid aspect-[2/1] place-content-center justify-items-center gap-2 rounded-md border-2 border-dashed border-foreground/30 p-4 text-center text-sm transition-colors duration-300 hover:bg-accent/40"
	>
		<input
			type="file"
			name="image"
			accept="image/*"
			on:input={handleImageUpload}
			data-testId="file-drop-zone-input"
			aria-invalid={errorMessage ? 'true' : undefined}
			class="absolute top-0 left-0 opacity-0 cursor-pointer size-full"
		/>

		{#if uploadedImageUrl}
			<img
				src={uploadedImageUrl}
				alt="Uploaded Preview"
				class="absolute top-0 left-0 object-contain border rounded-md size-full border-foreground/10"
			/>
		{:else}
			<iconify-icon icon="flat-color-icons:add-image" class="text-5xl"></iconify-icon>

			<p>
				Upload image or drag and drop

				<span class="text-sm text-muted-foreground">
					(Max file size: {MAX_FILE_SIZE_MB}MB)
				</span>
			</p>
		{/if}
	</label>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}
</fieldset>
