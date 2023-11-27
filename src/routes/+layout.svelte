<script>
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

<SiteMainHeader />

<main>
	<slot />
</main>
