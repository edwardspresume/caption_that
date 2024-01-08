import type { MetaTagsProps } from 'svelte-meta-tags';

export function createBaseMetaTags(url: URL): MetaTagsProps {
	const title = 'CaptionThat - AI-Powered Caption Generator for Your Images';
	const description =
		'Instantly generate creative captions for your images with CaptionThat. Enhance your social media posts with our free AI tool. No sign-up required.';

	const canonicalUrl = new URL(url.pathname, url.origin).href;

	return {
		title: title,
		description: description,
		canonical: canonicalUrl,

		keywords: [
			'CaptionThat',
			'AI Caption Generator',
			'Free Image Captioning',
			'Creative Captions',
			'Social Media Post Helper',
			'Image Formats Supported',
			'AI for Social Media',
			'Image Formats Supported',
			'Automated Captioning',
			'AI Content Generation',
			'Free AI Tool',
			'No Sign-up Required'
		],

		openGraph: {
			type: 'website',
			url: canonicalUrl,
			locale: 'en_IE',
			title: title,
			description: description,
			siteName: 'CaptionThat'
		},

		twitter: {
			handle: '@edwardspresume',
			site: canonicalUrl,
			cardType: 'summary_large_image',
			title: title,
			description: description
		},

		additionalLinkTags: [
			{
				rel: 'apple-touch-icon',
				href: '/favicons/apple-touch-icon.png'
			},
			{
				rel: 'icon',
				type: 'image/svg+xml',
				href: '/favicons/favicon.svg'
			},
			{
				rel: 'mask-icon',
				href: '/favicons/mask-icon.svg'
			},
			{
				rel: 'alternate icon',
				type: 'image/png',
				href: '/favicons/favicon-32x32.png'
			},
			{
				rel: 'manifest',
				href: `/site.webmanifest`,
				crossOrigin: 'use-credentials'
			}
		]
	};
}

export function createPageMetaTags(metaTags: MetaTagsProps): MetaTagsProps {
	const title = metaTags.title ?? '';
	const description = metaTags.description ?? '';

	return {
		...metaTags,
		openGraph: {
			title: metaTags.openGraph?.title ?? title,
			description: metaTags.openGraph?.description ?? description
		},
		twitter: {
			title: metaTags.twitter?.title ?? title,
			description: metaTags.twitter?.description ?? description
		}
	};
}
