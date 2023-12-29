<script>
	import { Routes } from '$lib/navLinks';

	import StarredTitle from '$components/appPage/StarredTitle.svelte';
	import FeedbackForm from '$components/appPage/form/FeedbackForm.svelte';
	import Button from '$components/ui/button/button.svelte';
	import SiteMainNav from './SiteMainNav.svelte';
	import ThemeToggler from './ThemeToggler.svelte';
</script>

<header class="relative mb-5 border-b">
	<div class="container flex items-center justify-between p-2">
		<Button href={Routes.HOMEPAGE} variant="ghost" class="gap-1 p-0 text-base font-bold sm:text-xl">
			<StarredTitle>CaptionThat</StarredTitle>
		</Button>

		<div class="flex gap-2">
			<FeedbackForm />
			<ThemeToggler />
			<SiteMainNav class="order-first" />
		</div>
	</div>
</header>
