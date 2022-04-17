<script context="module" lang="ts">
	export async function load({ session }) {
		// If user not logged in, redirect to login
		if (!session?.user) {
			return {
				status: 302,
				redirect: '/profile/login'
			};
		} else { return {} }
	}
</script>

<script lang="ts">
	import { SplitName, SplitSchedule, SplitWorkouts } from './newSplitStore';
	import { openModal } from 'svelte-modals';
	import Modal from '$lib/basic_modal.svelte';

	let split_name: string = $SplitName;
	let split_schedule: string[] = $SplitSchedule;
	let is_split_valid: boolean = false;
	let split_exists_in_userdata = false;

	let days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	let unique_workouts: string[];

	// Update the split name and schedule immediately after page load
	// So that the entered schedule is not lost when redirected to a new page
	update_unique_workouts();

	async function check_split_validity() {
		if (split_name !== '' && unique_workouts.length > 0) {
			const res = await fetch('/api/isSplitCreatable', {
				method: 'POST',
				body: split_name
			})
			// If split not found in user data, it is ok to create new one otherwise
			// there'll be a name conflict in database, older split will be overwritten
			if(res.ok) {
				is_split_valid = true;
			} else {
				is_split_valid = false;
				split_exists_in_userdata = true;
			}
		} else {
			is_split_valid = false;
		}
	}

	function show_error() {
		let errors = [];

		if (split_name === '') {
			errors.push('Enter split name');
		}
		if (unique_workouts.length === 0) {
			errors.push('Enter at least 1 workout');
		}
		if (split_exists_in_userdata) {
			errors.push('Split already exists')
		}
		openModal(Modal, { title: 'Error', messages: errors });
	}

	// Called everytime a day input (mon, tue, wed.. input) is changed
	function update_unique_workouts() {
		unique_workouts = [];
		split_schedule.forEach((workout, i) => {
			// Capitalise the first letter of the workout in the split_schedule
			workout = workout.charAt(0).toUpperCase() + workout.slice(1);
			split_schedule[i] = workout

			// Remove the workout from the split_schedule if its rest
			if (workout === 'rest') {
				split_schedule[i] = '';
			}

			// Add the workout to unique_workouts if its new and isn't blank or rest
			if (!unique_workouts.includes(workout) && workout !== '' && workout !== 'rest') {
				unique_workouts.push(workout);
			}
		});
		
		// After a possible change in the number of split_schedule, update the validity of the split
		check_split_validity();
	}

	function save_split() {
		SplitName.set(split_name);
		SplitSchedule.set(split_schedule);

		let split_workouts: Object = {};
		unique_workouts.forEach((workout: string, i) => {
			split_workouts[workout] = [];
		});
		SplitWorkouts.set(split_workouts);
	}
</script>

<div class="grid w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6 gap-3 px-5 h-full new-split place-items-center">
	<h2 class="text-2xl text-white font-bold text-center">Create New Split</h2>
	<div class="grid grid-cols-2 rounded-md">
		<h3 class="text-xl text-white text-center font-semibold">Name</h3>
		<input
			on:change={check_split_validity}
			bind:value={split_name}
			type="text"
			class="text-center outline-none rounded-sm font-semibold shadow-black shadow-sm mr-5"
		/>
	</div>
	<div class="grid gap-2">
		{#each days as day, i}
			<div class="grid grid-cols-2 shadow-black bg-pink-700 rounded-full p-2 w-full">
				<p class="text-white text-center text-lg font-medium">
					{day}
				</p>
				<input
					bind:value={split_schedule[i]}
					on:change={update_unique_workouts}
					type="text"
					placeholder="Rest"
					class="text-center mr-5 outline-none p-0.5 rounded-sm font-medium shadow-black shadow-sm"
				/>
			</div>
		{/each}
	</div>
	<div class="py-1 border-pink-600 border-2 rounded-full px-4">
		{#if is_split_valid}
			<a
				href="/splits/new/workouts"
				on:click={save_split}
				class="text-white font-semibold text-lg outline-none"
			>
				Create {unique_workouts.length} workouts
			</a>
		{:else}
			<button class="text-white font-semibold text-lg outline-none" on:click={show_error}>
				Create {unique_workouts.length} workouts
			</button>
		{/if}
	</div>
</div>

<style>
	.new-split {
		grid-template-rows: 1fr 1fr 5fr 1fr;
	}
</style>
