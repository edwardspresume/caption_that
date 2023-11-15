import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

import { message, superValidate } from 'sveltekit-superforms/server';

import { ImageDescriptionSchema } from '$lib';

import { z } from 'zod';

import OpenAI from 'openai';

import { Buffer } from 'buffer';

type AnalysisData = {
	imageBase64: string;
	description: string;
};

async function analyzeImage({ imageBase64, description }: AnalysisData) {
	const openai = new OpenAI({
		apiKey: SECRET_OPENAI_API_KEY
	});

	const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		max_tokens: 2000,
		temperature: 0.8,
		messages: [
			// {
			// 	role: 'system',
			// 	content: `Please give a long and detailed description of the image`
			// },
			{
				role: 'user',
				content: [
					{ type: 'text', text: description },
					{
						type: 'image_url',
						image_url: {
							url: imageBase64
						}
					}
				]
			}
		]
	});

	const imageDescription = response.choices[0].message.content;

	if (!imageDescription) {
		throw new Error('No description returned please try again');
	}

	return response.choices[0].message.content;
}

const ImageSchema = z.object({
	image: z
		.instanceof(File)
		.refine((file) => file.type.startsWith('image/'), 'Uploaded file is not an image')
});

export const load = (async () => {
	return {
		imageForm: superValidate(ImageDescriptionSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const imageForm = await superValidate(formData, ImageDescriptionSchema);

		const imageFile = formData.get('image') as File | null;

		if (!imageForm.valid) {
			return message(imageForm, {
				alertType: 'error',
				alertMessage: 'Invalid description'
			});
		}

		const validationResult = ImageSchema.safeParse({ image: imageFile });

		if (!validationResult.success) {
			return message(imageForm, {
				alertType: 'error',
				alertMessage: 'Please upload an image'
			});
		}

		if (!imageFile) return;

		//  Convert the Blob to a Buffer and then to a base64 string
		const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
		const base64Image = imageBuffer.toString('base64');

		try {
			const openAiResponse = await analyzeImage({
				imageBase64: `data:image/jpeg;base64,${base64Image}`,
				description: imageForm.data.description
			});

			return message(imageForm, {
				alertType: 'success',
				alertMessage: openAiResponse
			});
		} catch (error) {
			console.error('Error analyzing image:', error);

			return message(
				imageForm,
				{
					alertType: 'error',
					alertMessage: 'Error analyzing image'
				},
				{
					status: 500
				}
			);
		}
	}
};
