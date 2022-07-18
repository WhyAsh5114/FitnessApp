import { writable } from 'svelte/store';

export const SplitName = writable('');
export const SplitSchedule = writable(new Array<string>);
export const SplitWorkouts = writable({});
