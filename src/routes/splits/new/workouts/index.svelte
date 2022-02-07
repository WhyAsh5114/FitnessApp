<script type="typescript">
	// @ts-ignore
	import { SplitName, SplitSchedule, SplitWorkouts } from '/src/store';
	import BasePage from '/src/components/base_page.svelte';
	import ExerciseTable from '/src/components/exercise_table.svelte';

	let split_schedule: Array<string>;
	SplitSchedule.subscribe((value: string[]) => {
		split_schedule = value;
	});

	let split_name: string;
	SplitName.subscribe((value: string) => {
		split_name = value;
	});

	let split_workouts: object;
	SplitWorkouts.subscribe((value: object) => {
		split_workouts = value;
	});

	let current_workout: string = split_schedule[0];
	let valid: boolean = false;

	function next_workout() {
		current_workout = split_schedule[split_schedule.indexOf(current_workout) + 1];
	}

	function previous_workout() {
		current_workout = split_schedule[split_schedule.indexOf(current_workout) - 1];
	}
</script>

<BasePage>
	<div class="flex flex-col w-full h-full pt-2 bg-slate-700">
		<h2 class="text-white text-2xl py-2 font-bold text-center">{split_name}</h2>
		<div class="flex bg-slate-600 w-full justify-between">
			<div class="w-1/6 bg-slate-800">
				{#if split_schedule.indexOf(current_workout) !== 0}
					<button
						class="text-white text-xl w-full bg-slate-800 h-full text-center"
						on:click={previous_workout}>&lt;</button
					>
				{/if}
			</div>
			<p class="text-white text-xl py-1 font-semibold">{current_workout}</p>
			<div class="w-1/6 bg-slate-800">
				{#if split_schedule.indexOf(current_workout) + 1 !== Object.keys(split_workouts).length}
					<button
						class="text-white text-xl w-full bg-slate-800 h-full text-center"
						on:click={next_workout}>&gt;</button
					>
				{/if}
			</div>
		</div>
		<ExerciseTable exercise_data={split_workouts[current_workout]} table_type="split"/>
		<div class="text-white text-center h-14 bg-blue-500">
			{#if valid}
				<a href="/" class="w-full">Set split options</a>
			{:else}
				<button class="w-full h-full font-semibold text-lg">Set split options</button>
			{/if}
		</div>
	</div>
</BasePage>
