import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

import OpenAI from 'openai';

import { message, superValidate } from 'sveltekit-superforms/server';

import { Buffer } from 'buffer';
import sharp from 'sharp';

import type { AlertMessageType } from '$lib/types';

import {
	CaptionLengthEnum,
	captionContextSchema,
	type CaptionContextSchemaType,
	type CaptionToneEnum
} from '$validations/captionContextSchema';

import { imageValidationSchema, supportedImageTypes } from '$validations/imageValidationSchema';

type ImageCaptionRequest = {
	imageBase64: string;
	captionContext?: string;
	captionLength?: CaptionLengthEnum;
	captionTone?: CaptionToneEnum;
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

export const load: PageServerLoad = async () => {
	return {
		captionContextForm: superValidate(captionContextSchema)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const imageFile = formData.get('uploadedImage') as File | undefined;
		const captionContext = formData.get('captionContext') as string | undefined;
		const captionLength = formData.get('captionLength') as CaptionLengthEnum | undefined;
		const captionTone = formData.get('captionTone') as CaptionToneEnum | undefined;

		const captionContextForm = await superValidate<CaptionContextSchemaType, AlertMessageType>(
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
			const imageType = supportedImageTypes[
				imageValidationResult.data.uploadedImage.type
			] as keyof sharp.FormatEnum;

			const imageBuffer = Buffer.from(await imageValidationResult.data.uploadedImage.arrayBuffer());
			const base64Image = await compressImage(imageBuffer, imageType);

			const generatedCaption = await generateImageCaption({
				imageBase64: base64Image,
				captionContext,
				captionLength,
				captionTone
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
