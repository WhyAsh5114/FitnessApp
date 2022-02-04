<script type="typescript">
    import BasePage from "/src/components/base_page.svelte";
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<link rel="stylesheet" href="/src/global.css">

<BasePage>
    <div class="buttons-container">
        <MenuButton color="bg-pink-700" imgPath="/SplitsLogo.png" imgTailwind="w-32 md:w-44" title="Splits" content="Make weekly routines, modify current split"/>
        <MenuButton color="bg-purple-700" imgPath="/WorkoutsLogo.png" imgTailwind="w-32 md:w-52" title="Workouts" content="Log workout, cardio, nutrition and more"/>
        <MenuButton color="bg-cyan-700" imgPath="/RecordsLogo.png" imgTailwind="w-24 md:w-36" title="Records" content="See and modify previous workouts, log body metrics"/>
        <MenuButton color="bg-teal-700" imgPath="/TrackingLogo.png" imgTailwind="w-32 md:w-52" title="Tracking" content="Visualise your progress using multiple metrics"/>
    </div>
</BasePage>