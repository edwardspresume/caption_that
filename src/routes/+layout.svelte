<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	import { inject } from '@vercel/analytics';

	import { Toaster } from '$components/ui/sonner';
	import { Bar } from '@bobbymannino/svelte-progress';
	import { ModeWatcher } from 'mode-watcher';
	import { setupViewTransition } from 'sveltekit-view-transition';

	import extend from 'just-extend';
	import { MetaTags } from 'svelte-meta-tags';

	import '../app.pcss';

	import SiteMainHeader from '$components/siteMainHeader/SiteMainHeader.svelte';

	export let data;

	inject({ mode: dev ? 'development' : 'production' });

	setupViewTransition();

	$: metaTags = extend(true, {}, data.baseMetaTags, $page.data.pageMetaTags);
</script>

<MetaTags {...metaTags} />

<Bar color="#6D28D9" size="big" speed="fast" />
<Toaster richColors closeButton position={'top-center'} />
<ModeWatcher />

<div class="flex flex-col h-svh">
	<SiteMainHeader />

	<slot />
</div>
