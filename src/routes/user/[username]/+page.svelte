<script lang="ts">
    export let data;

    let { session, supabase, username, streamed } = data;
    $: ({ session, supabase, username, streamed } = data);
</script>

<svelte:head>
    <title>{username}'s Profile</title>
</svelte:head>

<div class="flex h-full justify-center align-middle">
    <div class="">
        <!-- TODO: placeholder -->
        {#await streamed.profileInfo}
            fetching...
        {:then profileInfo}
            {profileInfo.username}
        {/await}
    </div>
</div>
