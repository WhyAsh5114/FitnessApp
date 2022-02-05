<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<BasePage>
    <MenuButtonGrid>
        <MenuButton color="bg-pink-700" imgPath="/SplitsLogo.png" title="New Split" content="Create a weekly routine from scratch" link="splits/new"/>
        <MenuButton color="bg-fuchsia-700" imgPath="/WorkoutsLogo.png" title="Common Splits" content="Adjust and use common splits" link="splits/common"/>
        <MenuButton color="bg-purple-700" imgPath="/RecordsLogo.png" title="Splits Records" content="View, copy and adjust previous splits" link="records/splits"/>
    </MenuButtonGrid>
</BasePage>