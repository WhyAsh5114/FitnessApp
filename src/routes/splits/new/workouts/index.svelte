<script lang="ts">
	import { openModal } from 'svelte-modals';
	import Modal from '$lib/basic_modal.svelte';

	import { SplitName, SplitSchedule, SplitWorkouts } from '../newSplitStore';
	import SplitTable from '$lib/split_table.svelte';

	let valid: boolean;

	let split_schedule: string[];
	let unique_workouts: string[] = [];
	SplitSchedule.subscribe((value: string[]) => {
		split_schedule = value;
		unique_workouts = [];
		split_schedule.forEach((workout, i) => {
			// Remove the workout from the split_schedule if its rest
			if (workout.toLowerCase() === 'rest') {
				split_schedule[i] = '';
			}

			// Add the workout to unique_workouts if its new and isn't blank or rest
			if (!unique_workouts.includes(workout) && workout !== '' && workout !== 'rest') {
				unique_workouts.push(workout);
			}
		});
	});

	let split_name: string = $SplitName;

	let split_workouts: object;
	SplitWorkouts.subscribe((value: object) => {
		split_workouts = value;
		validate_split(false);
	});

	let current_workout: string = unique_workouts[0];

	function validate_split(show_modal: boolean) {
		let errors = [];
		for (let [workout, exercises] of Object.entries(split_workouts)) {
			if (exercises.length === 0) {
				errors.push(`Add at least one exercise to ${workout}`);
			}
		}

		if (errors.length === 0) {
			valid = true;
		} else {
			valid = false;
			if (show_modal) {
				openModal(Modal, { title: 'Error', messages: errors });
			}
		}
	}

	function next_workout() {
		current_workout = unique_workouts[unique_workouts.indexOf(current_workout) + 1];
	}

	function previous_workout() {
		current_workout = unique_workouts[unique_workouts.indexOf(current_workout) - 1];
	}
</script>

{#if current_workout}
	<div class="flex flex-col w-full h-full pt-2 bg-slate-900 2xl:w-1/2">
		<h2 class="text-white text-2xl py-2 font-bold text-center bg-slate-700">{split_name}</h2>
		<div class="flex bg-slate-600 w-full justify-between">
			<div class="w-1/6 bg-slate-800">
				{#if unique_workouts.indexOf(current_workout) !== 0}
					<button
						class="text-white text-xl w-full bg-slate-800 h-full text-center"
						on:click={previous_workout}>&lt;</button
					>
				{/if}
			</div>
			<p class="text-white text-xl py-1 font-semibold" data-cy="split-name">{current_workout}</p>
			<div class="w-1/6 bg-slate-800">
				{#if unique_workouts.indexOf(current_workout) + 1 !== Object.keys(unique_workouts).length}
					<button
						class="text-white text-xl w-full bg-slate-800 h-full text-center"
						on:click={next_workout}>&gt;</button
					>
				{/if}
			</div>
		</div>
		{#key current_workout}
			<div class="h-full">
				<SplitTable split_workout_name={current_workout} />
			</div>
		{/key}
		<div class="text-white text-center py-2 bg-blue-500 text-lg">
			{#if valid}
				<div class="h-full grid place-items-center">
					<a href="/splits/new/options" class="w-full font-semibold">Set split options</a>
				</div>
			{:else}
				<button
					class="w-full h-full font-semibold"
					on:click={() => {
						validate_split(true);
					}}>Set split options</button
				>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex flex-col gap-5 place-items-center">
		<p class="text-white text-lg">No split schedule created</p>
		<a
			class="text-white bg-blue-500 px-2 py-1 rounded-full hover:bg-blue-600 w-1/2 text-center"
			href="/splits/new">Create here</a
		>
	</div>
{/if}
