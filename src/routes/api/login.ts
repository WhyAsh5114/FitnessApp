import { loginUser, getUser } from './_db';
import { serialize } from 'cookie';
import { goto } from '$app/navigation';

export async function post({ body }: Request & { body: { username: string, password: string } }): Promise<unknown> {
    const user = await getUser(body.username);
    if (!user) {
        return {
            status: 404,
            body: {
                message: "Invalid credentials"
            }
        }
    } else {
        const id = await loginUser(body);
        return {
            status: 200,
            headers: {
                'Set-Cookie': serialize('session_id', id, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7
                }),
            body: {
                    message: "Logged in successfully"
                }
            }
        }
    }
}