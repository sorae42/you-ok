<script>
    import { page } from '$app/stores';
    import Status from '../Layout/Status.svelte';
    import Homepage from '../Layout/Homepage.svelte';
</script>

{#if !$page.data.session}
    <Homepage />
{:else}
    <Status session={$page.data.session} />
{/if}
