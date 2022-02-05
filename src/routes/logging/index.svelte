<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<link rel="stylesheet" href="/src/global.css">

<BasePage>
    <MenuButtonGrid>
        <MenuButton title="Log Workout" color="bg-purple-700" content="Reps, sets, load, duration, calories burned" imgPath=""/>
        <MenuButton title="Log Cardio" color="bg-violet-700" content="Duration, calories burned, average heart rate" imgPath=""/>
        <MenuButton title="Log Nutrition" color="bg-indigo-700" content="Calorie intake, macronutrients, foods" imgPath=""/>
        <MenuButton title="Log Sleep" color="bg-blue-700" content="Duration, quality, tiredness, wake up time" imgPath=""/>
        <MenuButton title="Log Body Stats" color="bg-blue-700" content="Steps, weight, height, fat percentage" imgPath=""/>
    </MenuButtonGrid>
</BasePage>