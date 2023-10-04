<script lang="ts">
    import Avatar from '$lib/Components/Avatar.svelte';
    import Masonry from 'svelte-bricks';
    import { getFormattedDiff } from '$lib/DateTimeHelper.js';
    import { FaceFrownSolid, FaceSmileBeamSolid } from 'svelte-awesome-icons';
    import type { PageData } from './$types';

    export let data: PageData;

    let { session, supabase, streamed } = data;
    $: ({ session, supabase, streamed } = data);

    let nItems = 5;
    $: items = [...Array(nItems).keys()];

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

<div class="p-2 lg:p-4">
    {#await data.streamed.statusList}
        <!-- TODO: make better placeholder -->
        <Masonry {items} duration={0} minColWidth={400} animate={false}>
            <div class="card rounded-lg p-4">
                <div class="placeholder-circle w-12 animate-pulse"></div>
                <br />
                <div class="placeholder animate-pulse" />
            </div>
        </Masonry>
    {:then statusItems}
        <Masonry
            items={statusItems}
            duration={0}
            let:item
            minColWidth={400}
            animate={false}
            getId={(item) => item.id}
        >
            <div class="card rounded-lg p-4">
                <div class="flex flex-row">
                    <span>
                        <Avatar {supabase} url={item.avatarUrl} size="w-12" name={item.username} />
                    </span>
                    <div class="mx-2 flex flex-col">
                        <strong>{item.username}</strong>
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
    {/await}
</div>
