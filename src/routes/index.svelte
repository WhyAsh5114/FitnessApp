<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<BasePage>
    <MenuButtonGrid>
        <MenuButton color="bg-pink-700" imgPath="/calendar.svg" imgTailwind="w-28 md:w-44" title="Splits" content="Make weekly routines, modify current split"/>
        <MenuButton color="bg-purple-700" imgPath="/dumbbell.svg" imgTailwind="w-32 md:w-52" title="Logging" content="Log workout, cardio, nutrition and more"/>
        <MenuButton color="bg-cyan-700" imgPath="/record.svg" imgTailwind="w-24 md:w-36" title="Records" content="See and modify previous workouts, log body metrics"/>
        <MenuButton color="bg-teal-700" imgPath="/graph.svg" imgTailwind="w-32 md:w-52" title="Tracking" content="Visualise your progress using multiple metrics"/>
    </MenuButtonGrid>
</BasePage>