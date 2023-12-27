<script lang="ts">
	import { route } from '$lib/ROUTES';

	import Button from '$components/ui/button/button.svelte';

	import src from '$lib/assets/4.jpg';
</script>

<header
	class="space-y-4 md:grid md:grid-cols-[1fr,2fr] md:gap-8 md:justify-between md:items-center md:justify-items-end"
>
	<section class="space-y-4 text-center md:text-left text-pretty">
		<h1 class="text-2xl font-bold">CaptionThat - Unleash Your Creativity</h1>

		<p class="text-muted-foreground">
			Create stunning captions for your photos with CaptionThat. Let our AI do the work for you!
		</p>

		<Button href={route('/app')}>Try it out for free</Button>
	</section>

	<section>
		<figure>
			<img
				{src}
				alt="Some alt text"
				class="object-cover rounded-md w-[900px] h-[700px]"
				width="600"
				height="600"
			/>

			<figcaption
				class="block p-2 mx-auto mt-4 italic font-medium text-center rounded bg-accent w-fit"
			>
				Time of my life with my best friends
			</figcaption>
		</figure>
	</section>
</header>
