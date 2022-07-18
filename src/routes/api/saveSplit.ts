import type { RequestHandler } from '@sveltejs/kit';
import { getUser, setUser } from './_db';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.username) {
		const user: user = JSON.parse(await getUser(locals.username));
		const { name, schedule, workouts }: { name: string; schedule: string[]; workouts: any } =
			await request.json();

		user.splits[name] = { name, schedule, split_workouts: workouts };

		try {
			await setUser(locals.username, JSON.stringify(user));
			return {
				status: 200,
				message: 'Split added successfully'
			};
		} catch (err) {
			return {
				status: 500,
				message: err
			};
		}
	} else {
		return {
			status: 401,
			message: 'Invalid session'
		};
	}
};
