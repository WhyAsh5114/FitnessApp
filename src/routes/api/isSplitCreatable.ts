import type { Request } from "@sveltejs/kit"
import { getUser } from "./_db"

export async function post({ body, locals }: Request & { body: string }): Promise<unknown> {
    if (locals.user?.username) {
        const user = JSON.parse(await getUser(locals.user.username));
        if(!user['splits'][body]) {
            return {
                status: 200,
                body: "Split can be created"
            }
        } else {
            return {
                status: 409,
                body: {
                    message: "Split already exists"
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