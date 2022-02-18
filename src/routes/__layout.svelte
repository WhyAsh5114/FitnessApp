<script>
	import '../tailwind.css';
	import { Modals, closeModal } from 'svelte-modals';
	import { page } from '$app/stores';
	import { blur, fly } from 'svelte/transition';
	import Title from '$lib/title.svelte';
	import Footer from '$lib/footer.svelte';
	import { cubicIn, linear, quadInOut } from 'svelte/easing';

	let url;
	page.subscribe((value) => {
		url = value;
	});
</script>

<!-- Modal -->
<Modals>
	<div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<!-- Base Layout -->
{#key url}
	<div
		class="bg-slate-800 grid min-h-screen w-full place-items-center menu-container"
		in:blur={{ duration: 100, easing: linear }}
	>
		<Title />
		<slot />
		<Footer />
	</div>
{/key}

<style>
	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.menu-container {
		grid-template-rows: 1fr 4fr 1fr;
	}
</style>
