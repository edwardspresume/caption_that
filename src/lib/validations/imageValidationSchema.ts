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
	notAnImage: 'The file you uploaded is not an image.',
	unsupportedImageType: `The image type you uploaded is not supported. Please upload an image of one of the following types: ${SUPPORTED_IMAGE_TYPES.join(
		', '
	)}.`,
	fileTooLarge: `The file size must be less than ${MAX_FILE_SIZE_MB} MB.`
};

export const imageValidationSchema = z.object({
	uploadedImage: z
		.instanceof(File)
		.refine((file) => file.size > 0, IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded)
		.refine((file) => file.type.startsWith('image/'), IMAGE_VALIDATION_ERROR_MESSAGES.notAnImage)
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
		})
});
