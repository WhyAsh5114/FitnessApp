<script type="typescript">
    import MenuButtonGrid from "$lib/menu_button_grid.svelte";
    import MenuButton from "$lib/menu_button.svelte";
</script>

<MenuButtonGrid>
    <MenuButton title="Log Workout" color="bg-zinc-600" content="Reps, sets, load, duration, calories burned" imgPath="/dumbbell.svg"/>
    <MenuButton title="Log Cardio" color="bg-red-700" content="Duration, calories burned, average heart rate" imgPath="/heart.svg"/>
    <MenuButton title="Log Nutrition" color="bg-green-700" content="Calorie intake, macronutrients, foods" imgPath="/bowl.svg"/>
    <MenuButton title="Log Sleep" color="bg-purple-700" content="Duration, quality, tiredness, wake up time" imgPath="/moon.svg"/>
    <MenuButton title="Log Body Stats" color="bg-blue-700" content="Steps, weight, height, fat percentage" imgPath="/scale.svg"/>
</MenuButtonGrid>