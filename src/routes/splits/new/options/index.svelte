<script type="typescript">
	import { SplitWorkouts } from '../newSplitStore';

	let split_workouts: Object;
	SplitWorkouts.subscribe((value: Object) => {
		split_workouts = value;
	});
</script>

<div class="w-full py-4 px-10 grid place-items-center">
	<div class="slidecontainer w-5/6">
		<input type="range" min="0" max="50" value="5" class="slider"/>
		<p class="text-white">Value: </p>
	</div>
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
