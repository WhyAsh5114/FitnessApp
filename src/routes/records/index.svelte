<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
</script>

<BasePage>
    <MenuButtonGrid>
        <MenuButton title="Splits Records" color="bg-pink-700" content="Split exercises, workouts, progression" imgPath="/calendar.svg"/>
        <MenuButton title="Workout Records" color="bg-slate-600" content="Reps, sets, load, duration, calories burned" imgPath="/dumbbell.svg"/>
        <MenuButton title="Cardio Records" color="bg-red-700" content="Duration, calories burned, average heart rate" imgPath="/heart.svg"/>
        <MenuButton title="Nutrition Records" color="bg-green-700" content="Calorie intake, macronutrients, foods" imgPath="/bowl.svg"/>
        <MenuButton title="Sleep Records" color="bg-purple-700" content="Duration, quality, tiredness, wake up time" imgPath="/moon.svg"/>
        <MenuButton title="Body Stats Records" color="bg-blue-700" content="Steps, weight, height, fat percentage" imgPath="/scale.svg"/>
    </MenuButtonGrid>
</BasePage>