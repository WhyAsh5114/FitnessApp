import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Testing home page functionality', () => {
	test('should redirect to splits page', async ({ page }) => {
		await page.locator('a', { hasText: 'Splits' }).click();
		await expect(page).toHaveURL('/splits');
	});

	test('should redirect to logging page', async ({ page }) => {
		await page.locator('a', { hasText: 'Logging' }).click();
		await expect(page).toHaveURL('/logging');
	});

	test('should redirect to records page', async ({ page }) => {
		await page.locator('a', { hasText: 'Records' }).click();
		await expect(page).toHaveURL('/records');
	});

	test('should redirect to tracking page', async ({ page }) => {
		await page.locator('a', { hasText: 'Tracking' }).click();
		await expect(page).toHaveURL('/tracking');
	});
});
