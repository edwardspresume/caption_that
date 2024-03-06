import type sharp from 'sharp';
import { z } from 'zod';

export const MAX_FILE_SIZE_MB = 20;

export const SUPPORTED_IMAGE_TYPES: Array<keyof sharp.FormatEnum> = [
	'jpeg',
	'png',
	'webp',
	'avif',
	'gif'
];

export const IMAGE_VALIDATION_ERROR_MESSAGES = {
	noFileUploaded: 'Please upload a file.',
	unsupportedImageType: `The image type you uploaded is not supported. Please upload an image of one of the following types: ${SUPPORTED_IMAGE_TYPES.join(
		', '
	)}.`,
	fileTooLarge: `The file size must be less than ${MAX_FILE_SIZE_MB} MB.`
};

export enum CaptionToneEnum {
	Funny = 'funny',
	Witty = 'witty',
	Serious = 'serious',
	Casual = 'casual',
	Formal = 'formal',
	Inspirational = 'inspirational',
	Enthusiastic = 'enthusiastic',
	Informative = 'informative'
}

export enum CaptionLengthEnum {
	Short = 'short',
	Medium = 'medium',
	Long = 'long',
	VeryLong = 'very-long'
}

export const MAX_CAPTION_PROMPT_LENGTH = 300;

export const captionFormZodSchema = z.object({
	image: z
		.instanceof(File, { message: IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded })
		.refine((file) => file.size > 0, IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded)
		.refine(
			(file) => {
				const imageType = file.type.split('/')[1];
				return imageType ? SUPPORTED_IMAGE_TYPES.includes(imageType) : false;
			},
			{
				message: IMAGE_VALIDATION_ERROR_MESSAGES.unsupportedImageType
			}
		)
		.refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
			message: IMAGE_VALIDATION_ERROR_MESSAGES.fileTooLarge
		}),

	captionTone: z.nativeEnum(CaptionToneEnum).optional(),
	captionLength: z.nativeEnum(CaptionLengthEnum).optional(),

	captionPrompt: z
		.string()
		.max(
			MAX_CAPTION_PROMPT_LENGTH,
			`Prompt must be ${MAX_CAPTION_PROMPT_LENGTH} characters or less`
		)
		.transform((str: string) => str.trim())
		.optional()
});

export type CaptionFormZodSchemaType = typeof captionFormZodSchema;
