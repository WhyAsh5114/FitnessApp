import type { Request } from "@sveltejs/kit"
import { getUser } from "./_db"

export async function post({ body, locals }: Request & { body: string }): Promise<unknown> {
    if (locals.user?.username) {
        const user = JSON.parse(await getUser(locals.user.username));
        if(user['splits'][body]) {
            return {
                status: 200,
                body: user['splits'][body]
            }
        } else {
            return {
                status: 404,
                body: {
                    message: "Split not found"
                }
            }
        }
    } else {
        return {
            status: 401,
            message: 'Invalid session'
        }
    }
}