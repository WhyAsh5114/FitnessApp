<script lang="ts">
    import { page } from "$app/stores";
    console.log($page)
</script>

<div>
    <p class="text-white">{$page.params.split_name}</p>
</div>