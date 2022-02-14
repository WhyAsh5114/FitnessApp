<script lang="ts">
	import { onMount } from 'svelte';
	import { to_number } from 'svelte/internal';

	import { openModal } from 'svelte-modals';
	import Modal from './basic_modal.svelte';

	import { SplitWorkouts } from '../routes/splits/new/newSplitStore';

	export let table_type: string;
	export let split_workout_name: string = null;

	let exercise_grid: HTMLElement;
	let editing_grid: HTMLElement;
	let editing: boolean = false;

	let add_btn: HTMLButtonElement;
	let clear_btn: HTMLButtonElement;
	let reorder_btn: HTMLButtonElement;

	let split_workouts: Object;
	SplitWorkouts.subscribe((value: Object) => {
		split_workouts = value;
	});

	onMount(() => {
		load_entries();
	});

	function load_entries() {
		exercise_grid.textContent = '';
		split_workouts[split_workout_name] = split_workouts[split_workout_name];
		if (split_workouts[split_workout_name] !== undefined) {
			split_workouts[split_workout_name].forEach((exercise) => {
				add_entry(exercise);
			});
		}
	}

	function add_entry(entry: string[] = ['', '', '', '', '']) {
		let last_entry: ChildNode = exercise_grid.children[exercise_grid.children.length - 1];
		let last_entry_valid: boolean = false;
		if (last_entry === undefined) {
			last_entry_valid = true;
		} else {
			let last_entry_value: string[] = [];
			for (let i = 0; i < last_entry.childNodes.length; i++) {
				last_entry_value.push(last_entry.childNodes[i].textContent);
			}
			last_entry_valid = is_entry_valid(last_entry_value);
		}

		if (last_entry_valid) {
			let exercise_div: HTMLDivElement = document.createElement('div');
			exercise_div.className = 'grid grid-cols-5 gap-1';
			exercise_div.style.gridTemplateColumns = '1fr 4fr 1fr 1fr 1fr';
			entry.forEach((stat, i) => {
				let entry = document.createElement('p');
				entry.className = 'bg-blue-600 text-center text-white min-w-max h-6 outline-none';
				// Prevent enter key from adding new line (make the element single line)
				entry.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
					}
				});
				if (i === 0) {
					entry.textContent = (exercise_grid.children.length + 1).toString();
				} else {
					entry.contentEditable = 'true';
					entry.textContent = stat;
					entry.onblur = () => {
						update_store();
					};
				}
				exercise_div.appendChild(entry);
			});
			exercise_grid.appendChild(exercise_div);
		}
	}

	function is_entry_valid(entry: string[]) {
		let error: string = '';

		// Make sure reps, sets and load is a number
		for (let i = 2; i < 5; i++) {
			try {
				if (isNaN(to_number(entry[i])) || entry[i] === '') {
					if (error === '') {
						error += 'Reps, Sets and Load should be a number';
					}
				}
			} catch (error) {
				if (error === '') {
					error += 'Reps, Sets and Load should be a number';
				}
			}
		}

		// Make sure exercise name is not empty
		if (entry[1] === '') {
			if (error === '') {
				error += 'Exercise name should not be empty';
			} else {
				error += ', exercise name should not be empty';
			}
		}

		if (error === '') {
			return true;
		} else {
			openModal(Modal, { title: 'Error', message: error });
			return false;
		}
	}

	function clear_all_entries() {
		while (exercise_grid.hasChildNodes()) {
			exercise_grid.removeChild(exercise_grid.firstChild);
		}
		update_store();
	}

	function toggle_edit_mode() {
		if (editing) {
			editing = false;
			reorder_btn.textContent = 'Reorder';

			// Re-enable add and clear buttons
			add_btn.disabled = false;
			add_btn.style.color = 'white';
			clear_btn.disabled = false;
			clear_btn.style.color = 'white';

			// Hide editing grid, open up exercise grid
			editing_grid.style.display = 'none';
			exercise_grid.style.display = 'grid';

			// Save editing grid changes to store
			let new_split_workouts: string[][] = [];
			Array.from(editing_grid.childNodes).forEach((editing_entry, i) => {
				Array.from(exercise_grid.childNodes).forEach((exercise_entry, j) => {
					if (exercise_entry.childNodes[0].textContent == editing_entry.childNodes[0].textContent) {
						let new_entry: string[] = [];
						new_entry[0] = (i + 1).toString();
						for (let k = 1; k < 5; k++) {
							new_entry[k] = exercise_entry.childNodes[k].textContent;
						}
						new_split_workouts[i] = new_entry;
					}
				});
			});
			split_workouts[split_workout_name] = new_split_workouts;
			SplitWorkouts.set(split_workouts);
			load_entries();
		} else {
			editing = true;
			reorder_btn.textContent = 'Save';

			// Disable add and clear buttons when editing
			add_btn.disabled = true;
			add_btn.style.color = 'gray';
			clear_btn.disabled = true;
			clear_btn.style.color = 'gray';

			editing_grid.style.display = 'grid';
			exercise_grid.style.display = 'none';

			editing_grid.textContent = '';
			if (split_workouts[split_workout_name] !== undefined) {
				split_workouts[split_workout_name].forEach((exercise, i) => {
					let exercise_div: HTMLDivElement = document.createElement('div');
					exercise_div.className = 'grid grid-cols-5 gap-1 text-white';
					exercise_div.style.gridTemplateColumns = '1fr 4fr 1fr 1fr 1fr';

					let id = document.createElement('p');
					id.className = 'text-center bg-blue-600 min-w-max h-6 outline-none';
					id.textContent = exercise[0];
					exercise_div.appendChild(id);

					let name = document.createElement('p');
					name.className = 'text-center bg-blue-600 min-w-max h-6 outline-none';
					name.textContent = exercise[1];
					exercise_div.appendChild(name);

					let del_btn = document.createElement('button');
					del_btn.className = 'bg-red-700 outline-none font-bold';
					del_btn.textContent = '✕';
					del_btn.onclick = () => {
						editing_grid.removeChild(del_btn.parentNode);
					};
					exercise_div.appendChild(del_btn);

					let up_btn = document.createElement('button');
					up_btn.className = 'bg-slate-700 outline-none';
					up_btn.textContent = '▲';
					up_btn.onclick = () => {
						editing_grid.insertBefore(
							up_btn.parentNode,
							editing_grid.childNodes[
								[].indexOf.call(editing_grid.childNodes, up_btn.parentNode) - 1
							]
						);
					};
					exercise_div.appendChild(up_btn);

					let down_btn = document.createElement('button');
					down_btn.className = 'bg-slate-700 outline-none';
					down_btn.textContent = '▼';
					down_btn.onclick = () => {
						editing_grid.insertBefore(
							up_btn.parentNode,
							editing_grid.childNodes[
								[].indexOf.call(editing_grid.childNodes, up_btn.parentNode) + 2
							]
						);
					};
					exercise_div.appendChild(down_btn);

					editing_grid.appendChild(exercise_div);
				});
			}
		}
	}

	function update_store() {
		if (table_type === 'split') {
			let all_exercises: string[][] = [];
			let number_of_exercises: number = exercise_grid.children.length;
			for (let i = 0; i < number_of_exercises; i++) {
				let exercise: string[] = [];
				for (let j = 0; j < 5; j++) {
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
		<div class="none w-full gap-1 h-fit max-h-80" bind:this={editing_grid} />
		<div class="grid w-full gap-1 h-fit max-h-80" bind:this={exercise_grid} />
	</div>
	<div class="grid grid-cols-4 text-white h-12 outline-none">
		<button
			on:click={() => {
				add_entry();
			}}
			bind:this={add_btn}>Add</button
		>
		<button>Delete</button>
		<button on:click={toggle_edit_mode} bind:this={reorder_btn}>Reorder</button>
		<button on:click={clear_all_entries} bind:this={clear_btn}>Clear</button>
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
