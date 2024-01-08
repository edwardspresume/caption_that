<script lang="ts">
	import { route } from '$lib/ROUTES';

	import FaqSection from '$components/landingPage/FaqSection.svelte';
	import H2 from '$components/landingPage/H2.svelte';
	import ImageCarousel from '$components/landingPage/ImageCarousel.svelte';
	import Button from '$components/ui/button/button.svelte';

	import demoVideo from '$lib/assets/demo_video.mp4';
</script>

<main class="container flex-1 p-2 pb-10 space-y-14">
	<header
		class="space-y-6 sm:h-[85dvh] md:grid md:grid-cols-[1fr,1.7fr] md:items-center md:justify-between md:justify-items-end md:gap-8"
	>
		<section class="space-y-6 text-center text-pretty md:text-left">
			<h1 class="text-2xl font-bold">CaptionThat - Unleash Your Creativity</h1>

			<h2 class="text-xl sm:space-x-3">
				<span>📸 Snap It.</span>

				<span>📝 Caption It.</span>

				<span>🚀 Share It.</span>
			</h2>

			<p class="text-muted-foreground">
				Create stunning captions for your photos with CaptionThat. Let our AI do the work for you!
			</p>

			<Button href={route('/app')}>Try it out for free</Button>
		</section>

		<ImageCarousel />
	</header>

	<section>
		<H2>How it works</H2>

		<div class="space-y-6 md:grid md:grid-cols-[2fr,1fr] md:items-center md:gap-8">
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

	<FaqSection />

	<section class="grid justify-center">
		<Button class="w-fit" href={route('/app')}>Try it out for free</Button>
	</section>
</main>
