<script lang="ts">
	import type { PageData } from './$types';

	import SubmitButton from '$components/form/SubmitButton.svelte';
	import TextArea from '$components/form/TextArea.svelte';
	import StarredTitle from '$components/StarredTitle.svelte';

	export let data: PageData;
</script>

<div class="container max-w-lg p-2">
	<header class="text-center mb-7">
		<h1 class="flex items-center justify-center gap-1 mb-3 text-2xl font-bold">
			<StarredTitle>Image Caption Creator</StarredTitle>
		</h1>

		<p class="text-muted-foreground">
			Upload your image and provide a prompt to receive a unique and descriptive caption.
		</p>
	</header>

	<form method="post" enctype="multipart/form-data" class="grid gap-7">
		<label
			class="relative grid gap-2 p-4 transition-colors duration-300 border-2 border-dashed rounded-lg border-foreground/30 place-content-center justify-items-center hover:bg-accent/40"
		>
			<input
				type="file"
				accept="image/*"
				name="uploadedImage"
				class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
			/>

			<iconify-icon icon="flat-color-icons:add-image" class="text-5xl"></iconify-icon>

			<p>Upload image or drag and drop</p>
		</label>

		<TextArea name="captionPrompt" label="Caption Prompt" placeholder="Enter prompt here" />

		<SubmitButton>Generate Caption</SubmitButton>
	</form>
</div>
