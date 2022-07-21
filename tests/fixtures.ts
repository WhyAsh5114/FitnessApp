import { test as base, expect } from '@playwright/test';
import { createClient } from 'redis';

type Account = {
	username: string;
	password: string;
};

interface MyWindow extends Window {
	mounted: boolean | undefined;
}

declare let window: MyWindow;

export const test = base.extend<{ creatable_username: string }>({
	creatable_username:
		// eslint-disable-next-line no-empty-pattern
		async ({}, use) => {
			// Generate creatable username
			let username = 'username' + Math.floor(Math.random() * 10000001);
			const client = createClient();
			await client.connect();
			while ((await client.get(username)) !== null) {
				username = 'username' + Math.floor(Math.random() * 101);
			}

			// Use the creatable username in the test
			await use(username);

			// Delete the account
			await client.del(username);
		}
});

export const testWithAccount = base.extend<{ account: Account }>({
	account: 
		async ({ browser }, use) => {
			// Unique username.
			const client = createClient();
			await client.connect();
			let username = 'username' + Math.floor(Math.random() * 10000001);
			while ((await client.get(username)) !== null) {
				username = 'username' + Math.floor(Math.random() * 101);
			}
			const password = 'password';

			// Create the account
			const page = await browser.newPage();
			const res = await page.request.post('/api/register', {
				data: { username, password }
			});
			expect(res.ok()).toBeTruthy();

			// Use the account value.
			await use({ username, password });
			await page.close();

			// Delete the account
			await client.del(username);
		},

	page: async ({ page, account }, use) => {
		// Login with our account.
		const { username, password } = account;
		await page.goto('/profile/login');
		
		await page.waitForFunction(() => window.mounted == true)
		await page.fill('input[placeholder=Username]', username);
		await page.fill('input[placeholder=Password]', password);

		// Wait for login response to be successful
		await Promise.all([
			page.waitForResponse(
				(response) => response.url().includes('/api/login') && response.status() === 200,
				{ timeout: 5000 }
			),
			page.locator('button', { hasText: 'Submit' }).click()
		]);

		// Ensure login was successful
		await expect(page).toHaveURL('/profile');
		await expect(page.locator('[data-test=greet_element]')).toHaveText(`Hi ${username}`);

		// Use signed-in page in the test.
		await use(page);
	}
});

export { expect } from '@playwright/test';
