<script lang="ts">
	import { onMount } from 'svelte';

	import image1 from '$lib/assets/1.jpg';
	import image2 from '$lib/assets/2.jpg';
	import image3 from '$lib/assets/3.jpg';

	type Image = {
		src: string;
		caption: string;
	};

	const images: Image[] = [
		{ src: image1, caption: 'Caption for image 1' },
		{ src: image2, caption: 'Caption for image 2' },
		{ src: image3, caption: 'Caption for image 3' }
	];

	let currentIndex = 0;

	onMount(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 4000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<figure>
	<img
		src={images?.[currentIndex]?.src}
		alt={images?.[currentIndex]?.caption}
		class="object-cover rounded-md w-[900px] h-[700px]"
	/>

	<figcaption class="block p-2 mx-auto mt-4 italic font-medium text-center rounded bg-accent w-fit">
		{images?.[currentIndex]?.caption}
	</figcaption>
</figure>
