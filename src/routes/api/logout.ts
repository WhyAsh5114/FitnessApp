import { removeSession } from './_db';
import { parse, serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const cookies = parse(request.headers.get('set-cookie') || '');

	if (cookies.session_id) {
		await removeSession(cookies.session_id);
	}

	return {
		status: 201,
		headers: {
			'set-cookie': serialize('session_id', '', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 0
			})
		}
	};
};
