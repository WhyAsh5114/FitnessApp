import { getUser, setUser } from "./_db"
import type { Request } from "@sveltejs/kit"

export async function post({ body, locals }: Request & { body: string }): Promise<unknown> {
    if (locals.user?.username) {
        const user = JSON.parse(await getUser(locals.user.username));
        const { name, schedule, workouts } = JSON.parse(body)
        
        user.splits[name] = { schedule, workouts }

        try {
            await setUser(locals.user.username, JSON.stringify(user));
            return {
                status: 200,
                message: "Split added successfully"
            }
        } catch (err) {
            return {
                status: 500,
                message: err
            }
        }
    } else {
        return {
            status: 401,
            message: "Invalid session"
        }
    }
}