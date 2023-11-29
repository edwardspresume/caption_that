import { z } from 'zod';

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

export const captionContextSchema = z.object({
	captionTone: z.nativeEnum(CaptionToneEnum).optional(),
	captionLength: z.nativeEnum(CaptionLengthEnum).optional(),

	captionContext: z
		.string()
		.max(
			MAX_CAPTION_PROMPT_LENGTH,
			`Prompt must be ${MAX_CAPTION_PROMPT_LENGTH} characters or less`
		)
		.transform((str: string) => str.trim())
		.optional()
});

export type CaptionContextSchemaType = typeof captionContextSchema;
