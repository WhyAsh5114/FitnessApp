<script>
    import '../tailwind.css'
    import { Modals, closeModal } from 'svelte-modals'
    import Title from '$lib/title.svelte';
    import Footer from '$lib/footer.svelte';
</script>

<!-- Modal -->
<Modals>
    <div
        slot="backdrop"
        class="backdrop"
        on:click={closeModal}
    />
</Modals>

<!-- Base Layout -->
<div class="bg-slate-800 grid min-h-screen w-full place-items-center menu-container">
    <Title />
    <slot></slot>
    <Footer />
</div>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0,0,0,0.50)
    }

    .menu-container
    {
        grid-template-rows: 1fr 4fr 1fr;
    }
</style>