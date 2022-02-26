<script type="typescript">
	import { to_number } from 'svelte/internal';

	import { SplitWorkouts } from '../newSplitStore';

	let split_workouts: Object;
	SplitWorkouts.subscribe((value: Object) => {
		split_workouts = value;
	});

	let value = 5;
</script>

<div class="grid gap-10 w-full place-items-center">
	<h1 class="text-white text-center text-3xl font-semibold">Split Progression</h1>
	<div class="w-full py-4 px-10 grid place-items-center lg:grid-cols-2">
		<div class="slidecontainer w-full p-5">
			<input type="range" min="0" max="25" class="slider" bind:value />
		</div>
		<div class="flex flex-row w-full justify-center gap-3">
			<p class="text-white text-center bg-slate-900 px-4 py-1">
				{value}
			</p>
			<select class="outline-none bg-slate-900 px-2 py-1 text-white">
				<option value="">%</option>
				<option value="">lb</option>
				<option value="">kg</option>
			</select>
			<p class="text-white text-xl font-bold">/</p>
			<select class="outline-none bg-slate-900 px-2 py-1 text-white">
				<option value="">session</option>
				<option value="">week</option>
				<option value="">month</option>
			</select>
		</div>
	</div>
	<button class="text-white font-semibold rounded-full bg-blue-600 w-1/2 py-1">Save Split</button>
</div>

<style>
	.slider {
		-webkit-appearance: none;
		width: 100%;
		height: 15px;
		outline: none;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
		@apply bg-slate-500 rounded-sm;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		cursor: pointer;
		@apply bg-teal-400;
	}

	.slider::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		cursor: pointer;
		@apply bg-teal-400;
	}
</style>
