import { test, expect } from '@playwright/test';
import { createClient } from 'redis';

test.beforeAll(async () => {
	const client = createClient();
	await client.connect();
	await client.flushAll();
});

test.beforeEach(async ({ page }) => {
	await page.goto('/profile/login');
});

test.describe('Testing redirects of protected routes', () => {
	test('profile button should redirect to login page', async ({ page }) => {
		await page.goto('/');
		await page.locator('[data-test=profile_button]').click();
		await expect(page).toHaveURL('/profile/login');
	});

	test('should throw error (User not found)', async ({ page }) => {
		await page.fill('input[placeholder=Username]', 'unknown_username');
		await page.fill('input[placeholder=Password]', 'unknown_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(
			await page.locator('li', { hasText: 'User does not exist, register first?' }).count()
		).toEqual(1);
	});

	test("'Create an account' should redirect to create account page", async ({ page }) => {
		await page.locator('a', { hasText: 'Create an account' }).click();
		await expect(page).toHaveURL('/profile/create_account');
	});
});
