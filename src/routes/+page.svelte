<script lang="ts">
	import type { PageData } from './$types';

	import { FileDropzone, clipboard } from '@skeletonlabs/skeleton';

	import { IconCopy, IconLoader2 } from '@tabler/icons-svelte';

	import { superForm } from 'sveltekit-superforms/client';

	import { ImageDescriptionSchema } from '$lib';

	export let data: PageData;

	const { enhance, form, delayed, message, errors } = superForm(data.imageForm, {
		resetForm: false,
		validators: ImageDescriptionSchema
	});

	let uploadedFile;
	let uploadedFileUrl: string | null = null;
	$: openAiResponse = '';

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			uploadedFile = input.files[0];
			uploadedFileUrl = URL.createObjectURL(uploadedFile);
		}
	}

	$: if ($message && $message.alertType === 'success') {
		openAiResponse = $message.alertMessage;
	} else if ($message?.status === 'error') {
		openAiResponse = '';
	}

	// $: $form.description = `Create a captivating caption that highlights the key fashion elements in this image, emphasizing the style, color palette, and the mood it evokes. The caption should resonate with a fashion-forward audience and embody the essence of modern aesthetics.`;
	
	$: $form.description = `Please describe this image with a focus on the fashion and aesthetics`;
</script>

<main class="p-2 grid h-[100vh] place-content-center w-full">
	<div class="max-w-4xl flex flex-col md:flex-row gap-10">
		<section class="flex-1">
			<h1 class="text-2xl text-center mb-8">Image description generator</h1>

			{#if $message && $message.alertType === 'error'}
				<p class="text-center text-red-500 mb-5">{$message.alertMessage}</p>
			{/if}

			<form method="POST" use:enhance class="grid gap-9">
				<FileDropzone
					name="image"
					accept="image/*"
					enctype="multipart/form-data"
					on:change={handleFileUpload}
				>
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
						rows="8"
						class="textarea"
						name="description"
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
		</section>

		{#if openAiResponse}
			<section class="flex-1">
				<h2 class="text-2xl text-center mb-8">Response</h2>

				<div class="bg-gray-700 p-4 rounded shadow space-y-2">
					<button class="flex gap-2" use:clipboard={openAiResponse}>
						<IconCopy />
						<span>Copy to Clipboard</span>
					</button>

					<p class="whitespace-pre-wrap">{openAiResponse}</p>
				</div>
			</section>
		{/if}
	</div>
</main>
