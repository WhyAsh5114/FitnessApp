import { test, expect } from '@playwright/test';
import { createClient } from 'redis';

test.beforeEach(async () => {
	const client = createClient();
	await client.connect();
	await client.flushAll();
});

test.describe('Test authentication flows', () => {
	test('testing full normal auth flow', async ({
		page
	}) => {
        // Create new account
		await page.goto('/profile/create_account');
		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.fill('input[placeholder="Confirm Password"]', 'sample_password');

        // Clear DB to avoid conflicts
		const client = createClient();
		await client.connect();
		await client.flushAll();
		await page.locator('button', { hasText: 'Submit' }).click();

        // Ensure correct popup being displayed and redirected to /profile/login
		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'Account created successfully' }).count()).toEqual(
			1
		);
		await page.locator('button', { hasText: 'OK' }).click();
		await expect(page).toHaveURL('/profile/login');


        // Login to the page
		await page.fill('input[placeholder=Username]', 'sample_username');
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.locator('button', { hasText: 'Submit' }).click();

        // Ensure login successful and check cookies
		await expect(page).toHaveURL('/profile');
		await expect(page.locator('[data-test=greet_element]')).toHaveText('Hi sample_username');
        let cookies = await page.context().cookies();
        let session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id')
        expect(session_id_cookie).toBeDefined();

        // Logout and get redirected to /profile/login
        await page.locator('[data-test=logout_button]').click();
        await expect(page).toHaveURL('/profile/login');

        // Ensure cookies have been deleted after logout
        cookies = await page.context().cookies();
        session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id')
        expect(session_id_cookie).toBeUndefined();

        
        // Make sure routes are still protected and redirecting to /profile/login
		await page.locator('[data-test=profile_button]').click();
		await expect(page).toHaveURL('/profile/login');
	});

	test('should throw error (User not found)', async ({ page }) => {
		await page.goto('/profile/login')
		await page.fill('input[placeholder=Username]', 'unknown_username');
		await page.fill('input[placeholder=Password]', 'unknown_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(
			await page.locator('li', { hasText: 'User does not exist, register first?' }).count()
		).toEqual(1);
	});
})