import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import * as cookie from 'cookie'
import redis from 'redis'

const db = redis.createClient()
db.connect()

export async function post({ body }: Request & { body: { username: string, password: string } }): Promise<unknown> {
    const user = await db.get(body.username)

    // If user exists, return error
    if (user) {
        return {
            status: 409,
            body: {
                message: "User already exists"
            }
        }
    }

    // Save username as key, and hashed password as value in db [username: hashedPassword]
    await db.set(body.username, JSON.stringify(bcrypt.hash(body.password, 10)))

    const cookieID = uuid();
    // Save cookie as key, and value as username in db [cookieID: username] for identifying user
    await db.set(cookieID, JSON.stringify(body.username))

    // Set cookie in browser
    const headers = {
        'Set-Cookie': cookie.serialize('Session-ID', cookieID, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,   // 1 week
            sameSite: 'strict',
            path: '/'
        })
    }
    return {
        status: 200,
        headers,
        body: {
            message: "User created successfully"
        }
    }
}