<script lang="ts">
    import Avatar from '$lib/Components/Avatar.svelte';
    import Masonry from 'svelte-bricks';
    import { getFormattedDiff } from '$lib/DateTimeHelper.js';
    import { CommentsSolid, FaceFrownSolid, FaceSmileBeamSolid } from 'svelte-awesome-icons';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';

    export let data: PageData;

    let { session, supabase, streamed } = data;
    $: ({ session, supabase, streamed } = data);

    let loading = false;
    let profileForm: HTMLFormElement;

    let nItems = 4;
    $: items = [...Array(nItems).keys()];

    const handleSubmit = () => {
        loading = true;
        return async () => {
            loading = false;
        };
    };
</script>

<svelte:head>
    <title>Your Feed</title>
</svelte:head>

<div class="p-2 lg:p-4">
    <div class="flex justify-center">
        <div class="card rounded-lg p-4 [&>*>*]:my-1">
            {#await streamed.user}
                <div class="placeholder animate-pulse" />
                <br />
                <div class="placeholder animate-pulse" />
            {:then userStatus}
                <form
                    action="?/update"
                    method="post"
                    use:enhance={handleSubmit}
                    bind:this={profileForm}
                >
                    <select name="status" id="status" class="select">
                        <option value="true">{userStatus.string_good}</option>
                        <option value="false" selected={!userStatus.is_well}>
                            {userStatus.string_bad}
                        </option>
                    </select>
                    <!-- prettier-ignore -->
                    <textarea name="status-text" id="status-text" rows="3">{userStatus.status_text}</textarea>
                    <input type="submit" value="Update Status" disabled={loading} />
                </form>
            {/await}
        </div>
    </div>
    <br />
    {#await streamed.statusList}
        <!-- TODO: make better placeholder -->
        <Masonry {items} duration={0} minColWidth={500} animate={false}>
            <div class="card rounded-lg p-4 [&>*]:rounded-xl">
                <div class="!placeholder-circle w-12 animate-pulse" />
                <br />
                <div class="placeholder animate-pulse" />
                <br />
                <div class="placeholder animate-pulse" />
            </div>
        </Masonry>
    {:then statusItems}
        {#if statusItems.length > 0}
            <Masonry
                items={statusItems}
                duration={0}
                let:item
                minColWidth={500}
                animate={false}
                getId={(item) => item.id}
            >
                <div class="card rounded-lg p-4">
                    <div class="flex flex-row">
                        <span>
                            <a href="/user/{item.username}">
                                <Avatar
                                    {supabase}
                                    url={item.avatarUrl}
                                    size="w-12"
                                    name={item.display_name}
                                />
                            </a>
                        </span>
                        <div class="mx-2 flex flex-col">
                            <strong>
                                {item.display_name}
                                {#if item.badge !== null}
                                    <span class="variant-filled-secondary badge mx-2">
                                        {item.badge}
                                    </span>
                                {/if}
                            </strong>
                            <span>@{item.username} · {getFormattedDiff(item.updated_on)} ago</span>
                        </div>
                    </div>
                    <article>
                        <span class="my-2 flex flex-row gap-2">
                            {#if item.status}
                                <FaceSmileBeamSolid />
                            {:else}
                                <FaceFrownSolid />
                            {/if}
                            <strong>{item.status_text}</strong>
                        </span>
                        <p>
                            {item.text}
                        </p>
                    </article>
                </div>
            </Masonry>
            <br />
            <p class="text-center">No more status to show.</p>
        {:else}
            <div class="flex flex-col items-center">
                <br />
                <img src="$lib/assets/question.svg" alt="question mark icon" class="w-64" />
                <p class="text-center">
                    It seems you haven't followed anyone or they haven't write any status.
                </p>
            </div>
        {/if}
    {/await}
</div>
