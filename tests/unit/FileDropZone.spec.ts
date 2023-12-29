import { get } from 'svelte/store';

import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/svelte';

import { toast } from 'svelte-sonner';

import FileDropZone from '$components/appPage/form/FileDropZone.svelte';
import { currentCaption } from '$lib/store';
import {
	IMAGE_VALIDATION_ERROR_MESSAGES,
	imageValidationSchema
} from '$validations/imageValidationSchema';

describe('FileDropZone', () => {
	let getByTestId: (id: string) => HTMLElement;
	let queryByText: (text: string) => HTMLElement | null;

	let fileInput: HTMLElement;
	let originalCreateObjectURL: typeof URL.createObjectURL;

	beforeEach(() => {
		const renderResult = render(FileDropZone);
		getByTestId = renderResult.getByTestId;
		queryByText = renderResult.queryByText;

		fileInput = getByTestId('file-drop-zone-input');

		originalCreateObjectURL = URL.createObjectURL;
		URL.createObjectURL = vi.fn();
	});

	afterEach(() => {
		URL.createObjectURL = originalCreateObjectURL;
	});

	it('handles image upload without displaying error messages', async () => {
		const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
		fireEvent.change(fileInput, { target: { files: [file] } });

		await waitFor(() => {
			expect(queryByText('An unexpected error occurred')).not.toBeInTheDocument();
			expect(queryByText('Failed to upload image. Please try again.')).not.toBeInTheDocument();
		});

		expect(URL.createObjectURL).toHaveBeenCalledWith(file);
		expect(get(currentCaption)).toBe('');
	});

	it('displays error toast when file validation fails', async () => {
		const file = new File(['test'], 'test.txt', { type: 'text/plain' });
		const mockToastError = vi.spyOn(toast, 'error');
		fireEvent.change(fileInput, { target: { files: [file] } });

		expect(mockToastError).toHaveBeenCalledWith(IMAGE_VALIDATION_ERROR_MESSAGES.notAnImage);
		mockToastError.mockRestore();
	});
});

describe('imageValidationSchema', () => {
	const validateFile = (file: File) => imageValidationSchema.safeParse({ uploadedImage: file });

	it('returns an error when no file is uploaded', () => {
		const file = new File([], '', { type: 'image/jpeg' });
		const result = validateFile(file);

		expect(result.success).toBe(false);
		expect(result.error?.errors[0]?.message).toBe(IMAGE_VALIDATION_ERROR_MESSAGES.noFileUploaded);
	});

	it('returns an error when the uploaded file is not an image', () => {
		const file = new File(['test'], 'test.txt', { type: 'text/plain' });
		const result = validateFile(file);

		expect(result.success).toBe(false);
		expect(result.error?.errors[0]?.message).toBe(IMAGE_VALIDATION_ERROR_MESSAGES.notAnImage);
	});

	it('returns an error when the image type is not supported', () => {
		const file = new File(['test'], 'test.bmp', { type: 'image/bmp' });
		const result = validateFile(file);

		expect(result.success).toBe(false);
		expect(result.error?.errors[0]?.message).toBe(
			IMAGE_VALIDATION_ERROR_MESSAGES.unsupportedImageType
		);
	});

	it('returns an error when the file size is too large', () => {
		const largeFile = new File([new ArrayBuffer(20 * 1024 * 1024 + 1)], 'test.jpg', {
			type: 'image/jpeg'
		});
		const result = validateFile(largeFile);

		expect(result.success).toBe(false);
		expect(result.error?.errors[0]?.message).toBe(IMAGE_VALIDATION_ERROR_MESSAGES.fileTooLarge);
	});
});
