<script lang="ts">
    import Avatar from '$lib/Components/Avatar.svelte';
    import { FaceSmileBeamSolid, FaceFrownSolid } from 'svelte-awesome-icons';

    export let data;

    let { session, supabase, username, streamed } = data;
    $: ({ session, supabase, username, streamed } = data);
</script>

<svelte:head>
    <title>{username}'s Profile</title>
</svelte:head>

<div class="flex h-full items-center justify-center">
    <div class="card flex min-w-[50%] flex-col gap-3 rounded-xl p-8 md:flex-row">
        <!-- TODO: placeholder -->
        {#await streamed.profileInfo}
            fetching...
        {:then profileInfo}
            <div class="text-center">
                <Avatar {supabase} url={profileInfo.avatarUrl} size="w-52" name={username} />
                <h2 class="h2"><strong>{profileInfo.display_name}</strong></h2>
                <p>@{profileInfo.username}</p>
            </div>
            <div class="flex h-full w-full flex-col items-center">
                <h3 class="h3 inline-flex items-center gap-2">
                    {#if profileInfo.status}
                        <FaceSmileBeamSolid />
                    {:else}
                        <FaceFrownSolid />
                    {/if}
                    {profileInfo.status_text}
                </h3>
                <p>{profileInfo.text}</p>
                <p>Last updated: {profileInfo.updated_on}</p>
            </div>
        {/await}
    </div>
</div>
