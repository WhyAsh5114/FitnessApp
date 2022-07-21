import { expect, testWithAccount } from '../../fixtures.js';
import { test } from '@playwright/test';

testWithAccount.beforeEach(async ({ page }) => {
	await page.goto('/splits');
});

test.describe('Testing /splits page functionality', () => {
	test('should redirect to appropriate pages (not logged in)', async ({ page }) => {
		await page.locator('a[href="/splits/new"]').click();
		await expect(page).toHaveURL('/profile/login');

		await page.goto('/splits');
		await page.locator('a[href="/splits/common"]').click();
		await expect(page).toHaveURL('/splits/common');
	});

	testWithAccount('should redirect to appropriate pages (logged in)', async ({ page }) => {
		await page.goto('/splits');
		await page.locator('a[href="/splits/new"]').click();
		await expect(page).toHaveURL('/splits/new');
	});
});
