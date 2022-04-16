import { removeSession } from './_db';
import { parse, serialize } from 'cookie';

export async function get({ headers }: Request & { headers: { cookie } }): Promise<unknown> {
    const cookies = parse(headers.cookie || '');

    if (cookies.session_id) {
        await removeSession(cookies.session_id);
    }

    return {
        status: 201,
        headers: {
            'Set-Cookie': serialize('session_id', '', {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 0
            }),
        },
    };
}