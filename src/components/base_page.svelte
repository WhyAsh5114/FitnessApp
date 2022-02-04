<script type="typescript">
    import Title from "./title.svelte";
    import Footer from "./footer.svelte";
</script>

<link rel="stylesheet" href="/src/global.css">

<div class="bg-slate-800 grid items-center place-items-center min-h-screen justify-center w-screen menu-container">
    <Title />
    <slot></slot>
    <Footer />
</div>

<style>
    .menu-container
    {
        grid-template-rows: 1fr 5fr 1fr;
    }
</style>