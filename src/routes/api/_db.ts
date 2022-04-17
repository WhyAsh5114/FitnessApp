import { createClient } from "redis";
import { v4 as uuid } from 'uuid';
import { compare, hash } from 'bcrypt';

const db = createClient();
db.connect()

export const getUser = async (username: string): Promise<string> => {
    const existingUser = await db.get(username);
    if (!existingUser) {
        return Promise.resolve(null);
    } else {
        return Promise.resolve(existingUser);
    }
}

export const setUser = async (username: string, userData: string): Promise<string> => {
    const existingUser = await db.get(username);
    if(existingUser) {
        await db.set(username, userData);
        return Promise.resolve(null);
    } else {
        return Promise.reject(new Error("User does not exist"))
    }
}

export const registerUser = async (user: { username: string, password: string }): Promise<unknown> => {
    const existingUser = await db.get(user.username);
    if (existingUser) {
        return Promise.reject(new Error('User already exists'));
    } else {
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;

        // Set extra data fields
        user['splits'] = {}
        user['workouts'] = {}

        await db.set(user.username, JSON.stringify(user));
        return Promise.resolve(user);
    }
}

export const loginUser = async(user: { username: string, password: string }): Promise<string> => {
    const existingUser = JSON.parse(await db.get(user.username));
    if (!existingUser) {
        return Promise.reject(new Error('User does not exist'));
    } else {
        if (!await compare(user.password, existingUser.password)) {
            return Promise.reject(new Error('Incorrect password'));
        } else {
            const sessionID = await createSession(user.username);
            return Promise.resolve(sessionID);
        }
    }
}

export const createSession = async (username: string): Promise<string> => {
    const sessionID = uuid();
    await db.set(sessionID, username);
    await db.expire(sessionID, 60 * 60 * 24 * 7);
    return Promise.resolve(sessionID);
}

export const getUsernameFromSession = async (sessionID: string): Promise<string> => {
    const username = await db.get(sessionID);
    if (!username) {
        return Promise.resolve(null);
    } else {
        return Promise.resolve(username);
    }
}

export const removeSession = async (sessionID: string): Promise<unknown> => {
    const username = await db.get(sessionID);
    if (!username) {
        return Promise.reject(new Error("Session not found"))
    } else {
        await db.del(sessionID);
        return Promise.resolve(sessionID);
    }
}
