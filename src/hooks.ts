import type { GetSession, Handle } from "@sveltejs/kit";
import { parse } from "cookie";
import { getUsernameFromSession } from "./routes/api/_db";

export const handle: Handle = async ({ request, resolve }) => {
    const cookies = parse(request.headers.cookie || '');

    if (cookies.session_id) {
        const username = await getUsernameFromSession(cookies.session_id);
        if (username) {
            request.locals.user = { username: username };
            return resolve(request);
        }
    }

    request.locals.user = null;
    return resolve(request);
}

export const getSession: GetSession = (request) => {
    return request?.locals?.user ? {
        user: {
            username: request.locals.user.username
        }
    } : {};
}