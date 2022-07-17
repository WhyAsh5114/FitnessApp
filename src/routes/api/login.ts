import { loginUser, getUser } from './_db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const user = await getUser(body.username);
    
    if (!user) {
        return {
            status: 404,
            body: {
                message: "Invalid credentials"
            }
        }
    } else {
        try {
            const id = await loginUser(body);
            return {
                status: 200,
                headers: {
                    'set-cookie': `session_id=${id}; Max-Age=604800; Path=/; SameSite=Strict HttpOnly`,
                    body: "Logged in successfully"
                }
            }
        } catch (error) {
            return {
                status: 401,
                body: {
                    message: "Invalid credentials"
                }
            }
        }
    }
}