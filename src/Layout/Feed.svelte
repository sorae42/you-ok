<script lang="ts">
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';
    import { getDiff, timeFormatter } from '$lib/DateTimeHelper';

    import Notice from '../Components/Notice.svelte';
    import Panel from '../Components/Panel.svelte';
    import Loading from '../Components/Loading.svelte';

    const { user } = $page.data.session;

    interface user {
        username: string;
        avatarUrl: string;
        last_well: number | undefined;
        is_well: boolean;
        status: string;
        string_good: string;
        string_bad: string;
    }

    let loading = false;
    let followerList: Array<user> = [];

    let now = DateTime.now();

    onMount(() => {
        loading = true;
        getFollowers().then(() => {
            loading = false;
        });
    });

    async function getFollowers() {
        try {
            const { data, error, status } = await supabase.from('followers').select('following');

            if (data) {
                data.forEach(async (user) => {
                    const { data, error, status } = await supabase
                        .from('profiles')
                        .select(
                            'username, avatar_url, is_well, last_well, status_text, string_good, string_bad'
                        )
                        .eq('id', user.following)
                        .single();

                    if (data) {
                        const image_url = (await downloadImage(data.avatar_url)) || '';

                        followerList.push({
                            username: data.username,
                            avatarUrl: image_url,
                            last_well: getDiff(data.last_well, 'hours').hours,
                            is_well: data.is_well,
                            status: data.status_text,
                            string_good: data.string_good || "I'm doing good!",
                            string_bad: data.string_bad || "I'm feeling bad..."
                        });

                        followerList = followerList
                            .filter((item): item is user => !!item)
                            .sort((a, b) => (a.last_well! < b.last_well! ? -1 : 1));
                    }
                });
            }

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        }
    }

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);

            if (error) {
                throw error;
            }

            return URL.createObjectURL(data);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error downloading image: ', error.message);
            }
        }
    }
</script>

<svelte:head>
    <title>Status Feed - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{/if}

<div id="follow-list">
    {#each followerList as user}
        {#if user.last_well !== undefined}
            <Panel>
                <a href="/profile/{user.username}">
                    <div class="user">

                        <!-- Header of the status -->
                        <span class="title">
                            {#if user.avatarUrl}
                                <img
                                    src={user.avatarUrl}
                                    alt={user.avatarUrl ? 'Avatar' : 'No image'}
                                />
                            {:else}
                                <img src="$lib/assets/default.png" alt="" />
                            {/if}
                            <span>
                                <p><strong>{user.username}</strong></p>
                                {#if user.last_well !== undefined}
                                    <p><i>{timeFormatter(user.last_well)} ago</i></p>
                                {/if}
                            </span>
                        </span>

                        <!-- Body of the status-->
                        <span>
                            <p>
                                <strong>Status:</strong>
                                {user.is_well ? user.string_good : user.string_bad}
                            </p>
                            {#if user.status}
                                <p>"{user.status}"</p>
                            {/if}
                        </span>
                    </div>
                </a>
            </Panel>
        {/if}
    {/each}
</div>

<i>
    {#if followerList.length > 0}
        <p>No more status to show.</p>
    {:else}
        <p>It's empty here... Why don't you go follow some of your friend?</p>
        <p>They don't have YouOkay account? Spread the word to them!</p>
    {/if}
</i>

<style lang="scss">
    a {
        text-decoration: none !important;
    }

    div.user {
        display: flex;
        width: fit-content;
        min-width: 24em;
        justify-content: space-evenly;

        span {
            width: 90%;
            text-align: left;
            margin: 0 10px;

            &.title {
                display: flex;
                align-items: center;
                justify-content: left;
                
                p {
                    margin: 0 5px;
                }
            }

        }

        img {
            width: 3em;
            border: 1px solid white;
            margin: 8px;
        }
    }
</style>
