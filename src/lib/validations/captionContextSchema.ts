import { z } from 'zod';

export enum CaptionLengthEnum {
	Short = 'short',
	Medium = 'medium',
	Long = 'long',
	VeryLong = 'very-long'
}

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

export const MAX_CAPTION_PROMPT_LENGTH = 300;

export const captionContextSchema = z.object({
	captionLength: z.nativeEnum(CaptionLengthEnum).optional(),
	captionTone: z.nativeEnum(CaptionLengthEnum).optional(),

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
