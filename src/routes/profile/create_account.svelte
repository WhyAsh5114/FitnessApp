<script context="module" lang="ts">
	// If user is logged in, redirect to /profile
	export async function load({ session }) {
		if(session?.user) {
			return {
				status: 302,
				redirect: '/profile'
			}
		} else { return {} }
	}
</script>

<script lang="ts">
	import { openModal } from 'svelte-modals';
	import Modal from '$lib/basic_modal.svelte';

	let username: string;
	let password: string;
	let confirm_password: string;

	async function register() {
		let errors = [];
		if (!username) {
			errors.push('Username cannot be empty');
		}
		if (!password) {
			errors.push('Password cannot be empty');
		}
		if (password !== confirm_password) {
			errors.push('Passwords do not match');
		}

		if (errors.length === 0) {
			try {
				const res = await fetch('/api/register', {
					method: 'POST',
					body: JSON.stringify({ username, password }),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (res.ok) {
					window.location.href = '/profile'
				} else {
					openModal(Modal, { title: 'Request Error', messages: [res.status, res.statusText] });
				}
			} catch (err) {
				openModal(Modal, { title: 'Error', messages: err });
			}
		} else {
			openModal(Modal, { title: 'Error', messages: errors });
		}
	}
</script>

<form
	class="grid bg-stone-200 m-2 px-6 pt-4 pb-2 md:w-96 rounded-md justify-items-center h-fit"
	on:submit|preventDefault
>
	<h1 class="text-2xl text-slate-900 font-semibold mb-1">Welcome</h1>
	<h1 class="text-lg text-slate-900 mb-4">Register</h1>
	<input
		placeholder="Username"
		type="text"
		class="border-gray-400 border-2 p-2 h-10 outline-none -my-px w-full focus:z-10"
		bind:value={username}
	/>
	<input
		placeholder="Password"
		type="password"
		class="border-gray-400 border-2 p-2 h-10 outline-none w-full -my-px"
		bind:value={password}
	/>
	<input
		placeholder="Confirm Password"
		type="password"
		class="border-gray-400 border-2 p-2 h-10 mb-2 outline-none w-full -my-px"
		bind:value={confirm_password}
	/>
	<button
		class="bg-teal-400 py-1 text-slate-900 rounded-sm text-lg w-full shadow-md my-2 hover:bg-teal-500 active:bg-teal-600"
		on:click={register}>Submit</button
	>
	<div class="mt-7 w-full bg-black h-px" />
	<a href="/profile/login" class="text-blue-700 mt-1">Already have an account? Login</a>
</form>
