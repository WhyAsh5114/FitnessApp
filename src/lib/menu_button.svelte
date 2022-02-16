<script>
    // @ts-ignore
    export let color, imgPath, title, content, link = title.toLowerCase();
</script>

<a href="{link}" class="{color} min-h-fit rounded-xl md:rounded-2xl lg:rounded-3xl grid place-items-center grid-cols-3 gap-3 shadow-md shadow-black 
hover:brightness-90 hover:shadow-black hover:shadow-xl">
    <img src="{imgPath}" alt="{link}" class="button-img">
    <dl class="grid grid-rows-2 w-full h-5/6 md:h-2/3 items-center col-span-2">
        <dt class="text-white font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-left w-full pr-2">
            {title}
        </dt>
        <dd class="text-white text-md md:text-lg lg:text-xl xl:text-2xl w-full text-left pr-2">
            {content}
        </dd>
    </dl>
</a>

<style>
    .button-img
    {
        max-width: 60%;
        max-height: 60%;
    }
</style>