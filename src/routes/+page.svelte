<script lang="ts">
    import { page } from '$app/stores';
    import { MetaTags } from 'svelte-meta-tags';

    import Status from '../Layout/Status.svelte';
    import Homepage from '../Layout/Homepage.svelte';
</script>

<MetaTags
    title="YouOkay - Connected wherever"
    description="A way to let them know that you are doing fine today, even when you are away from social media."
/>

{#if !$page.data.session}
    <Homepage />
{:else}
    <Status />
{/if}
