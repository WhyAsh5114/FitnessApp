<script type="typescript">
	import { openModal } from 'svelte-modals';
	import Modal from '/src/components/basic_modal.svelte';

	import { to_number } from 'svelte/internal';

	import { SplitName, SplitSchedule, SplitWorkouts } from '../newSplitStore';
	import ExerciseTable from '/src/components/exercise_table.svelte';

	let exercise_table: ExerciseTable;
	let valid: boolean;

	let split_schedule: string[];
	let unique_workouts: string[];
	SplitSchedule.subscribe((value: string[]) => {
		split_schedule = value;
		unique_workouts = [];
		split_schedule.forEach((workout, i) => {
			// Capitalise the first letter of the workout in the split_schedule
			split_schedule[i] = split_schedule[i].charAt(0).toUpperCase() + split_schedule[i].slice(1);

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

	let split_name: string;
	SplitName.subscribe((value: string) => {
		split_name = value;
	});

	let split_workouts: object;
	SplitWorkouts.subscribe((value: object) => {
		split_workouts = value;
		validate_split(false);
	});

	let current_workout: string = unique_workouts[0];

	function validate_split(show_modal: boolean) {
		let error: string = 'Invalid workouts, ';
		for (let [workout, exercises] of Object.entries(split_workouts)) {
			if (exercises.length === 0) {
				let msg: string = `add at least one exercise to ${workout}, `;
				if (!error.includes(msg)) {
					error += msg;
				}
			}
			exercises.forEach((exercise: string[]) => {
				if (exercise[1] === '') {
					let msg: string = `exercise names should not be empty (in ${workout}), `;
					if (!error.includes(msg)) {
						error += msg;
					}
				}
				for (let i = 2; i < 5; i++) {
					if (isNaN(to_number(exercise[i])) || exercise[i] === '') {
						let msg: string = `reps, sets, load should be a number (in ${workout}), `;
						if (!error.includes(msg)) {
							error += msg;
						}
					}
				}
			});
		}

		if (error === 'Invalid workouts, ') {
			valid = true;
		} else {
			valid = false;
			if (show_modal) {
				error = error.slice(0, error.length - 2);
				openModal(Modal, { title: 'Error', message: error });
			}
		}
	}

	function next_workout() {
		if (exercise_table.validate_table()) {
			current_workout = unique_workouts[unique_workouts.indexOf(current_workout) + 1];
		}
	}

	function previous_workout() {
		if (exercise_table.validate_table()) {
			current_workout = unique_workouts[unique_workouts.indexOf(current_workout) - 1];
		}
	}
</script>

<div class="flex flex-col w-full h-full pt-2 bg-slate-700 2xl:w-1/2">
	<h2 class="text-white text-2xl py-2 font-bold text-center">{split_name}</h2>
	<div class="flex bg-slate-600 w-full justify-between">
		<div class="w-1/6 bg-slate-800">
			{#if unique_workouts.indexOf(current_workout) !== 0}
				<button
					class="text-white text-xl w-full bg-slate-800 h-full text-center"
					on:click={previous_workout}>&lt;</button
				>
			{/if}
		</div>
		<p class="text-white text-xl py-1 font-semibold">{current_workout}</p>
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
		<ExerciseTable
			table_type="split"
			split_workout_name={current_workout}
			bind:this={exercise_table}
		/>
	{/key}
	<div class="text-white text-center h-14 bg-blue-500 text-lg">
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
