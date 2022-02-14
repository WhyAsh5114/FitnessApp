<script type="typescript">
	import { SplitName, SplitSchedule, SplitWorkouts } from '../newSplitStore';
	import BasePage from '/src/components/base_page.svelte';
	import ExerciseTable from '/src/components/exercise_table.svelte';

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
	});

	let current_workout: string = unique_workouts[0];
	let valid: boolean = false;

	function next_workout() {
		current_workout = unique_workouts[unique_workouts.indexOf(current_workout) + 1];
	}

	function previous_workout() {
		current_workout = unique_workouts[unique_workouts.indexOf(current_workout) - 1];
	}
</script>

<BasePage>
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
			/>
		{/key}
		<div class="text-white text-center h-14 bg-blue-500">
			{#if valid}
				<a href="/" class="w-full">Set split options</a>
			{:else}
				<button class="w-full h-full font-semibold text-lg">Set split options</button>
			{/if}
		</div>
	</div>
</BasePage>
