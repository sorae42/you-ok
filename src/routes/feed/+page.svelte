<script lang="ts">
    import Avatar from '$lib/Components/Avatar.svelte';
    import Masonry from 'svelte-bricks';
    import { getFormattedDiff } from '$lib/DateTimeHelper.js';
    import { FaceFrownSolid, FaceSmileBeamSolid } from 'svelte-awesome-icons';
    import type { PageData } from './$types';

    export let data: PageData;

    let { session, supabase, statusList } = data;
    $: ({ session, supabase, statusList } = data);

    /*
    statusList.push({
        httpStatus: 0,
        id: 0,
        username: "YouOkay Announcement",
        avatarUrl: "",
        status: true,
        status_text: "YouOkay is in Beta!",
        text: "Expect things to be changed over time. If you found any bugs, feel free to send a feedback to the button to your left (open the burger menu to see the button if you are on the phone).",
        updated_on: "2023-10-04T14:31:32Z"
    })
    */
</script>

{#await data}
    <p>Loading feed...</p>
{:then}     
<div class="p-2 lg:p-4">
    <Masonry items={statusList} duration={0} let:item minColWidth={400} animate={false} getId={(item) => item.id}>
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
{/await}

