<script lang="ts">
	import { route } from '$lib/ROUTES';

	import ImageSlider from '$components/ImageSlider.svelte';
	import Button from '$components/ui/button/button.svelte';
</script>

<header
	class="space-y-4 md:grid md:grid-cols-[1fr,1.7fr] md:gap-8 md:justify-between md:items-center md:justify-items-end"
>
	<section class="space-y-4 text-center md:text-left text-pretty">
		<h1 class="text-2xl font-bold">CaptionThat - Unleash Your Creativity</h1>

		<p class="text-muted-foreground">
			Create stunning captions for your photos with CaptionThat. Let our AI do the work for you!
		</p>

		<Button href={route('/app')}>Try it out for free</Button>
	</section>

	<section>
		<ImageSlider />
	</section>
</header>
