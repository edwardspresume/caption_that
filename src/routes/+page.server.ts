import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

import { z } from 'zod';

import { message, superValidate } from 'sveltekit-superforms/server';

import OpenAI from 'openai';

import { Buffer } from 'buffer';
import sharp from 'sharp';

import type { AlertMessage } from '$lib/types';
import { captionContextSchema } from '$validations/captionContextSchema';

type AnalysisData = {
	imageBase64: string;
	captionContext?: string;
	captionLength?: 'short' | 'medium' | 'long' | 'very-long';
};

async function compressImage(imageBuffer: Buffer): Promise<Buffer> {
	// Adjust the quality or size as needed
	const quality = 80; // Quality percentage
	const maxWidth = 1080; // Max width in pixels for Instagram-friendly size

	return sharp(imageBuffer)
		.resize({ width: maxWidth }) // Resize to maxWidth, keeping aspect ratio
		.jpeg({ quality }) // Convert to JPEG with the specified quality
		.toBuffer(); // Convert back to Buffer for further processing
}

async function generateImageCaption({ imageBase64, captionContext, captionLength }: AnalysisData) {
	const openai = new OpenAI({
		apiKey: SECRET_OPENAI_API_KEY
	});

	const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		max_tokens: 2000,
		temperature: 0.8,
		messages: [
			{
				role: 'system',
				content: `Generate a(n) ${
					captionLength ?? 'medium'
				} length Instagram caption for the following image.`
			},
			{
				role: 'user',
				content: [
					{ type: 'text', text: captionContext ?? '' },
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

	const imageCaption = response.choices[0].message.content;

	if (!imageCaption) {
		throw new Error('No caption returned please try again');
	}

	return imageCaption;
}

const ImageSchema = z.object({
	uploadedImage: z
		.instanceof(File)
		.refine((file) => file.type.startsWith('image/'), 'Uploaded file is not an image')
});

export const load: PageServerLoad = async () => {
	return {
		captionContextForm: superValidate(captionContextSchema)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const captionLength = formData.get('captionLength') as
			| 'short'
			| 'medium'
			| 'long'
			| 'very-long';
		const captionContext = formData.get('captionContext') as string;

		const captionContextForm = await superValidate<typeof captionContextSchema, AlertMessage>(
			formData,
			captionContextSchema
		);

		const imageFile = formData.get('uploadedImage') as File | null;

		const validationResult = ImageSchema.safeParse({ uploadedImage: imageFile });

		if (!validationResult.success) {
			return message(captionContextForm, {
				alertType: 'error',
				alertText: 'Please upload an image'
			});
		}

		if (!captionContextForm.valid) {
			console.log('here');

			return message(captionContextForm, {
				alertType: 'error',
				alertText: 'Invalid prompt'
			});
		}

		if (!imageFile) return;

		//  Convert the Blob to a Buffer and then to a base64 string
		// const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
		// const base64Image = imageBuffer.toString('base64');

		// Convert the Blob to a Buffer
		const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

		// Compress the image
		const compressedImageBuffer = await compressImage(imageBuffer);
		const base64Image = compressedImageBuffer.toString('base64');

		try {
			const generatedCaption = await generateImageCaption({
				imageBase64: `data:image/jpeg;base64,${base64Image}`,
				captionContext,
				captionLength
			});

			return message(captionContextForm, {
				alertType: 'success',
				alertText: generatedCaption
			});
		} catch (error) {
			console.error('Error analyzing image:', error);

			return message(
				captionContextForm,
				{
					alertType: 'error',
					alertText: 'Error analyzing image please try again'
				},
				{
					status: 500
				}
			);
		}
	}
};
