import { test, expect } from '@playwright/test';

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
});
