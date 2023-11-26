<script>
	import Button from '$components/ui/button/button.svelte';
	import { Routes } from '$lib/navLinks';

	import ThemeToggler from './ThemeToggler.svelte';
</script>

<header class="relative border-b">
	<div class="container flex items-center justify-between p-2">
		<Button
			href={Routes.HOMEPAGE}
			variant="ghost"
			class="gap-1 p-0 text-base font-bold sm:text-2xl"
		>
			<span class="rotate-180">✨</span>
			<span>Image Caption Creator</span>
			<span class="-scale-y-100">✨</span>
		</Button>

		<ThemeToggler />
	</div>
</header>
