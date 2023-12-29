<script lang="ts">
	import { route } from '$lib/ROUTES';

	import ImageCarousel from '$components/ImageCarousel.svelte';
	import Button from '$components/ui/button/button.svelte';

	import demoVideo from '$lib/assets/demo_video.mp4';
</script>

<main class="container flex-1 p-2 pb-14 space-y-14 md:-mt-5">
	<header
		class="space-y-6 md:grid md:grid-cols-[1fr,1.7fr] md:gap-8 md:justify-between md:items-center md:justify-items-end sm:h-[100dvh]"
	>
		<section class="space-y-6 text-center md:text-left text-pretty">
			<h1 class="text-2xl font-bold">CaptionThat - Unleash Your Creativity</h1>

			<h2 class="space-x-3 text-xl">
				<span>📸 Snap It.</span>

				<span>📝 Caption It.</span>

				<span>🚀 Share It.</span>
			</h2>

			<p class="text-muted-foreground">
				Create stunning captions for your photos with CaptionThat. Let our AI do the work for you!
			</p>

			<Button href={route('/dashboard')}>Try it out for free</Button>
		</section>

		<ImageCarousel />
	</header>

	<section>
		<h2 class="mb-6 text-2xl font-bold text-center">How it works</h2>

		<div class="space-y-6 md:grid md:grid-cols-[2fr,1fr] md:gap-8 md:items-center">
			<div class="order-2 space-y-3 md:text-xl">
				<h3>
					Step 1:
					<span class="text-muted-foreground"> Upload your image</span>
				</h3>

				<h3>
					Step 2:
					<span class="text-muted-foreground"> Click generate caption</span>
				</h3>

				<h3>
					Step 3:
					<span class="text-muted-foreground">
						Copy the generated caption and use it for your next post!
					</span>
				</h3>
			</div>

			<video class="order-1 border rounded-md" src={demoVideo} controls loading="lazy"> </video>
		</div>
	</section>

	<section class="grid justify-center p-10 mt-52 bg-accent">
		<Button class="w-fit" href={route('/dashboard')}>Try it out for free</Button>
	</section>
</main>
