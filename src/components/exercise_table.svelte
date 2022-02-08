<script lang="ts">
    // @ts-ignore
    import { SplitWorkouts } from "/src/store";

    export let exercise_data: string[];
    export let table_type: string;
    export let split_workout_name: string = null;
    
    if(exercise_data === undefined) {
        exercise_data = ['', '', '', '']
        console.log(exercise_data)
    }

    console.log("CHANGED")
</script>

<style>
    .heading-grid {
        grid-template-columns: 1fr 4fr 1fr 1fr 1fr;
    }
</style>

<div class="grid gap-1 heading-grid text-white text-center pt-1 bg-slate-900">
    <p class="font-medium bg-blue-600">No</p>
    <p class="font-medium bg-blue-600">Name</p>
    <p class="font-medium bg-blue-600">Reps</p>
    <p class="font-medium bg-blue-600">Sets</p>
    <p class="font-medium bg-blue-600">Load</p>
</div>
<div class="h-1 bg-slate-900"></div>
<div class="bg-slate-900 h-full w-full">
    <div class="grid exercise-grid gap-1 w-screen"></div>
</div>
<div class="grid grid-cols-2 text-white h-14">
    <button>Add</button>
    <button>Clear</button>
</div>