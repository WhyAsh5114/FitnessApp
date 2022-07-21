import { testWithAccount, expect } from '../fixtures.js';
import { test } from '@playwright/test';

test.describe('Testing cookie functionality', () => {
	testWithAccount('should have "session_id" cookie in browser storage', async ({ page }) => {
		const cookies = await page.context().cookies();
		const session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id');
		expect(session_id_cookie).toBeDefined();
	});

	testWithAccount(
		'should delete cookie after clicking logout and redirect to login',
		async ({ page }) => {
			await Promise.all([
				page.waitForResponse(
					(response) => response.url().includes('/api/logout') && response.status() === 201,
					{ timeout: 5000 }
				),
				page.locator('button', { hasText: 'Logout' }).click()
			]);

			const cookies = await page.context().cookies();
			const session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id');
			expect(session_id_cookie).toBeUndefined();

			await expect(page).toHaveURL('/profile/login');
		}
	);
});
