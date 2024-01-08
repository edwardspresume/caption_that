import { expect, test } from '@playwright/test';

test.describe('Basic home page tests', () => {
	test('Verify page headings and navigation', async ({ page }) => {
		// Navigate to the home page
		await page.goto('/');

		// Check if the heading is visible
		const homePageHeading = page.getByRole('heading', {
			name: 'CaptionThat - Unleash Your Creativity'
		});
		await expect(homePageHeading).toBeVisible();

		// Click the link that navigates to "/app"
		const link = page.getByRole('link', { name: 'Try it out for free' });
		await link.first().click();

		await page.waitForURL('/app');

		const appPageHeading = page.getByRole('heading', {
			name: 'Image Caption Creator'
		});
		await expect(appPageHeading).toBeVisible();
	});
});
