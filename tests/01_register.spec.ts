import { test, expect } from '@playwright/test';
import { createClient } from 'redis';

test.beforeEach(async ({ page }) => {
	await page.goto('/profile/create_account');
});

test.describe('Testing register functionality', () => {
	test('should throw error (Username and password cannot be empty)', async ({ page }) => {
		await page.locator('button', { hasText: 'Submit' }).click();
		expect(await page.locator('li', { hasText: 'Username cannot be empty' }).count()).toEqual(1);
		expect(await page.locator('li', { hasText: 'Password cannot be empty' }).count()).toEqual(1);
	});

	test('should throw error (Username cannot be empty)', async ({ page }) => {
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.locator('button', { hasText: 'Submit' }).click();
		expect(await page.locator('li', { hasText: 'Username cannot be empty' }).count()).toEqual(1);
	});

	test('should throw error (Password cannot be empty)', async ({ page }) => {
		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.locator('button', { hasText: 'Submit' }).click();
		expect(await page.locator('li', { hasText: 'Password cannot be empty' }).count()).toEqual(1);
	});

	test('should show success prompt and redirect to /login after creating user', async ({
		page
	}) => {
		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.fill('input[placeholder="Confirm Password"]', 'sample_password');

		const client = createClient();
		await client.connect();
		await client.flushAll();
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'Account created successfully' }).count()).toEqual(
			1
		);

		await page.locator('button', { hasText: 'OK' }).click();
		await expect(page).toHaveURL('/profile/login');
	});
});
