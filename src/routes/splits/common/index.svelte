<script>
    import MenuButtonGrid from "$lib/menu_button_grid.svelte";
    import MenuButtonNopicture from "$lib/menu_button_nopicture.svelte";
</script>

<div>
    <MenuButtonGrid>
        <MenuButtonNopicture title="Full Body" color="bg-blue-800" content="Target both upper and lower body muscle groups, each session" split_name="fullbody" />
        <MenuButtonNopicture title="Push Pull Legs" color="bg-sky-700" content="Target one of the three muscle groups, each session" />
        <MenuButtonNopicture title="Upper Lower" color="bg-cyan-600" content="Target either upper body muscles or lower body muscles, each session" />
        <MenuButtonNopicture title="Push Pull" color="bg-teal-600" content="Target either upper or lower (with legs in each), each session" />
    </MenuButtonGrid>
</div>