<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<BasePage>
    <MenuButtonGrid>
        <MenuButton title="Log Workout" color="bg-zinc-600" content="Reps, sets, load, duration, calories burned" imgPath="/dumbbell.svg"/>
        <MenuButton title="Log Cardio" color="bg-red-700" content="Duration, calories burned, average heart rate" imgPath="/heart.svg"/>
        <MenuButton title="Log Nutrition" color="bg-green-700" content="Calorie intake, macronutrients, foods" imgPath="/bowl.svg"/>
        <MenuButton title="Log Sleep" color="bg-purple-700" content="Duration, quality, tiredness, wake up time" imgPath="/moon.svg"/>
        <MenuButton title="Log Body Stats" color="bg-blue-700" content="Steps, weight, height, fat percentage" imgPath="/scale.svg"/>
    </MenuButtonGrid>
</BasePage>