import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/profile/create_account');
	await page.waitForResponse('http://localhost:3000/src/routes/profile/create_account.svelte')
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
		expect(await page.locator('li', { hasText: 'Password cannot be empty' }).count()).toEqual(0);
	});

	test('should throw error (Password cannot be empty)', async ({ page }) => {
		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.locator('button', { hasText: 'Submit' }).click();
		expect(await page.locator('li', { hasText: 'Username cannot be empty' }).count()).toEqual(0);
		expect(await page.locator('li', { hasText: 'Password cannot be empty' }).count()).toEqual(1);
	});

	test('should throw error (Passwords do not match)', async ({ page }) => {
		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.fill('input[placeholder="Confirm Password"]', 'different_password');
		await page.locator('button', { hasText: 'Submit' }).click();
		expect(await page.locator('li', { hasText: 'Username cannot be empty' }).count()).toEqual(0);
		expect(await page.locator('li', { hasText: 'Password cannot be empty' }).count()).toEqual(0);
		expect(await page.locator('li', { hasText: 'Passwords do not match' }).count()).toEqual(1);
	});
});
