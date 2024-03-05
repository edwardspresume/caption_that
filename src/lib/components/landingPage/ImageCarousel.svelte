<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	import image_1_desktop from '$lib/assets/slider_images/1_desktop.jpg';
	import image_1_mobile from '$lib/assets/slider_images/1_mobile.jpg';
	import image_2_desktop from '$lib/assets/slider_images/2_desktop.jpg';
	import image_2_mobile from '$lib/assets/slider_images/2_mobile.jpg';
	import image_3_desktop from '$lib/assets/slider_images/3_desktop.jpg';
	import image_3_mobile from '$lib/assets/slider_images/3_mobile.jpg';
	import image_4_desktop from '$lib/assets/slider_images/4_desktop.jpg';
	import image_4_mobile from '$lib/assets/slider_images/4_mobile.jpg';
	import image_6_desktop from '$lib/assets/slider_images/6_desktop.jpg';
	import image_6_mobile from '$lib/assets/slider_images/6_mobile.jpg';

	type Image = {
		mobile_src: string;
		desktop_src: string;
		caption: string;
	};

	const carouselImages: Image[] = [
		{
			mobile_src: image_1_mobile,
			desktop_src: image_1_desktop,
			caption:
				'Taking a moment to simply embrace the views and the company of good friends. 🏞️💕 #AdventureSquad #NaturePause #MountainViews'
		},
		{
			mobile_src: image_2_mobile,
			desktop_src: image_2_desktop,
			caption:
				"Embracing the city lights and feeling the evening breeze. There's nothing like rooftop vibes to end the day on a high note."
		},
		{
			mobile_src: image_3_mobile,
			desktop_src: image_3_desktop,
			caption:
				"Sipping on sunshine and laughter with my favorite humans – who needs filters when your squad's this colorful? 🍻🌈 #NoFilterNoProblem #WhoLetUsOutInTheWild"
		},
		{
			mobile_src: image_4_mobile,
			desktop_src: image_4_desktop,
			caption:
				'Embracing the calm of a minimalist balcony setup. Green touches and soft lights for those serene evenings 💡🌿🛋️ #BalconyGoals #MinimalistLiving #UrbanOasis'
		},

		{
			mobile_src: image_6_mobile,
			desktop_src: image_6_desktop,
			caption:
				'Embracing the quiet majesty of the sunset, one finds clarity at the horizon where thoughts align with the fading light. #sunsetcontemplation #horizonthoughts #peacefulmoments'
		}
	];

	// Time between image changes in milliseconds
	const INTERVAL_TIME_MS = 3000;

	// Index of the currently displayed image
	const currentImageIndex = writable(0);

	// ID of the interval used for changing images
	let imageChangeIntervalId: ReturnType<typeof setInterval>;

	// Function to advance to the next image
	const goToNextImage = () => {
		$currentImageIndex = ($currentImageIndex + 1) % carouselImages.length;
	};

	// Function to start automatically advancing to the next image
	const startImageChangeInterval = () => {
		imageChangeIntervalId = setInterval(goToNextImage, INTERVAL_TIME_MS);
	};

	// Function to stop automatically advancing to the next image
	const stopImageChangeInterval = () => {
		if (imageChangeIntervalId) clearInterval(imageChangeIntervalId);
	};

	// Function to start or stop automatically advancing to the next image
	const toggleImageChangeInterval = (shouldPause: boolean) => {
		shouldPause ? stopImageChangeInterval() : startImageChangeInterval();
	};

	// Start automatically advancing to the next image when the component is mounted
	onMount(startImageChangeInterval);

	// Stop automatically advancing to the next image when the component is destroyed
	onDestroy(stopImageChangeInterval);
</script>

{#if carouselImages.length > 0}
	<figure>
		<div class="relative aspect-[16/12]">
			{#each [carouselImages[$currentImageIndex]] as image (image?.mobile_src)}
				<picture>
					<source media="(min-width: 768px)" srcset={image?.desktop_src} />
					<source media="(max-width: 767px)" srcset={image?.mobile_src} />
					<img
						src={image?.mobile_src}
						alt={image?.caption}
						transition:fade={{ duration: 800 }}
						on:mouseenter={() => toggleImageChangeInterval(true)}
						on:mouseleave={() => toggleImageChangeInterval(false)}
						class="absolute object-cover w-full h-full duration-300 rounded-md hover:scale-95"
					/>
				</picture>
			{/each}
		</div>

		<figcaption
			class="p-2 mx-auto mt-4 italic font-medium text-center rounded-lg w-fit text-pretty bg-accent"
		>
			{carouselImages[$currentImageIndex]?.caption}
		</figcaption>
	</figure>
{/if}

<style>
	img {
		--mask: linear-gradient(#000 0 0) 50% / calc(100% - 40px) calc(100% - 40px) no-repeat,
			radial-gradient(farthest-side, #000 98%, #0000) 0 0/70px 70px round;
		-webkit-mask: var(--mask);
		mask: var(--mask);
	}
</style>
