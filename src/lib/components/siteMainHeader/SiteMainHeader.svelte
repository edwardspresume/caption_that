<script>
	import { Routes } from '$lib/navLinks';

	import StarredTitle from '$components/StarredTitle.svelte';
	import Button from '$components/ui/button/button.svelte';
	import ThemeToggler from './ThemeToggler.svelte';
</script>

<header class="relative mb-5 border-b">
	<div class="container flex items-center justify-between p-2">
		<Button href={Routes.HOMEPAGE} variant="ghost" class="gap-1 p-0 text-base font-bold sm:text-xl">
			<StarredTitle>CaptionThat</StarredTitle>
		</Button>

		<ThemeToggler />
	</div>
</header>
