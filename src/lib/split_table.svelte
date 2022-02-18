<script lang="ts">
	import { openModal } from 'svelte-modals';
	import { to_number } from 'svelte/internal';
	import { fade, fly, slide, blur } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { SplitWorkouts } from '../routes/splits/new/newSplitStore';
	import Modal from './basic_modal.svelte';

	let exercise_grid: HTMLDivElement;
	let rearranging_grid: HTMLDivElement;

	// Toggle variables for displaying appropriate element
	let adding: boolean;
	let rearranging: boolean;
	let deleting: boolean;

	// Add exercise inputs
	let name: string;
	let reps: string;
	let sets: string;
	let load: string;

	export let split_workout_name: string = null;

	// split_workouts_temp is a temp variable in case the user
	// cancels the delete or rearrange function
	let split_workouts_temp: Object;
	let split_workouts: Object;
	SplitWorkouts.subscribe((value: Object) => {
		split_workouts = value;
		split_workouts_temp = JSON.parse(JSON.stringify(value));
	});

	function is_number(num: string) {
		try {
			if (isNaN(to_number(num)) || num === '') {
				return false;
			}
		} catch (error) {
			return false;
		}
		return true;
	}

	function entry_is_valid() {
		let errors = [];

		if (name === '' || name === undefined) {
			errors.push('Exercise name should not be empty');
		}
		if (!is_number(reps) || !is_number(sets) || !is_number(load)) {
			errors.push('Reps, Sets, Load should be a number');
		}

		if (errors.length === 0) {
			return true;
		} else {
			openModal(Modal, { title: 'Error', messages: errors });
		}
	}

	function enter_rearrange_mode() {}

	function clear_all_entries() {}

	function remove_entry(num: number) {
		split_workouts[split_workout_name].forEach((exercise, i) => {
			if (exercise.id === num) {
				split_workouts[split_workout_name].splice(i, 1);
			}
		});
		// To reload the svelte component (array re-declaration)
		split_workouts[split_workout_name] = split_workouts[split_workout_name];
	}

	function save_action() {
		if (adding) {
			if (entry_is_valid()) {
				adding = false;
				let last_exercise_index = split_workouts[split_workout_name].length;
				let id = 1;
				if(last_exercise_index !== 0) {
					id = split_workouts[split_workout_name][last_exercise_index - 1].id + 1
				}
				split_workouts[split_workout_name].push({
					id: id,
					name: name,
					reps: reps,
					sets: sets,
					load: load
				});
				SplitWorkouts.set(split_workouts);
			}
		} else if (rearranging) {
			rearranging = false;
			// Modify store
		} else if (deleting) {
			deleting = false;
			SplitWorkouts.set(split_workouts);
		}
	}

	function cancel_action() {
		if (adding) {
			adding = false;
		} else if (rearranging) {
			rearranging = false;
		} else if (deleting) {
			deleting = false;
			split_workouts[split_workout_name] = JSON.parse(
				JSON.stringify(split_workouts_temp[split_workout_name])
			);
		}
	}
</script>

<div class="h-full flex flex-col">
	<div class="grid gap-1 heading-grid text-white text-center pt-1 bg-slate-900 pb-1">
		<p class=" bg-blue-800 text-lg">No</p>
		<p class=" bg-blue-800 text-lg">Name</p>
		<p class=" bg-blue-800 text-lg">Reps</p>
		<p class=" bg-blue-800 text-lg">Sets</p>
		<p class=" bg-blue-800 text-lg">Load</p>
	</div>

	<!-- Exercise table -->
	<div class="h-full bg-slate-900 w-full overflow-y-auto container-snap transition-all">
		<div class="none w-full gap-1 h-fit max-h-80" bind:this={rearranging_grid} />
		<div class="grid w-full gap-1 h-fit max-h-0" bind:this={exercise_grid}>
			{#each split_workouts[split_workout_name] as exercise, i (exercise.id)}
				<div
					class="grid grid-cols-5 gap-1"
					style="grid-template-columns: 1fr 4fr 1fr 1fr 1fr;"
					in:slide
					out:fade|local
					animate:flip
				>
					{#if deleting}
						<button
							class="text-white bg-red-700 font-semibold"
							on:click={function () {
								remove_entry(exercise.id);
							}}>X</button
						>
					{:else}
						<p class="text-white bg-blue-600 text-center">{i + 1}</p>
					{/if}
					<p class="text-white bg-blue-600 text-center overflow-x-scroll container-snap">
						{exercise.name}
					</p>
					<p class="text-white bg-blue-600 text-center overflow-x-scroll container-snap">
						{exercise.reps}
					</p>
					<p class="text-white bg-blue-600 text-center overflow-x-scroll container-snap">
						{exercise.sets}
					</p>
					<p class="text-white bg-blue-600 text-center overflow-x-scroll container-snap">
						{exercise.load}
					</p>
				</div>
			{/each}
		</div>
	</div>
	{#if adding}
		<div
			class="w-full h-1/2 bg-slate-800 grid grid-rows-2 place-items-center px-5 pt-1 pb-3 border-white transition-all"
			in:fly|local={{ y: 100, duration: 400, opacity: 0 }}
			out:blur|local={{ duration: 100 }}
		>
			<div class="flex w-full justify-evenly flex-col">
				<p class="text-center font-semibold text-lg text-white">Name</p>
				<input type="text" class="outline-none text-center" bind:value={name} />
			</div>
			<div
				class="grid grid-cols-3 grid-rows-2 place-items-stretch w-full text-center gap-x-12 px-12"
			>
				<p class="text-white">Reps</p>
				<p class="text-white">Sets</p>
				<p class="text-white">Load</p>
				<input type="text" class="outline-none text-center" bind:value={reps} />
				<input type="text" class="outline-none text-center" bind:value={sets} />
				<input type="text" class="outline-none text-center" bind:value={load} />
			</div>
		</div>
	{/if}
	{#if adding || rearranging || deleting}
		<div
			class="grid grid-cols-2 text-white bg-clip-padding font-medium"
			in:fade|local={{ duration: 250 }}
		>
			<button on:click={save_action} class="bg-green-700 py-2">Save</button>
			<button on:click={cancel_action} class="bg-red-700 py-2">Cancel</button>
		</div>
	{:else}
		<div
			class="grid grid-cols-3 text-white py-2 bg-clip-padding bg-slate-700"
			in:fade|local={{ duration: 250 }}
		>
			<button
				on:click={() => {
					adding = true;
				}}>Add</button
			>
			<button
				on:click={() => {
					rearranging = true;
				}}>Reorder</button
			>
			<button
				on:click={() => {
					deleting = true;
				}}>Delete</button
			>
		</div>
	{/if}
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
