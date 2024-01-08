<script>
	import { page } from '$app/stores';

	import { route } from '$lib/ROUTES';

	import StarredTitle from '$components/StarredTitle.svelte';
	import FeedbackForm from '$components/appPage/form/FeedbackForm.svelte';
	import Button from '$components/ui/button/button.svelte';
	import SiteMainNav from './SiteMainNav.svelte';
	import SiteMainNavMenuToggleBtn from './SiteMainNavMenuToggleBtn.svelte';
	import ThemeToggler from './ThemeToggler.svelte';
</script>

<header class="relative mb-10 border-b">
	<div class="container flex items-center justify-between p-2">
		<Button href={route('/')} variant="link" class="p-0 text-base font-bold sm:text-2xl">
			<StarredTitle>CaptionThat</StarredTitle>
		</Button>

		<div class="flex gap-2">
			<SiteMainNav />
			{#if $page.url.pathname === route('/app')}
				<FeedbackForm />
			{/if}
			<ThemeToggler />
			<SiteMainNavMenuToggleBtn />
		</div>
	</div>
</header>
