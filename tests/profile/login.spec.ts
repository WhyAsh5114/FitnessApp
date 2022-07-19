import { test, expect } from '@playwright/test';
import { createClient } from 'redis';

test.beforeEach(async ({ page }) => {
	await page.goto('/profile/login');
});

test.describe('Testing login page functionality', () => {
	test('should redirect to login instead of profile', async ({ page }) => {
		await page.goto('/profile');
		await expect(page).toHaveURL('/profile/login');
	});

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

	test('should throw error (Incorrect password)', async ({ page, request }) => {
		const client = createClient();
		await client.connect();
		await client.flushAll();

		const res = await request.post('/api/register', {
			data: {
				username: 'sample_username',
				password: 'sample_password'
			}
		});
		expect(res.ok()).toBeTruthy();

		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.fill('input[placeholder=Password]', 'wrong_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'Incorrect password' }).count()).toEqual(1);
	});
});
