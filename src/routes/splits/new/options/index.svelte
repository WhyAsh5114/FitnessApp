<script type="typescript">
    import { SplitWorkouts } from "../newSplitStore";

    let split_workouts: Object;
    SplitWorkouts.subscribe((value: Object) => {
        split_workouts = value;
    })
</script>