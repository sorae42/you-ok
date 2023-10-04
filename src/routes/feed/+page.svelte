<script lang="ts">
    import Avatar from '$lib/Components/Avatar.svelte';
    import Masonry from 'svelte-bricks';
    import { getFormattedDiff } from '$lib/DateTimeHelper.js';
    import { FaceFrownSolid, FaceSmileBeamSolid } from 'svelte-awesome-icons';

    export let data;

    let { session, supabase, statusList } = data;
    $: ({ session, supabase, statusList } = data);

</script>

<div class="p-2 lg:p-4">
    <Masonry items={statusList} duration={0} let:item minColWidth={420}>
        <div class="card rounded-lg p-4">
            <div class="flex flex-row">
                <span class="">
                    <Avatar {supabase} url={item.avatarUrl} size="w-12" name={item.username} />
                </span>
                <div class="mx-2 flex flex-col">
                    <strong class="">{item.username}</strong>
                    <span>{getFormattedDiff(item.updated_on)} ago</span>
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
</div>
