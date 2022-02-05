<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
</script>

<BasePage>
    <MenuButtonGrid>
        <MenuButton title="Splits Records" color="bg-cyan-700" content="Log your workout with or without a template" imgPath=""/>
        <MenuButton title="Workout Records" color="bg-teal-700" content="Duration, calories burned, average heart rate" imgPath=""/>
        <MenuButton title="Cardio, Nutrition, Sleep" color="bg-emerald-700" content="Calorie intake, macronutrients, foods" imgPath=""/>
        <MenuButton title="Log Sleep" color="bg-green-700" content="Calorie intake, macronutrients, foods" imgPath=""/>
    </MenuButtonGrid>
</BasePage>