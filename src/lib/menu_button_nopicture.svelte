<script lang="ts">
	export let color, title, content, split_name;
</script>

<a
	href="/splits/common/{split_name}"
	class="{color} min-h-fit rounded-xl md:rounded-2xl lg:rounded-3xl grid place-items-center shadow-md shadow-black hover:brightness-90 hover:shadow-black hover:shadow-xl"
>
	<dl class="grid grid-rows-2 w-full h-5/6 md:h-2/3 items-center col-span-2 pb-2">
		<dt
			class="text-white text-center font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl w-full pr-2"
		>
			{title}
		</dt>
		<dd class="text-white text-md md:text-lg lg:text-xl xl:text-2xl w-full text-center px-2">
			{content}
		</dd>
	</dl>
</a>

<style>
	.button-img {
		max-width: 60%;
		max-height: 60%;
	}
</style>
