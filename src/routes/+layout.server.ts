import type { LayoutServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { createBaseMetaTags } from '$lib/utils/metaTags';

import { FeedbackValidationSchema } from '$validations/feedbackValidationSchema';

export const load = (async ({ url }) => {
	const baseMetaTags = createBaseMetaTags(url);

	return {
		baseMetaTags: Object.freeze(baseMetaTags),
		feedbackForm: await superValidate(zod(FeedbackValidationSchema))
	};
}) satisfies LayoutServerLoad;
