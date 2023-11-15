import { z } from 'zod';

export const ImageDescriptionSchema = z.object({
	description: z.string().min(1, { message: 'Description is required' })
});
