import type { GetSession, Handle } from '@sveltejs/kit';
import * as cookie from 'cookie'
import { createClient } from 'redis'

const db = createClient();
db.connect();

export const handle: Handle = async ({ request, resolve }) => {
    const cookies = cookie.parse(request.headers.cookie || '')
    if (cookies.session_id) {
        const session = JSON.parse(await db.get(cookies.session_id));
        if (session) {
            request.locals.user = { username: session.username };
            return resolve(request);
        }
    } else {
        request.locals.user = null;
        return resolve(request);
    }
}

export const getSession: GetSession = async (request) => {
    // If request coming from authenticated source (contains user data) return it, else return nothing like default
    try {
        return {
            username: request.locals.user.username
        }
    } catch (error) {
        if (error instanceof TypeError) {
            return {}
        }   
    }
}