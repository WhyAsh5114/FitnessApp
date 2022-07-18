import { getUser, registerUser } from './_db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const user = await getUser(body['username']);
	if (user) {
		return {
			status: 409,
			body: {
				message: 'User already exists'
			}
		};
	} else {
		await registerUser(body);
		return {
			status: 201,
			body: {
				message: 'User registered successfully'
			}
		};
	}
};
