<script>
    import MenuButton from "/src/components/menu_button.svelte";
</script>

<div class="grid grid-rows-4 md:grid-cols-2 md:grid-rows-2 gap-5 h-full w-full justify-items-stretch p-5">
    <MenuButton color="bg-pink-700" imgPath="/SplitsLogo.png" imgTailwind="w-32 md:w-44" title="Splits" content="Make weekly routines, modify current split"/>
    <MenuButton color="bg-purple-700" imgPath="/WorkoutsLogo.png" imgTailwind="w-32 md:w-52" title="Workouts" content="Log workout, cardio, nutrition and more"/>
    <MenuButton color="bg-cyan-700" imgPath="/RecordsLogo.png" imgTailwind="w-24 md:w-36" title="Records" content="See and modify previous workouts, log body metrics"/>
    <MenuButton color="bg-teal-700" imgPath="/TrackingLogo.png" imgTailwind="w-32 md:w-52" title="Tracking" content="Visualise your progress using multiple metrics"/>
</div>