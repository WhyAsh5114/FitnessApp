import type { RequestHandler } from '@sveltejs/kit';
import { getUser } from './_db';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.username) {
		const body = await request.json();
		const user = JSON.parse(await getUser(locals.username));
		if (!user['splits'][body.split_name]) {
			return {
				status: 200,
				body: 'Split can be created'
			};
		} else {
			return {
				status: 409,
				body: {
					message: 'Split already exists'
				}
			};
		}
	} else {
		return {
			status: 401,
			message: 'Invalid session'
		};
	}
};
