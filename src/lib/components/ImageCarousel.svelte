<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	type Image = {
		mobile_src: string;
		desktop_src: string;
		caption: string;
	};

	import image_1_desktop from '$lib/assets/slider_images/1_desktop.jpg';
	import image_1_mobile from '$lib/assets/slider_images/1_mobile.jpg';
	import image_2_desktop from '$lib/assets/slider_images/2_desktop.jpg';
	import image_2_mobile from '$lib/assets/slider_images/2_mobile.jpg';
	import image_3_desktop from '$lib/assets/slider_images/3_desktop.jpg';
	import image_3_mobile from '$lib/assets/slider_images/3_mobile.jpg';
	import image_4_desktop from '$lib/assets/slider_images/4_desktop.jpg';
	import image_4_mobile from '$lib/assets/slider_images/4_mobile.jpg';
	import image_5_desktop from '$lib/assets/slider_images/5_desktop.jpg';
	import image_5_mobile from '$lib/assets/slider_images/5_mobile.jpg';
	import image_6_desktop from '$lib/assets/slider_images/6_desktop.jpg';
	import image_6_mobile from '$lib/assets/slider_images/6_mobile.jpg';

	const images: Image[] = [
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
			mobile_src: image_5_mobile,
			desktop_src: image_5_desktop,
			caption:
				'Chasing sunsets with the best crew. #GoldenHourAdventures #FriendshipGoals #MountainVibes'
		},
		{
			mobile_src: image_6_mobile,
			desktop_src: image_6_desktop,
			caption:
				'Embracing the quiet majesty of the sunset, one finds clarity at the horizon where thoughts align with the fading light. #sunsetcontemplation #horizonthoughts #peacefulmoments'
		}
	];

	const INTERVAL_TIME = 3000;
	const currentImageIndex = writable(0);

	let interval: ReturnType<typeof setInterval>;

	const updateImage = () => {
		$currentImageIndex = ($currentImageIndex + 1) % images.length;
	};

	const startInterval = () => {
		interval = setInterval(updateImage, INTERVAL_TIME);
	};

	const clearExistingInterval = () => {
		if (interval) clearInterval(interval);
	};

	onMount(startInterval);
	onDestroy(clearExistingInterval);

	const toggleInterval = (shouldPause: boolean) => {
		shouldPause ? clearExistingInterval() : startInterval();
	};
</script>

{#if images.length > 0}
	<figure class="w-full">
		<div class="relative aspect-[16/12]">
			{#each [images[$currentImageIndex]] as image (image?.mobile_src)}
				<picture>
					<source media="(min-width: 768px)" srcset={image?.desktop_src} />
					<source media="(max-width: 767px)" srcset={image?.mobile_src} />
					<img
						src={image?.mobile_src}
						alt={image?.caption}
						transition:fade={{ duration: 800 }}
						on:mouseenter={() => toggleInterval(true)}
						on:mouseleave={() => toggleInterval(false)}
						class="absolute object-cover w-full h-full duration-300 border-4 rounded-md shadow-md hover:border-foreground"
					/>
				</picture>
			{/each}
		</div>

		<figcaption
			class="p-2 mx-auto mt-4 italic font-medium text-center rounded bg-accent w-fit text-pretty"
		>
			{images[$currentImageIndex]?.caption}
		</figcaption>
	</figure>
{/if}
