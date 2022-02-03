<script type="typescript">
    import Title from "/src/components/title.svelte";
    import LoginForm from "./login_form.svelte";
    import Footer from "/src/components/footer.svelte";
</script>

<div class="bg-slate-800 grid items-center place-items-center min-h-screen justify-center" id="main-container">
    <Title />
    <LoginForm />
    <Footer />
</div>

<style>
    #main-container
    {
        grid-template-rows: 1fr 5fr 1fr;
    }
</style>