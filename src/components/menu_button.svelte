<script>
    export let color, imgPath, imgTailwind, title, content;
    // @ts-ignore
    let link = title.toLowerCase()
</script>

<a href="{link}" class="{color} rounded-3xl grid place-items-center grid-cols-3 gap-3 shadow-md shadow-black 
hover:brightness-90 hover:shadow-black hover:shadow-xl" style="grid-template-columns: 1fr 2fr">
    <img src="{imgPath}" alt="{title}" class="{imgTailwind} p-5">
    <div class="grid grid-rows-2 w-full h-3/4 md:h-1/2 items-center">
        <h2 class="text-white font-semibold text-2xl md:text-3xl lg:text-4xl text-left w-full">
            {title}
        </h2>
        <p class="text-white text-md md:text-xl lg:text-2xl w-full text-left pr-2">
            {content}
        </p>
    </div>
</a>