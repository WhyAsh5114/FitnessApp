import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import * as cookie from 'cookie'
import { createClient } from 'redis'

const db = createClient()
db.connect()

export async function post({ body }: Request & { body: { username: string, password: string } }): Promise<unknown> {
    const user = await db.get(body.username)

    // If user DOES NOT exist, return error
    if (!user) {
        return {
            status: 400,
            body: {
                message: "Invalid credentials"
            }
        }
    }

    try {
        const hashedPassword = await db.get(body.username);
        if (bcrypt.compare(body.password, hashedPassword)) {
            const cookieID = uuid();
            // Save cookie as key, and value as username in db [cookieID: username] for identifying user
            await db.set(cookieID, JSON.stringify(body.username))

            const headers = {
                'Set-Cookie': cookie.serialize('session_id', cookieID, {
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
                    message: "Logged in successfully"
                }
            }
        } else {
            return {
                status: 400,
                body: {
                    message: "Invalid credentials"
                }
            }
        }
    } catch (error) {
        return {
            status: 500,
            body: {
                message: error
            }
        }
    }
}