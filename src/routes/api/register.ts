import { createSession, getUser, registerUser } from "./_db";
import { serialize } from "cookie";

export async function post({ body }: Request & { body: { username: string, password: string } }): Promise<unknown> {
    const user = await getUser(body.username);
    if(user) {
        return {
            status: 409,
            body: {
                message: 'User already exists'
            }
        }
    } else {
        await registerUser(body);
        const id = await createSession(body.username);
        return {
            status: 201,
            headers: {
                'Set-Cookie': serialize('session_id', id, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7
                })
            },
            body: {
                message: 'User registered successfully'
            }
        }
    }
}