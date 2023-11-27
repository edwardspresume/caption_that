import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

import OpenAI from 'openai';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { Buffer } from 'buffer';
import sharp from 'sharp';

import type { AlertMessage, CaptionLength } from '$lib/types';
import { captionContextSchema } from '$validations/captionContextSchema';

type AnalysisData = {
	imageBase64: string;
	captionContext?: string;
	captionLength?: CaptionLength;
};

const supportedImageTypes: Record<string, keyof sharp.FormatEnum> = {
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'image/gif': 'gif'
};

const imageValidationSchema = z.object({
	uploadedImage: z
		.instanceof(File)
		.refine((file) => file.size > 0, 'No file uploaded')
		.refine((file) => file.type.startsWith('image/'), 'Uploaded file is not an image')
		.refine((file) => supportedImageTypes[file.type], {
			message: 'Unsupported image type. Please upload a JPEG, PNG, WEBP, or GIF image.'
		})
});

async function compressImage(imageBuffer: Buffer, imageType: keyof sharp.FormatEnum) {
	// Adjust the quality or size as needed
	const quality = 80; // Quality percentage
	const maxWidth = 1080; // Max width in pixels for Instagram-friendly size

	const compressedImageBuffer = await sharp(imageBuffer)
		.resize({ width: maxWidth })
		.toFormat(imageType, { quality })
		.toBuffer();

	return `data:image/${imageType};base64,${compressedImageBuffer.toString('base64')}`;
}

async function generateImageCaption({ imageBase64, captionContext, captionLength }: AnalysisData) {
	const openai = new OpenAI({
		apiKey: SECRET_OPENAI_API_KEY
	});

	const systemMessage = `
	Generate a ${captionLength ?? 'medium'} length Instagram caption for the following image.`;

	const userMessageContent = captionContext ?? 'No additional context provided.';

	const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		max_tokens: 2000,
		temperature: 0.8,
		messages: [
			{ role: 'system', content: systemMessage },

			{
				role: 'user',
				content: [
					{ type: 'text', text: userMessageContent },
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

	const imageCaption = response.choices[0]?.message.content;

	if (!imageCaption) {
		throw new Error('No caption returned please try again');
	}

	return imageCaption;
}

export const load: PageServerLoad = async () => {
	return {
		captionContextForm: superValidate(captionContextSchema)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const imageFile = formData.get('uploadedImage') as File | undefined;

		const captionLength = formData.get('captionLength') as CaptionLength | undefined;
		const captionContext = formData.get('captionContext') as string | undefined;

		const captionContextForm = await superValidate<typeof captionContextSchema, AlertMessage>(
			formData,
			captionContextSchema
		);

		const imageValidationResult = imageValidationSchema.safeParse({ uploadedImage: imageFile });

		if (!imageValidationResult.success) {
			return message(captionContextForm, {
				alertType: 'error',
				alertText: imageValidationResult.error.errors[0]?.message
			});
		}

		if (!captionContextForm.valid) {
			return message(captionContextForm, {
				alertType: 'error',
				alertText: 'Invalid prompt'
			});
		}

		try {
			//  Convert the Blob to a Buffer and then to a base64 string
			// const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
			// const base64Image = imageBuffer.toString('base64');

			const imageType = supportedImageTypes[
				imageValidationResult.data.uploadedImage.type
			] as keyof sharp.FormatEnum;

			const imageBuffer = Buffer.from(await imageValidationResult.data.uploadedImage.arrayBuffer());
			const base64Image = await compressImage(imageBuffer, imageType);

			const generatedCaption = await generateImageCaption({
				imageBase64: base64Image,
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
