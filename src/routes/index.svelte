<script type="typescript">
    import MenuButtonGrid from "$lib/menu_button_grid.svelte";
    import MenuButton from "$lib/menu_button.svelte";
</script>


<MenuButtonGrid>
    <MenuButton color="bg-pink-700" imgPath="/calendar.svg" title="Splits" content="Make weekly routines, modify current split"/>
    <MenuButton color="bg-purple-700" imgPath="/pencil.svg" title="Logging" content="Log workout, cardio, nutrition and more"/>
    <MenuButton color="bg-cyan-700" imgPath="/record.svg" title="Records" content="See and modify logged stats like workout and cardio"/>
    <MenuButton color="bg-teal-700" imgPath="/graph.svg" title="Tracking" content="Visualise your progress using multiple metrics"/>
</MenuButtonGrid>
