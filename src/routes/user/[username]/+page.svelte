<script lang="ts">
    export let data;

    let { session, supabase, streamed } = data;
    $: ({ session, supabase, streamed } = data);

    
</script>

<svelte:head>
    <title>username - YouOkay</title>
</svelte:head>

<div class="flex h-full justify-center align-middle">
    <div class="">
        {#await streamed.profileInfo}
            fetching...
        {:then profileInfo}
            {profileInfo.username}
        {/await}
    </div>
</div>
