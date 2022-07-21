import { test, expect } from '../fixtures.js';

interface MyWindow extends Window {
	mounted: boolean | undefined;
}

declare let window: MyWindow;

test.describe('Test authentication flows', () => {
	test('testing full normal auth flow', async ({ page, creatable_username }) => {
		// Create new account
		await page.goto('/profile/create_account');
		await page.waitForResponse('http://localhost:3000/src/routes/profile/create_account.svelte')
		await page.fill('input[placeholder=Username]', creatable_username);
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.fill('input[placeholder="Confirm Password"]', 'sample_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		// Ensure correct popup being displayed and redirected to /profile/login
		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'Account created successfully' }).count()).toEqual(
			1
		);
		await page.locator('button', { hasText: 'OK' }).click();
		await page.waitForResponse('http://localhost:3000/src/routes/profile/login.svelte')
		await expect(page).toHaveURL('/profile/login');

		// Login to the page
		await page.fill('input[placeholder=Username]', creatable_username);
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		// Ensure login successful and check cookies
		await expect(page).toHaveURL('/profile');
		await expect(page.locator('[data-test=greet_element]')).toHaveText(`Hi ${creatable_username}`);
		let cookies = await page.context().cookies();
		let session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id');
		expect(session_id_cookie).toBeDefined();

		// Logout and get redirected to /profile/login
		await page.locator('[data-test=logout_button]').click();
		await expect(page).toHaveURL('/profile/login');

		// Ensure cookies have been deleted after logout
		cookies = await page.context().cookies();
		session_id_cookie = cookies.find((cookie) => cookie.name === 'session_id');
		expect(session_id_cookie).toBeUndefined();

		// Make sure routes are still protected and redirecting to /profile/login
		await page.locator('[data-test=profile_button]').click();
		await expect(page).toHaveURL('/profile/login');
	});

	test('should throw error (User not found)', async ({ page }) => {
		await page.goto('/profile/login');
		await page.waitForFunction(() => window.mounted == true)
		await page.fill('input[placeholder=Username]', 'unknown_username');
		await page.fill('input[placeholder=Password]', 'unknown_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(
			await page.locator('li', { hasText: 'User does not exist, register first?' }).count()
		).toEqual(1);
	});

	test('should throw error (Incorrect password)', async ({ page, request, creatable_username }) => {
		// Create sample account
		const res = await request.post('/api/register', {
			data: {
				username: creatable_username,
				password: 'sample_password'
			}
		});
		expect(res.ok()).toBeTruthy();

		await page.goto('/profile/login');
		await page.waitForResponse('http://localhost:3000/src/routes/profile/login.svelte')
		await page.fill('input[placeholder=Username]', creatable_username);
		await page.fill('input[placeholder=Password]', 'wrong_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'Incorrect password' }).count()).toEqual(1);
	});

	test('should throw error (User already exists)', async ({
		page,
		request,
		creatable_username
	}) => {
		// Create a new account
		await page.goto('/profile/create_account');
		await page.waitForResponse('http://localhost:3000/src/routes/profile/create_account.svelte');
		const res = await request.post('/api/register', {
			data: {
				username: creatable_username,
				password: 'sample_password'
			}
		});
		expect(res.ok()).toBeTruthy();

		// Try to create one more account with same username, same password
		await page.fill('input[placeholder=Username]', creatable_username);
		await page.fill('input[placeholder=Password]', 'sample_password');
		await page.fill('input[placeholder="Confirm Password"]', 'sample_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'User already exists' }).count()).toEqual(1);
		await page.locator('button', { hasText: 'OK' }).click();

		// Try to create one more account with same username, different password
		await page.fill('input[placeholder=Username]', creatable_username);
		await page.fill('input[placeholder=Password]', 'different_password');
		await page.fill('input[placeholder="Confirm Password"]', 'different_password');
		await page.locator('button', { hasText: 'Submit' }).click();

		await page.locator('ul[data-test="message_list"]').waitFor({ state: 'visible' });
		expect(await page.locator('li', { hasText: 'User already exists' }).count()).toEqual(1);
		await page.locator('button', { hasText: 'OK' }).click();
	});
});
