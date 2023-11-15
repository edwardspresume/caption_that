<script lang="ts">
	import type { PageData } from './$types';

	import { FileDropzone } from '@skeletonlabs/skeleton';

	import { IconLoader2 } from '@tabler/icons-svelte';

	import { superForm } from 'sveltekit-superforms/client';

	import { ImageDescriptionSchema } from '$lib';

	export let data: PageData;

	const { enhance, form, delayed, message, errors } = superForm(data.imageForm, {
		resetForm: true,
		validators: ImageDescriptionSchema
	});

	let uploadedFile;
	let uploadedFileUrl: string | null = null;

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			uploadedFile = input.files[0];
			uploadedFileUrl = URL.createObjectURL(uploadedFile);
		}
	}

	$: $form.description = 'Please describe this image with a focus on the fashion and aesthetics';
</script>

<main class="p-2 grid h-[100vh] place-content-center mx-auto">
	<div>
		<h1 class="text-2xl text-center mb-8">Image description generator</h1>

		<form method="POST" use:enhance class="grid gap-9">
			<FileDropzone name="image" accept="image/*" on:change={handleFileUpload}>
				<svelte:fragment slot="lead">
					{#if uploadedFileUrl}
						<img
							src={uploadedFileUrl}
							alt="Uploaded Preview"
							width="200"
							height="200"
							class="object-cover block mx-auto rounded"
						/>
					{:else}
						🖼️
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="message">Upload image or drag and drop</svelte:fragment>
			</FileDropzone>

			<label class="label">
				<span>Enter prompt</span>
				<p class="text-red-500">{$errors.description ? $errors.description : ''}</p>
				<textarea
					rows="4"
					class="textarea"
					placeholder="Describe the image focusing on fashion and aesthetics..."
					bind:value={$form.description}
				/>
			</label>

			<button type="submit" class="btn variant-filled">
				{#if $delayed}
					<IconLoader2 class="animate-spin" />
				{/if}

				<span> Submit </span>
			</button>
		</form>
	</div>
</main>
