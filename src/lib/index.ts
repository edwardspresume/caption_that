import { z } from 'zod';

export const ImageSchema = z.object({
	image: z.instanceof(File).refine((file) => file.type.startsWith('image/'), {
		message: 'Uploaded file is not an image'
	}),
	description: z.string().min(1, { message: 'Description is required' })
});
