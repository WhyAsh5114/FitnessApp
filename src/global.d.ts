/// <reference types="@sveltejs/kit" />

interface user {
	username: string,
	password: string,
	splits: Record<string, split>,
	workouts?: {

	}
}

interface split {
    name: string,
    schedule: string[],
    split_workouts: Record<string, split_workout>
}

interface split_workout {
    name: string,
    days: string[],
    exercises: Record<string, exercise>
}

interface exercise {
    id: number,
    name: string,
    reps: number,
    sets: number,
    load: number
}