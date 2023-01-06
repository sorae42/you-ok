<script>
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$page.error?.message}! - YouOkay</title>
</svelte:head>

<div>
    <h1>Oops!</h1>
    <p>{$page.error?.message}</p>
</div>
