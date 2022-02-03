<script type="typescript">
    import Title from "./title.svelte";
    import Footer from "./footer.svelte";
    import MenuGrid from "./app/menu_grid.svelte";
</script>


<div class="bg-slate-800 grid items-center place-items-center min-h-screen justify-center w-screen" id="main-container">
    <Title />
    <MenuGrid />
    <Footer />
</div>

<style>
    #main-container
    {
        grid-template-rows: 1fr 5fr 1fr;
    }
</style>