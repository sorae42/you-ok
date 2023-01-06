<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    import Loading from '../Components/Loading.svelte';
    import Panel from '../Components/Panel.svelte';
    import { getDiff, timeFormatter } from '$lib/DateTimeHelper';

    const { user } = $page.data.session || { user: null };

    let loading = false;

    let avatarUrl: string;
    export let username: string;
    let profile_id: string | null = '';
    let pronoun: string | null = null;

    let connections = {};

    let status_text: string | null = null;
    let string_good: string | null = "I'm doing good!";
    let string_bad: string | null = "I'm feeling bad...";

    let is_well: boolean | null = false;
    let last_well: number | undefined;

    let now = DateTime.now();
    let last_hour: number | undefined;

    // chaining async function is the worst thing to be done.
    onMount(async () => {
        loading = true;
        getProfileData().then(() => {
            if (user !== null) {
                getFollowingData();
            }
            downloadImage(avatarUrl).then(() => {
                loading = false;
            });
        });
    });

    const downloadImage = async (path: string) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);

            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            avatarUrl = url;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error downloading image: ', error.message);
            }
        }
    };

    // move this to +page.ts
    const getProfileData = async () => {
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select(
                    `avatar_url, id, pronoun, is_well, last_well, status_text, string_good, string_bad, website, github, twitter, discord`
                )
                .eq('username', username)
                .single();

            if (data) {
                avatarUrl = data.avatar_url;
                pronoun = data.pronoun;

                connections = {
                    twitter: data.twitter,
                    discord: data.discord,
                    github: data.github,
                    website: data.website
                };

                string_good = data.string_good;
                string_bad = data.string_bad;
                status_text = data.status_text;

                is_well = data.is_well;
                last_well = getDiff(data.last_well, 'hours').hours;
                profile_id = data.id;
            }

            if (string_good?.length === 0) string_good = "I'm doing good!";
            if (string_bad?.length === 0) string_bad = "I'm feeling bad...";

            if (status === 406) {
                goto('/profile-error');
            }
            if (error && status !== 406) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        }
    };

    let isFollowing: boolean | null = false;
    let followId: string | null = '';

    const getFollowingData = async () => {
        try {
            const { data, error, status } = await supabase
                .from('followers')
                .select('id')
                .eq('follower', user.id)
                .eq('following', profile_id)
                .single();

            if (status === 406) {
                isFollowing = false;
            }

            if (data) {
                isFollowing = true;
                followId = data.id;
            }

            if (error && status !== 406) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) alert(error);
        }
    };

    async function followButtonAction() {
        loading = true;
        if (!isFollowing) {
            await supabase
                .from('followers')
                .insert({
                    follower: user.id,
                    following: profile_id
                })
                .then(() => {
                    getFollowingData();
                });
        } else {
            await supabase
                .from('followers')
                .delete()
                .eq('id', followId)
                .then(() => {
                    getFollowingData();
                });
        }
        loading = false;
    }
</script>

<svelte:head>
    <title>{username}'s profile - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    <div id="profile">
        <div id="intro">
            {#if avatarUrl}
                <img src={avatarUrl} alt={avatarUrl ? 'Avatar' : 'No image'} />
            {:else}
                <img src="$lib/assets/default.png" alt="" />
            {/if}
            <span>
                <h2>{username}</h2>
                <p>({pronoun || 'pronoun not specified'})</p>
            </span>
            {#if $page.data.session && user.id !== profile_id}
                <button on:click={followButtonAction}>
                    <strong>{isFollowing ? 'Following' : 'Follow'}</strong>
                </button>
            {/if}
        </div>

        <!-- TODO: Rework -->
        <div id="connections">
            <h3>Connections</h3>
            {#each Object.entries(connections) as [social, link]}
                {#if link !== undefined && link !== null && link !== ''}
                    <span>
                        <p>
                            {#if social !== 'website'}
                                <i class="fa-brands fa-fw fa-{social}" />
                                {link}
                            {:else}
                                <i class="fa-solid fa-fw fa-globe" />
                                {link}
                            {/if}
                        </p>
                    </span>
                {/if}
            {/each}
        </div>
    </div>

    <div id="status">
        {#if last_well === undefined}
            <h3>{username} has just created this account and haven't updated their status yet.</h3>
        {:else}
            <h1>{is_well ? string_good : string_bad}</h1>
            {#if status_text !== null}
                <blockquote>"{status_text}"</blockquote>
            {/if}
            {#if last_well !== undefined}
                <p><i>Last updated: {timeFormatter(last_well)} ago</i></p>
            {/if}
        {/if}
    </div>
{/if}

<style lang="scss">
    div#profile {
        width: 42em;
        padding: 24px;
        border-radius: 15px;
        background-color: rgb(84, 84, 84);
        margin-top: 42px;
        flex-direction: row;

        @media screen and (max-width: 768px) {
            width: 20em;
            flex-direction: column;
        }

        div#intro {
            flex-direction: column;
            width: 20em;
            padding: 0;
            text-align: center;

            button {
                display: flex;
                align-items: center;
                justify-content: space-around;
                font-size: 16px;
            }
        }

        div#connections {
            width: inherit;

            p {
                display: flex;
                align-items: center;
                overflow: hidden;
                white-space: nowrap;

                i {
                    margin-right: 4px;
                    font-size: 24px;
                }
            }
        }

        img {
            width: 8em;
            border: 1px solid white;
            margin: 12px;
        }

        h2,
        h3 {
            display: inline;
            padding: 0;
        }
    }

    div#status {
        text-align: center;
    }
</style>
