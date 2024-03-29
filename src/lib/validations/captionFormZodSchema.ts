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
	fileEmpty: 'The file you uploaded is empty.',
	fileTooLarge: `The file size must be less than ${MAX_FILE_SIZE_MB} MB.`,
	unsupportedImageType: `The image type you uploaded is not supported. Please upload an image of one of the following types: ${SUPPORTED_IMAGE_TYPES.join(
		', '
	)}.`
};

export enum CaptionToneEnum {
	Funny = 'Funny',
	Witty = 'Witty',
	Serious = 'Serious',
	Casual = 'Casual',
	Formal = 'Formal',
	Inspirational = 'Inspirational',
	Enthusiastic = 'Enthusiastic',
	Informative = 'Informative'
}

export enum CaptionLengthEnum {
	Short = 'Short',
	Medium = 'Medium',
	Long = 'Long',
	VeryLong = 'Very long'
}

export const MAX_CAPTION_PROMPT_LENGTH = 300;

export const captionFormZodSchema = z.object({
	image: z
		.instanceof(File, { message: IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded })
		.refine((file) => file.size > 0, IMAGE_VALIDATION_ERROR_MESSAGES.fileEmpty)
		.refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
			message: IMAGE_VALIDATION_ERROR_MESSAGES.fileTooLarge
		})
		.refine(
			(file) => {
				const imageType = file.type.split('/')[1];
				return imageType ? SUPPORTED_IMAGE_TYPES.includes(imageType) : false;
			},
			{
				message: IMAGE_VALIDATION_ERROR_MESSAGES.unsupportedImageType
			}
		),

	captionTone: z.nativeEnum(CaptionToneEnum),
	captionLength: z.nativeEnum(CaptionLengthEnum),

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
