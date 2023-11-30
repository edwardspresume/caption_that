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

export const IMAGE_VALIDATION_ERROR_MESSAGES = {
	noFileUploaded: 'No file uploaded',
	notAnImage: 'Uploaded file is not an image',
	unsupportedImageType: `Unsupported image type. Supported types are: ${Object.values(
		supportedImageTypes
	).join(', ')}.`,
	fileTooLarge: `File size must be less than ${MAX_FILE_SIZE_MB} MB.`
};

export const imageValidationSchema = z.object({
	uploadedImage: z
		.instanceof(File)
		.refine((file) => file.size > 0, IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded)
		.refine((file) => file.type.startsWith('image/'), IMAGE_VALIDATION_ERROR_MESSAGES.notAnImage)
		.refine((file) => supportedImageTypes[file.type], {
			message: IMAGE_VALIDATION_ERROR_MESSAGES.unsupportedImageType
		})
		.refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
			message: IMAGE_VALIDATION_ERROR_MESSAGES.fileTooLarge
		})
});
