<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButtonGrid from "/src/components/menu_button_grid.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<BasePage>
    <MenuButtonGrid>
        <MenuButton color="bg-pink-700" imgPath="/SplitsLogo.png" imgTailwind="w-32 md:w-44" title="New Split" content="Create a weekly routine from scratch" link="splits/new"/>
        <MenuButton color="bg-fuchsia-700" imgPath="/WorkoutsLogo.png" imgTailwind="w-32 md:w-52" title="Common Splits" content="Adjust and use common splits" link="splits/common"/>
        <MenuButton color="bg-purple-700" imgPath="/RecordsLogo.png" imgTailwind="w-24 md:w-36" title="Splits Records" content="View, copy and adjust previous splits" link="records/splits"/>
    </MenuButtonGrid>
</BasePage>