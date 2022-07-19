import { test, expect } from '@playwright/test';
import { createClient } from 'redis';

test.beforeEach(async ({ page }) => {
	await page.goto('/profile/create_account');
});

test.describe('Testing register page functionality', () => {
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

	test("should throw error (Passwords do not match)",async ({ page }) => {
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.fill('input[placeholder="Confirm Password"]', 'different_password');
		await page.locator('button', { hasText: 'Submit' }).click();
		expect(await page.locator('li', { hasText: 'Passwords do not match' }).count()).toEqual(1);
	})

	test('should redirect to /profile if logged in', async ({ page }) => {
		const client = createClient();
		await client.connect();
		await client.flushAll();

		const account_details = { username: 'sample_username', password: 'sample_password' }
		const register_res = await page.request.fetch('/api/register', {
			method: 'POST',
			data: account_details
		});
		expect(register_res.ok()).toBeTruthy();

		const login_res = await page.request.fetch('/api/login', {
			method: 'POST',
			data: account_details
		});
		expect(login_res.ok()).toBeTruthy();
		
		await page.goto('/profile/create_account');
		await expect(page).toHaveURL('/profile');
	})
});
