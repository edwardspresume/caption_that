import type { PageServerLoad } from './$types';

import { CaptionPromptSchema } from '$validations/captionPromptSchema';

import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async () => {
	return {
		captionPromptForm: superValidate(CaptionPromptSchema)
	};
};
