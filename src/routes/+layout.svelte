<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	import '../app.pcss';

	import { Bar } from '@bobbymannino/svelte-progress';
	import { Toaster } from 'svelte-sonner';

	import { ModeWatcher } from 'mode-watcher';

	import SiteMainHeader from '$components/siteMainHeader/SiteMainHeader.svelte';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<Bar color="#6D28D9" size="big" speed="fast" />

<Toaster richColors closeButton position="top-right" />

<ModeWatcher />

<div class="flex flex-col h-[100vh]">
	<SiteMainHeader />

	<main class="container flex-1 max-w-xl p-2 pb-10">
		<slot />
	</main>

	<footer class="px-2 py-3 border-t">
		<div class="container mx-auto">
			<p class="text-sm text-center">
				Created by <a
					href="https://twitter.com/edwardspresume"
					target="_blank"
					class="text-blue-400 hover:underline hover:text-blue-500">@edwardspresume</a
				>
			</p>
		</div>
	</footer>
</div>
