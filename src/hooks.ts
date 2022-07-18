import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { getUsernameFromSession } from './routes/api/_db';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const cookies = parse(event.request.headers.get('cookie') || '');

	if (cookies.session_id) {
		const username = await getUsernameFromSession(cookies.session_id);
		if (username) {
			event.locals = { username };
			return resolve(event);
		}
	}

	event.locals = {};
	return response;
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
