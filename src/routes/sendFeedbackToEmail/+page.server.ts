import { SECRET_GMAIL_PASS, SECRET_GMAIL_USERNAME } from '$env/static/private';
import type { Actions } from './$types';

import nodemailer from 'nodemailer';

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { message, superValidate } from 'sveltekit-superforms/server';

import type { AlertMessageType } from '$lib/types';

import { logError } from '$lib/utils';
import { FeedbackValidationSchema } from '$validations/feedbackValidationSchema';

const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);

const sanitizeContentOnServer = DOMPurifyInstance.sanitize;

/**
 * Creates a nodemailer Transporter instance
 * @returns {nodemailer.Transporter} nodemailer Transporter instance
 */
function createEmailTransport() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: SECRET_GMAIL_USERNAME,
			pass: SECRET_GMAIL_PASS
		}
	});
}

/**
 *  Sends an email using nodemailer
 * @param {object} mailOptions nodemailer mail options
 * @returns {Promise<nodemailer.SentMessageInfo>} nodemailer SentMessageInfo
 * @see https://nodemailer.com/about/
 * @see https://nodemailer.com/message/
 */
async function sendEmail(mailOptions: object) {
	const emailTransporter = createEmailTransport();
	return emailTransporter.sendMail(mailOptions);
}

export const actions: Actions = {
	default: async ({ request }) => {
		const feedbackForm = await superValidate<typeof FeedbackValidationSchema, AlertMessageType>(
			request,
			FeedbackValidationSchema
		);

		if (!feedbackForm.valid) {
			return message(feedbackForm, {
				alertType: 'error',
				alertText: 'The message you entered is invalid. Please enter a valid message'
			});
		}

		const { message: feedbackMessage } = feedbackForm.data;

		const sanitizedMessage = sanitizeContentOnServer(feedbackMessage);

		try {
			await sendEmail({
				from: SECRET_GMAIL_USERNAME,
				to: SECRET_GMAIL_USERNAME,
				subject: `Promptly Feedback`,
				html: `
                <h2>New Feedback</h2>
                <p>${sanitizedMessage}</p>
            `
			});

			return message(feedbackForm, {
				alertType: 'success',
				alertText: 'Message sent!'
			});
		} catch (error) {
			logError(error, 'Error sending feedback email');

			return message(
				feedbackForm,
				{
					alertType: 'error',
					alertText: `There was an error sending your message. Please try again later.`
				},
				{
					status: 500
				}
			);
		}
	}
};
