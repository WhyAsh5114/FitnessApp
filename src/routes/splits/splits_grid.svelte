<script>
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<link rel="stylesheet" href="/src/global.css">

<div class="buttons-container">
    <MenuButton color="bg-pink-700" imgPath="/SplitsLogo.png" imgTailwind="w-32 md:w-44" title="New Split" content="Create a weekly routine from scratch"/>
    <MenuButton color="bg-fuchsia-700" imgPath="/WorkoutsLogo.png" imgTailwind="w-32 md:w-52" title="Common Splits" content="Adjust and use common splits"/>
    <MenuButton color="bg-purple-700" imgPath="/RecordsLogo.png" imgTailwind="w-24 md:w-36" title="Splits Records" content="View, copy and adjust previous splits"/>
</div>