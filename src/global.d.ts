/// <reference types="@sveltejs/kit" />

interface user {
	username: string;
	password: string;
	splits: Record<string, split>;
	workouts?: Record<string, Array<exercise>>;
}

interface split {
	name: string;
	schedule: string[];
	split_workouts: Record<string, Array<exercise>>;
}

interface exercise {
	id: number;
	name: string;
	reps: number;
	sets: number;
	load: number;
}
