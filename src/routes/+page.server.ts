import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { ImageSchema } from '$lib';

export const load = (async () => {
	return {
		imageForm: superValidate(ImageSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (request) => {
		console.log(request);

		return {
			status: 200,
			body: {
				message: 'Hello world!'
			}
		};
	}
};
