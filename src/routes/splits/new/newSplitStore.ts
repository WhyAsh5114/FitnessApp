import { writable } from "svelte/store";

export let SplitName = writable("");
export let SplitSchedule = writable([]);
export let SplitWorkouts = writable({});