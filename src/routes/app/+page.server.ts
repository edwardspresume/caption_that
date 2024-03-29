import { SECRET_OPENAI_API_KEY } from '$env/static/private';

import type { Actions, PageServerLoad } from './$types';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import OpenAI from 'openai';

import sharp from 'sharp';

import { createPageMetaTags } from '$lib/utils/metaTags';

import { logError, sanitizeContent } from '$lib/utils';
import {
	CaptionLengthEnum,
	CaptionToneEnum,
	captionFormZodSchema
} from '$validations/captionFormZodSchema';

type ImageCaptionRequest = {
	imageBase64: string;
	captionContext: string | undefined;
	captionLength: CaptionLengthEnum | undefined;
	captionTone: CaptionToneEnum | undefined;
};

async function compressImage(imageBuffer: Buffer, imageType: keyof sharp.FormatEnum) {
	// Adjust the quality or size as needed
	const quality = 80;
	const maxWidth = 1080;

	try {
		const compressedImageBuffer = await sharp(imageBuffer)
			.resize({ width: maxWidth })
			.toFormat(imageType, { quality })
			.toBuffer();

		return `data:image/${imageType};base64,${compressedImageBuffer.toString('base64')}`;
	} catch (error) {
		throw new Error(
			`Image compression failed: ${error instanceof Error ? error.message : 'unknown error'}`
		);
	}
}

async function generateImageCaption({
	imageBase64,
	captionContext,
	captionTone,
	captionLength = CaptionLengthEnum.Medium
}: ImageCaptionRequest) {
	const openai = new OpenAI({
		apiKey: SECRET_OPENAI_API_KEY
	});

	// Build parts of the system message based on the presence of captionLength, captionTone, and captionContext
	const lengthPart = `${captionLength} length`;
	const tonePart = captionTone ? ` with a ${captionTone} tone` : '';
	const contextPart = captionContext ? ` considering the context: '${captionContext}'` : '';

	// Combine parts to form the full system message
	const systemMessage = [
		'Create an Instagram caption that is ',
		lengthPart,
		tonePart,
		contextPart,
		'. Please do not wrap the caption in quotes.'
	].join('');

	const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		max_tokens: 2000,
		temperature: 0.8,
		messages: [
			{ role: 'system', content: systemMessage },

			{
				role: 'user',
				content: [
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

export const load = (async () => {
	const pageMetaTags = createPageMetaTags({
		title: 'Image Caption Generator | CaptionThat',
		description:
			'CaptionThat is a web application that generates unique and descriptive captions for your images using OpenAI GPT-4 Vision'
	});

	return {
		pageMetaTags: Object.freeze(pageMetaTags),
		captionCreationForm: await superValidate(zod(captionFormZodSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const captionCreationForm = await superValidate(request, zod(captionFormZodSchema));

		if (!captionCreationForm.valid) {
			return message(captionCreationForm, {
				alertType: 'error',
				alertText: 'Invalid prompt'
			});
		}

		try {
			const imageFile = captionCreationForm.data.image;

			const imageType = imageFile?.type.split('/')[1] as keyof sharp.FormatEnum;

			const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

			const base64Image = await compressImage(imageBuffer, imageType);

			const captionContext = captionCreationForm.data.captionPrompt;

			const generatedCaption = await generateImageCaption({
				imageBase64: base64Image,
				captionContext: captionContext ? sanitizeContent(captionContext) : undefined,
				captionTone: captionCreationForm.data.captionTone,
				captionLength: captionCreationForm.data.captionLength
			});

			return message(captionCreationForm, {
				alertType: 'success',
				alertText: generatedCaption
			});
		} catch (error) {
			logError(error, 'Error analyzing image');

			return message(
				captionCreationForm,
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
