import type sharp from 'sharp';
import { z } from 'zod';

export const MAX_FILE_SIZE_MB = 20;

export const supportedImageTypes: Record<string, keyof sharp.FormatEnum> = {
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'image/gif': 'gif'
};

export const imageValidationSchema = z.object({
	uploadedImage: z
		.instanceof(File)
		.refine((file) => file.size > 0, 'No file uploaded')
		.refine((file) => file.type.startsWith('image/'), 'Uploaded file is not an image')
		.refine((file) => supportedImageTypes[file.type], {
			message: `Unsupported image type. Supported types are: ${Object.values(
				supportedImageTypes
			).join(', ')}.`
		})
		.refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
			message: `File size must be less than ${MAX_FILE_SIZE_MB} MB.`
		})
});
