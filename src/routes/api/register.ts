import { getUser, registerUser } from './_db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		await getUser(body['username']);
		return {
			status: 409,
			body: {
				message: 'User already exists'
			}
		};
	} catch (err) {
		await registerUser(body);
		return {
			status: 201,
			body: {
				message: 'User registered successfully'
			}
		};
	}
};
