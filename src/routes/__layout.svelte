<script>
    import '../tailwind.css'
    import { Modals, closeModal } from 'svelte-modals'
</script>

<Modals>
    <div
        slot="backdrop"
        class="backdrop"
        on:click={closeModal}
    />
</Modals>
  
<div class="">
    <slot></slot>
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
</style>