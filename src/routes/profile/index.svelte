<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const router = false;
	export const load: Load = ({ session }) => {
		// If user not logged in, redirect to login
		if (!session?.username) {
			return {
				status: 302,
				redirect: '/profile/login'
			};
			// Else set username to be accessible in client
		} else {
			return {
				props: {
					username: session.username
				}
			};
		}
	};
</script>

<script lang="ts">
	export let username: string;

	async function logout() {
		await fetch('/api/logout', {
			method: 'GET'
		});
		window.location.href = '/profile/login';
	}
</script>

<div class="flex flex-col place-items-center">
	<p class="text-white w-full text-center mb-10" data-test="greet_element">Hi {username}</p>
	<button
		class="text-white text-md bg-red-500 px-3 py-1 rounded-full hover:bg-red-600"
		on:click={logout}
		data-test="logout_button">Logout</button
	>
</div>
