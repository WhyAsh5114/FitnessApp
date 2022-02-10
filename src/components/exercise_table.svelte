<script lang="ts">
import { onMount } from "svelte";

	import { SplitWorkouts } from "../routes/splits/new/newSplitStore";

	export let exercise_data: string[][];
	export let table_type: string;
	export let split_workout_name: string = null;

	let exercise_grid: HTMLElement;

	let split_workouts: Object;
	SplitWorkouts.subscribe((value: Object) => {
		split_workouts = value;
	})
	
	onMount(() => {
		if(exercise_data !== undefined) {
			exercise_data.forEach((exercise) => {
				add_entry(exercise);
			});
		}
	})

	function add_entry(entry: string[] = ['', '', '', '', '']) {
		if (true) {
			let exercise_div: HTMLDivElement = document.createElement("div");
			exercise_div.className = 'grid grid-cols-5 gap-1'
			exercise_div.style.gridTemplateColumns = '1fr 4fr 1fr 1fr 1fr';
			entry.forEach((stat, i) => {
				let entry = document.createElement('p');
				entry.className = 'text-center text-white bg-blue-600 min-w-max h-6 outline-none';
				if(i === 0) {
					entry.textContent = (exercise_grid.children.length + 1).toString();
				} else {
					entry.contentEditable = "true";
					entry.textContent = stat;
					entry.onblur = () => {update_store()};
				}
				exercise_div.appendChild(entry);
			});
			exercise_grid.appendChild(exercise_div);
		}
	}

	function clear_all_entries() {
		while (exercise_grid.hasChildNodes()) {
			exercise_grid.removeChild(exercise_grid.firstChild);
		}
	}

	function update_store() {
		if(table_type === "split") {
			let all_exercises: string[][] = [];
			let number_of_exercises: number = exercise_grid.children.length;
			for(let i = 0; i < number_of_exercises; i++) {
				let exercise: string[] = [];
				for(let j = 0; j < 5; j++) {
					exercise.push(exercise_grid.children[i].children[j].textContent);
				}
				all_exercises.push(exercise);
			}
			split_workouts[split_workout_name] = all_exercises;
			SplitWorkouts.set(split_workouts);
		}
	}
</script>

<div class="h-full flex flex-col">
	<div class="grid gap-1 heading-grid text-white text-center pt-1 bg-slate-900">
		<p class=" bg-blue-800 text-lg">No</p>
		<p class=" bg-blue-800 text-lg">Name</p>
		<p class=" bg-blue-800 text-lg">Reps</p>
		<p class=" bg-blue-800 text-lg">Sets</p>
		<p class=" bg-blue-800 text-lg">Load</p>
	</div>
	<!-- Headings bottom border -->
	<div class="h-1 bg-slate-900" />

	<!-- Exercise table -->
	<div class="h-full bg-slate-900 w-full scroll overflow-y-auto container-snap">
		<div class="grid w-full gap-1 h-fit max-h-80" bind:this={exercise_grid} />
	</div>
	<div class="grid grid-cols-3 text-white h-12 outline-none">
		<button
			on:click={() => {
				add_entry();
			}}>Add</button
		>
		<button on:click={clear_all_entries}>Clear</button>
		<button on:click={clear_all_entries}>Rearrange</button>
	</div>
</div>

<style>
	.heading-grid {
		grid-template-columns: 1fr 4fr 1fr 1fr 1fr;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.container-snap::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.container-snap {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
