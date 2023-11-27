import { z } from 'zod';

export const MAX_CAPTION_PROMPT_LENGTH = 300;

export const captionContextSchema = z.object({
	captionLength: z.enum(['short', 'medium', 'long', 'very-long']).optional(),
	
	captionContext: z
		.string()
		.min(1, 'Prompt is required')
		.max(
			MAX_CAPTION_PROMPT_LENGTH,
			`Prompt must be ${MAX_CAPTION_PROMPT_LENGTH} characters or less`
		)
		.refine((str: string) => str.trim().length > 0, {
			message: `Prompt cannot be only empty spaces`
		})
		.transform((str: string) => str.trim())
		.optional()
});
