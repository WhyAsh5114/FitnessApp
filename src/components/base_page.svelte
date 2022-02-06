<script type="typescript">
    import Title from "./title.svelte";
    import Footer from "./footer.svelte";
</script>

<style>
    .menu-container
    {
        grid-template-rows: 1fr 4fr 1fr;
    }
</style>

<div class="bg-slate-800 grid min-h-screen w-full place-items-center menu-container">
    <Title />
    <slot>
        <div>

        </div>
    </slot>
    <Footer />
</div>