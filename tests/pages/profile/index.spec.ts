import { testWithAccount, expect } from '../../fixtures.js';
import { test } from '@playwright/test';

test.describe('Testing profile page functionality', () => {
	testWithAccount('should show username on profile page', async ({ page, account }) => {
		const greet_element = page.locator('[data-test=greet_element]');
		await expect(greet_element).toHaveText(`Hi ${account.username}`);
	});
});
