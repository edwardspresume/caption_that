import type { PageServerLoad } from './$types';

import { CaptionPromptSchema } from '$lib/validations/captionPromptSchema';

import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async () => {
	return {
		captionPromptForm: superValidate(CaptionPromptSchema)
	};
};
