import type sharp from 'sharp';
import { z } from 'zod';

export const MAX_FILE_SIZE_MB = 20;

export const SUPPORTED_IMAGE_TYPES: Record<string, keyof sharp.FormatEnum> = {
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'image/gif': 'gif'
};

export const IMAGE_VALIDATION_ERROR_MESSAGES = {
	noFileUploaded: 'Please upload a file.',
	notAnImage: 'The file you uploaded is not an image.',
	unsupportedImageType: `The image type you uploaded is not supported. Please upload an image of one of the following types: ${Object.values(
		SUPPORTED_IMAGE_TYPES
	).join(', ')}.`,
	fileTooLarge: `The file size must be less than ${MAX_FILE_SIZE_MB} MB.`
};

export const imageValidationSchema = z.object({
	uploadedImage: z
		.instanceof(File)
		.refine((file) => file.size > 0, IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded)
		.refine((file) => file.type.startsWith('image/'), IMAGE_VALIDATION_ERROR_MESSAGES.notAnImage)
		.refine((file) => SUPPORTED_IMAGE_TYPES[file.type], {
			message: IMAGE_VALIDATION_ERROR_MESSAGES.unsupportedImageType
		})
		.refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
			message: IMAGE_VALIDATION_ERROR_MESSAGES.fileTooLarge
		})
});
