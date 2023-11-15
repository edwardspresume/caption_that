<script lang="ts">
	import type { PageData } from './$types';

	import { FileDropzone } from '@skeletonlabs/skeleton';

	import { IconCopy, IconLoader2 } from '@tabler/icons-svelte';

	import { superForm } from 'sveltekit-superforms/client';

	import { ImageDescriptionSchema } from '$lib';

	export let data: PageData;

	const { enhance, form, delayed, message, errors } = superForm(data.imageForm, {
		resetForm: false,
		validators: ImageDescriptionSchema
	});

	let uploadedFileUrl: string | null = null;
	$: openAiResponse = '';

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			uploadedFileUrl = URL.createObjectURL(input.files[0]);
		}
	}

	let copied = false;

	function copyToClipboard() {
		navigator.clipboard.writeText(openAiResponse);

		copied = true;

		setTimeout(() => {
			copied = false;
		}, 1000);
	}

	$: if ($message && $message.alertType === 'success') {
		openAiResponse = $message.alertMessage;
	} else if ($message?.status === 'error') {
		openAiResponse = '';
	}

	// $: $form.description = `Create a captivating caption that highlights the key fashion elements in this image, emphasizing the style, color palette, and the mood it evokes. The caption should resonate with a fashion-forward audience and embody the essence of modern aesthetics.`;

	$: $form.description = `Please describe this image with a focus on the fashion and aesthetics`;
</script>

<main class="grid max-w-4xl gap-10 p-3 py-10 mx-auto justify-center sm:grid-cols-[auto,auto]">
	<section class="flex-1">
		<h1 class="mb-8 text-2xl text-center">Image description generator</h1>

		{#if $message && $message.alertType === 'error'}
			<p class="mb-5 text-center text-red-500">{$message.alertMessage}</p>
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
							width="150"
							height="150"
							class="block object-cover mx-auto rounded"
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

			<button type="submit" class="btn variant-filled" disabled={$delayed}>
				{#if $delayed}
					<IconLoader2 class="animate-spin" />
				{/if}

				<span> Submit </span>
			</button>
		</form>
	</section>

	{#if openAiResponse}
		<section class="flex-1">
			<h2 class="mb-8 text-2xl text-center">Response</h2>

			<div class="p-4 space-y-2 bg-gray-700 rounded max-h-[600px] overflow-hidden overflow-y-auto">
				<button class="flex gap-2" on:click={copyToClipboard}>
					{#if copied}
						Copied 👍
					{:else}
						<IconCopy />
						<span>Copy to Clipboard</span>
					{/if}
				</button>

				<p class="whitespace-pre-wrap">{openAiResponse}</p>
			</div>
		</section>
	{/if}
</main>
