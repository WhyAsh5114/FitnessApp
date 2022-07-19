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

test.describe('Testing logout functionality', () => {
	test('should have "session_id" cookie in browser storage', async ({ page }) => {    
        const cookies = await page.context().cookies();
        const session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id')
        expect(session_id_cookie).toBeDefined();
	});

	test('should show username on profile page', async ({ page }) => {
		const greet_element = page.locator('[data-test=greet_element]');
		await expect(greet_element).toHaveText(`Hi ${account_details.username}`)
	})

	test('should delete cookie after clicking logout and redirect to login', async ({ page }) => {
		await page.locator('[data-test=logout_button]').click();

		const cookies = await page.context().cookies();
        const session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id')
        expect(session_id_cookie).toBeUndefined();

		await expect(page).toHaveURL('/profile/login');
	})
});
