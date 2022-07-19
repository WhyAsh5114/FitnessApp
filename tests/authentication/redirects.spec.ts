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

	test("'Create an account' should redirect to create account page", async ({ page }) => {
		await page.locator('a', { hasText: 'Create an account' }).click();
		await expect(page).toHaveURL('/profile/create_account');
	});
});
