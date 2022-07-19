import type { GetSession, Handle } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';
import { getUsernameFromSession } from './routes/api/_db';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = parse(event.request.headers.get('cookie') || '');

	if (cookies.session_id) {
		try {
			const username = await getUsernameFromSession(cookies.session_id);
			if (username) {
				event.locals = { username };
				return resolve(event);
			}
		} catch (error) {
			event.locals = {};
			event.request.headers.set(
				'set-cookie',
				serialize('session_id', '', {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					maxAge: 0
				})
			);
			return resolve(event);
		}
	}

	event.locals = {};
	return resolve(event);
};

export const getSession: GetSession = (request) => {
	if (request?.locals.username) {
		return {
			username: request.locals.username
		};
	} else {
		return {};
	}
};
