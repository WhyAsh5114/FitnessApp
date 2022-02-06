<script type="typescript">
	// @ts-ignore: some vite and ts linting issue due to baseURL/file paths, TODO: fix this...
	import { SplitName, SplitSchedule } from '/src/store';
	import BasePage from '/src/components/base_page.svelte';

	let split_name: string = '';
	let number_of_workouts: number = 0;
	let days: Array<string> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	let workouts: Array<string> = ['', '', '', '', '', '', ''];
	let valid: boolean = false;

    SplitName.subscribe((value: string) => {
        split_name = value;
    })

	SplitSchedule.subscribe((value: string[]) => {
		workouts = value;
	});

	update_value();

	function check_validity() {
		if (split_name !== '' && number_of_workouts > 0) {
			valid = true;
		} else {
			valid = false;
		}
	}

	function show_error() {
		let error: string = '';

		if (split_name === '') {
			error += 'Enter split name';
		}
		if (number_of_workouts === 0) {
			if (error === '') {
				error += 'Enter at least 1 workout';
			} else {
				error += '\nEnter at least 1 workout';
			}
		}
        alert(error);
	}

	function update_value() {
		let unique_workouts: Array<String> = [];
		workouts.forEach((workout, i) => {
			workouts[i] = workouts[i].charAt(0).toUpperCase() + workouts[i].slice(1);
			workout = workout.toLowerCase();
			if (workout === 'rest') {
				workouts[i] = '';
			}
			if (!unique_workouts.includes(workout) && workout !== '' && workout !== 'rest') {
				unique_workouts.push(workout);
			}
		});
		number_of_workouts = unique_workouts.length;
		check_validity();
	}

	function save_split() {
        SplitName.set(split_name);
		SplitSchedule.set(workouts);
	}
</script>

<BasePage>
	<div class="grid w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6 gap-3 px-5 h-full new-split place-items-center">
		<h2 class="text-2xl text-white font-bold text-center">Create New Split</h2>
		<div class="grid grid-cols-2 rounded-md">
			<h3 class="text-xl text-white text-center font-semibold">Name</h3>
			<input
				on:change={check_validity}
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
						bind:value={workouts[i]}
						on:change={update_value}
						type="text"
						placeholder="Rest"
						class="text-center mr-5 outline-none p-0.5 rounded-sm font-medium shadow-black shadow-sm"
					/>
				</div>
			{/each}
		</div>
		<div class="py-1 border-pink-600 border-2 rounded-full px-4">
			{#if valid}
				<a
					href="/splits/new/workouts"
					on:click={save_split}
					class="text-white font-semibold text-lg outline-none"
				>
					Create {number_of_workouts} workouts
				</a>
			{:else}
				<button class="text-white font-semibold text-lg outline-none" on:click={show_error}>
					Create {number_of_workouts} workouts
				</button>
			{/if}
		</div>
	</div>
</BasePage>

<style>
	.new-split {
		grid-template-rows: 1fr 1fr 5fr 1fr;
	}
</style>
