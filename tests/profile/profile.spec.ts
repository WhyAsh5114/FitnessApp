import { test, expect } from '@playwright/test';
import { createClient } from 'redis';

const account_details = { username: 'sample_username', password: 'sample_password' };

test.beforeEach(async ({ page, request }) => {
	const client = createClient();
	await client.connect();
	await client.flushAll();

	const register_res = await request.post('/api/register', {
		data: account_details
	});
	expect(register_res.ok()).toBeTruthy();

	const login_res = await page.request.fetch('/api/login', {
		method: 'POST',
		data: account_details
	});
	expect(login_res.ok()).toBeTruthy();

	await page.goto('/profile');
});

test.describe('Testing profile page functionality', () => {
	test('should show username on profile page', async ({ page }) => {
		const greet_element = page.locator('[data-test=greet_element]');
		await expect(greet_element).toHaveText(`Hi ${account_details.username}`)
	})
});
