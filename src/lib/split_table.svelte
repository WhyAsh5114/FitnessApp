<script lang="ts">
	import { openModal } from 'svelte-modals';
	import { to_number } from 'svelte/internal';
	import { fade, fly, slide, blur } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { SplitWorkouts } from '../routes/splits/new/newSplitStore';
	import Modal from './basic_modal.svelte';

	let exercise_grid: HTMLDivElement;

	// Toggle variables for displaying appropriate element
	let adding = false;
	let reordering = false;
	let editing = false;
	let deleting = false;

	// Add exercise inputs
	let name = '';
	let reps = '';
	let sets = '';
	let load = '';

	let selected_entry_index: number | undefined;

	// Component prop
	export let split_workout_name: string;

	// split_workouts_temp is a temp variable in case the user
	// cancels the delete or rearrange function
	let split_workouts_temp: Record<string, Array<exercise>>;
	let split_workouts: Record<string, Array<exercise>>;
	SplitWorkouts.subscribe((value: any) => {
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

	function array_move(arr: Array<any>, old_index: number, new_index: number) {
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	}

	function debounce(func: Function, wait: number, immediate: boolean) {
		let timeout: any;
		return function () {
			// @ts-ignore
			var context = this,
				args = arguments;
			var later = function () {
				timeout = undefined;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
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

	function enter_editing_mode() {
		[].forEach.call(exercise_grid.children, (entry: HTMLDivElement) => {
			entry.addEventListener('click', select_entry_for_editing);
		});
	}

	function exit_editing_mode() {
		[].forEach.call(exercise_grid.children, (entry: HTMLDivElement) => {
			entry.removeEventListener('click', select_entry_for_editing);
		});
	}

	function deselect_entries() {
		// Reset entry colors to default
		let selected_entry_stats = document.querySelectorAll('.bg-teal-600');
		selected_entry_stats.forEach((stat) => {
			stat.classList.add('bg-blue-600');
			stat.classList.remove('bg-teal-600');
		});
		selected_entry_index = undefined;
	}

	function select_entry_for_editing(this: HTMLDivElement) {
		deselect_entries();
		let entry: HTMLDivElement = this;

		// Set newly selected entry's colors
		[].forEach.call(entry.children, (child: HTMLElement) => {
			child.classList.remove('bg-blue-600');
			child.classList.add('bg-teal-600');
		});
		selected_entry_index = Array.prototype.indexOf.call(exercise_grid.children, entry);

		name = entry.children[1].textContent || '';
		reps = entry.children[2].textContent || '';
		sets = entry.children[3].textContent || '';
		load = entry.children[4].textContent || '';
	}

	function remove_entry(num: number) {
		split_workouts[split_workout_name].forEach((exercise: exercise, i: number) => {
			if (exercise.id === num) {
				split_workouts[split_workout_name].splice(i, 1);
			}
		});
		// To reload the svelte component (array re-declaration)
		split_workouts[split_workout_name] = split_workouts[split_workout_name];
	}

	// Event listener function references, so that they can be removed later
	const handleNormalDrag = debounce(handle_normal_drag, 300, false);
	const handleTouchDrag = debounce(handle_touch_drag, 300, false);

	function enter_reordering_mode() {
		[].forEach.call(exercise_grid.children, (entry: HTMLDivElement) => {
			entry.draggable = true;

			// To avoid scrolling down when rearranging with touch
			[].forEach.call(entry.children, (child: HTMLElement) => {
				child.style.touchAction = 'none';
			});

			entry.addEventListener('drag', handleNormalDrag);
			entry.addEventListener('touchmove', handleTouchDrag);
		});
	}

	function exit_reordering_mode() {
		// Reverse enter_reordering_mode
		[].forEach.call(exercise_grid.children, (entry: HTMLDivElement) => {
			entry.draggable = false;
			[].forEach.call(entry.children, (child: HTMLElement) => {
				child.style.touchAction = 'auto';
			});
			entry.removeEventListener('drag', handleNormalDrag);
			entry.removeEventListener('touchmove', handleTouchDrag);
		});
	}

	// Parsing functions for different events of touch and drag
	function handle_normal_drag(this: any, event: DragEvent) {
		handle_drag(event.clientY, this);
	}
	function handle_touch_drag(this: any, event: TouchEvent) {
		handle_drag(event.targetTouches[0].clientY, this);
	}

	// Main drag function
	function handle_drag(clientY: number, element: HTMLElement) {
		let exercise_div_index = Array.prototype.indexOf.call(exercise_grid.children, element);

		// Make an array of all the elements' center y position
		let elements_y_center: number[] = [];
		[].forEach.call(exercise_grid.children, (other_entry: HTMLDivElement) => {
			let bounding_rect = other_entry.getBoundingClientRect();
			let y_center = Math.round(bounding_rect.y + bounding_rect.height / 2);
			elements_y_center.push(y_center);
		});
		// So that the user can drag further than the last element's end
		// and still be able to put the element in the last position
		// the if condition in the next loop needs this so that the array_move
		// is performed even if clientY is beyond last element's y center
		elements_y_center[elements_y_center.length - 1] = Infinity;

		for (let i = 0; i < elements_y_center.length; i++) {
			if (clientY < elements_y_center[i] && clientY !== 0) {
				array_move(split_workouts[split_workout_name], exercise_div_index, i);
				split_workouts[split_workout_name] = split_workouts[split_workout_name];
				break;
			}
		}
	}

	function save_action() {
		if (adding && entry_is_valid()) {
			adding = false;

			// DON'T REMOVE THIS
			// This is done to prevent similar IDs of exercises
			// which if happens, doesn't play well with svelte's each keyed block
			let last_exercise_index = split_workouts[split_workout_name].length;
			let id = 1;
			if (last_exercise_index !== 0) {
				id = split_workouts[split_workout_name][last_exercise_index - 1].id + 1;
			}

			split_workouts[split_workout_name].push({
				id: id,
				name: name,
				reps: parseInt(reps),
				sets: parseInt(sets),
				load: parseInt(load)
			});
			SplitWorkouts.set(split_workouts);
		} else if (reordering) {
			reordering = false;
			exit_reordering_mode();
			SplitWorkouts.set(split_workouts);
		} else if (editing && entry_is_valid() && selected_entry_index) {
			editing = false;
			let entry = split_workouts[split_workout_name][selected_entry_index];
			entry.name = name;
			entry.reps = parseInt(reps);
			entry.sets = parseInt(sets);
			entry.load = parseInt(load);
			split_workouts[split_workout_name][selected_entry_index] = entry;
			deselect_entries();
			exit_editing_mode();
			SplitWorkouts.set(split_workouts);
		} else if (deleting) {
			deleting = false;
			SplitWorkouts.set(split_workouts);
		}
		name = reps = sets = load = '';
	}

	function cancel_action() {
		if (adding) {
			adding = false;
		} else if (reordering) {
			reordering = false;
			split_workouts[split_workout_name] = JSON.parse(
				JSON.stringify(split_workouts_temp[split_workout_name])
			);
			exit_reordering_mode();
		} else if (editing) {
			editing = false;
			deselect_entries();
			exit_editing_mode();
			split_workouts[split_workout_name] = JSON.parse(
				JSON.stringify(split_workouts_temp[split_workout_name])
			);
		} else if (deleting) {
			deleting = false;
			split_workouts[split_workout_name] = JSON.parse(
				JSON.stringify(split_workouts_temp[split_workout_name])
			);
		}
		name = reps = sets = load = '';
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
	<div class="h-full bg-slate-900 w-full overflow-y-auto container-snap">
		<div class="grid w-full gap-1 h-fit max-h-0" bind:this={exercise_grid}>
			{#each split_workouts[split_workout_name] as exercise, i (exercise.id)}
				<div
					class="grid grid-cols-5 gap-1"
					style="grid-template-columns: 1fr 4fr 1fr 1fr 1fr;"
					in:slide
					out:fade|local
					animate:flip
				>
					<div class="bg-blue-600">
						{#if deleting}
							<button
								in:fade|local={{ duration: 250 }}
								class="text-white bg-red-700 font-semibold w-full"
								data-cy="remove-exercise-btn"
								on:click={function () {
									remove_entry(exercise.id);
								}}>X</button
							>
						{:else if reordering}
							<p class="text-white text-center" in:fade|local={{ duration: 250 }}>≡</p>
						{:else if editing}
							<p class="text-white text-center" in:fade|local={{ duration: 250 }}>Edit</p>
						{:else}
							<p
								class="text-white text-center"
								in:fade|local={{ duration: 250 }}
								data-cy="exercise-id-p"
							>
								{i + 1}
							</p>
						{/if}
					</div>
					<p
						class="text-white bg-blue-600 text-center overflow-x-scroll container-snap"
						data-cy="exercise-name-p"
					>
						{exercise.name}
					</p>
					<p
						class="text-white bg-blue-600 text-center overflow-x-scroll container-snap"
						data-cy="exercise-reps-p"
					>
						{exercise.reps}
					</p>
					<p
						class="text-white bg-blue-600 text-center overflow-x-scroll container-snap"
						data-cy="exercise-sets-p"
					>
						{exercise.sets}
					</p>
					<p
						class="text-white bg-blue-600 text-center overflow-x-scroll container-snap"
						data-cy="exercise-load-p"
					>
						{exercise.load}
					</p>
				</div>
			{/each}
		</div>
	</div>
	{#if adding || selected_entry_index}
		<div
			class="w-full h-1/2 bg-slate-800 grid grid-rows-2 place-items-center px-5 pt-1 pb-3 border-white transition-all"
			in:fly|local={{ y: 100, duration: 400, opacity: 0 }}
			out:blur|local={{ duration: 100 }}
		>
			<div class="flex w-full justify-evenly flex-col">
				<p class="text-center font-semibold text-lg text-white">Name</p>
				<input
					type="text"
					class="outline-none text-center"
					bind:value={name}
					data-cy="exercise-name-input"
				/>
			</div>
			<div
				class="grid grid-cols-3 grid-rows-2 place-items-stretch w-full text-center gap-x-12 px-12"
			>
				<p class="text-white">Reps</p>
				<p class="text-white">Sets</p>
				<p class="text-white">Load</p>
				<input
					type="text"
					class="outline-none text-center"
					bind:value={reps}
					data-cy="exercise-reps-input"
				/>
				<input
					type="text"
					class="outline-none text-center"
					bind:value={sets}
					data-cy="exercise-sets-input"
				/>
				<input
					type="text"
					class="outline-none text-center"
					bind:value={load}
					data-cy="exercise-load-input"
				/>
			</div>
		</div>
	{/if}
	{#if adding || reordering || editing || deleting}
		<div
			class="grid grid-cols-2 text-white bg-clip-padding font-medium"
			in:fade|local={{ duration: 250 }}
		>
			<button on:click={save_action} class="bg-green-700 py-2">Save</button>
			<button on:click={cancel_action} class="bg-red-700 py-2">Cancel</button>
		</div>
	{:else}
		<div
			class="grid grid-cols-4 text-white py-2 bg-clip-padding bg-slate-700"
			in:fade|local={{ duration: 250 }}
		>
			<button
				on:click={() => {
					adding = true;
				}}>Add</button
			>
			<button
				on:click={() => {
					reordering = true;
					enter_reordering_mode();
				}}>Reorder</button
			>
			<button
				on:click={() => {
					editing = true;
					enter_editing_mode();
				}}>Edit</button
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
