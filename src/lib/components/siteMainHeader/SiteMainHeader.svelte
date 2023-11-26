<script>
	import { Routes } from '$lib/navLinks';

	import ThemeToggler from './ThemeToggler.svelte';
</script>

<header class="relative border-b">
	<div class="container flex items-center justify-between p-2">
		<a href={Routes.HOMEPAGE} class="font-bold sm:text-2xl">✨ Image Caption Creator ✨</a>

		<ThemeToggler />
	</div>
</header>
