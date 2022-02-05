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

<div class="bg-slate-800 grid items-center place-items-center min-h-screen justify-center w-screen menu-container">
    <Title />
    <slot>
        <div></div>
    </slot>
    <Footer />
</div>