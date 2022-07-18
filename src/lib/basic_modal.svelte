<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { closeModal } from 'svelte-modals';

	export let isOpen: boolean;
	export let title: string;
	export let messages = [];
	export let onClose: Function = null;

	let textarea: HTMLUListElement;

	onMount(() => {
		messages.forEach((message) => {
			let message_element = document.createElement('li');
			message_element.textContent = message;
			textarea.appendChild(message_element);
		});
	});

	onDestroy(() => {
		onClose();
	})
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="contents">
			<h2>{title}</h2>
			<ul bind:this={textarea} />
			<div class="actions">
				<button class="ok-btn" on:click={closeModal}>OK</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 1rem;
		margin-right: 1rem;

		/* allow click-through to backdrop */
		pointer-events: none;
	}

	.contents {
		min-width: 240px;
		border-radius: 6px;
		padding: 16px;
		@apply bg-slate-800;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	h2 {
		text-align: center;
		font-size: 24px;
		@apply font-semibold text-white;
	}

	ul {
		text-align: center;
		margin-top: 16px;
		color: white;
	}

	.actions {
		margin-top: 32px;
		display: flex;
		justify-content: center;
		color: white;
	}

	.ok-btn {
		width: 150px;
		@apply bg-blue-600 py-2 rounded-full;
	}
</style>
