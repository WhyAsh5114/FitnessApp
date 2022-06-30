<script lang="ts">
	import MenuButtonGrid from '$lib/menu_button_grid.svelte';
	import MenuButton from '$lib/menu_button.svelte';
</script>

<MenuButtonGrid>
	<MenuButton
		color="bg-pink-700"
		imgPath="/calendar_plus.svg"
		title="New Split"
		content="Create a weekly routine from scratch"
		link="splits/new"
	/>
	<MenuButton
		color="bg-fuchsia-700"
		imgPath="/calendar_PPL.svg"
		title="Common Splits"
		content="Adjust and use common splits"
		link="splits/common"
	/>
	<MenuButton
		color="bg-purple-700"
		imgPath="/calendar_gear.svg"
		title="Modify Split"
		content="Modify current split's exercises, progression"
		link="splits/modify"
	/>
	<MenuButton
		color="bg-violet-700"
		imgPath="/record.svg"
		title="Splits Records"
		content="View, copy and adjust previous splits"
		link="records/splits"
	/>
</MenuButtonGrid>
