<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';

    import Loading from './Loading.svelte';
    import { error as routeError } from '@sveltejs/kit';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Notice from '../Components/Notice.svelte';

    const { user } = $page.data.session;

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
    let last_well: string;

    let now = DateTime.now();
    let last_hour: number | undefined;

    // chaining async function is the worst thing to be done.
    onMount(async () => {
        loading = true;
        getProfileData().then(() => {
            downloadImage(avatarUrl);
            getBuddyData().then(() => {
                getBuddyRequest().then(() => {
                    loading = false;
                });
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

    const getProfileData = async () => {
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select(
                    `avatar_url, id, pronoun, is_well, last_well, status_text, string_good, string_bad, private_profile, website, github, twitter, discord`
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
                last_well = data.last_well;
                profile_id = data.id;
            }

            last_hour = now.diff(DateTime.fromISO(last_well), 'hours').toObject().hours;

            if (string_good?.length === 0) string_good = "I'm doing good!";
            if (string_bad?.length === 0) string_bad = "I'm feeling bad...";

            if (status === 406) {
                goto('/profile-error');
                throw routeError(404, 'Not Found');
            }
            if (error && status !== 406) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        }
    };

    let buddyId: string | null = '';
    let isBuddy: boolean | null = false;
    let isMutual: boolean | null = false;
    let buddyButton: string | null = 'Add Buddy';
    let buddyIcon: string | null = 'user-plus';
    $: buddyStatus = 0;

    const getBuddyData = async () => {
        try {
            const { data, error, status } = await supabase
                .from('buddylist')
                .select('id, is_mutual')
                .eq('me', user.id)
                .eq('you', profile_id)
                .single();

            if (data) {
                buddyId = data.id;
                buddyButton = 'Cancel request';
                buddyIcon = 'user-minus';
                buddyStatus = 1;

                if (data.is_mutual) {
                    buddyButton = 'Remove Buddy';
                    buddyIcon = 'user-xmark';
                    buddyStatus = 2;
                }
            }

            if (error && status !== 406) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        }
    };

    const getBuddyRequest = async () => {
        try {
            const { data, error, status } = await supabase
                .from('buddylist')
                .select('id, is_mutual')
                .eq('me', profile_id)
                .eq('you', user.id)
                .single();

            if (data) {
                if (!data.is_mutual) {
                    buddyId = data.id;
                    buddyButton = 'Accept request';
                    buddyIcon = 'user-check';
                    buddyStatus = 3;
                }
            }

            if (error && status !== 406) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        }
    };

    const addBuddy = async () => {
        try {
            loading = true;

            const buddy = {
                me: user.id,
                you: profile_id
            };

            let { error } = await supabase.from('buddylist').upsert(buddy);

            buddyStatus = 1;

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        } finally {
            loading = false;
        }
    };

    const acceptBuddy = async () => {
        try {
            loading = true;

            let { error } = await supabase
                .from('buddylist')
                .update({ is_mutual: true })
                .eq('id', buddyId);

            buddyStatus = 2;

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        } finally {
            loading = false;
        }
    };

    const removeBuddy = async () => {
        try {
            loading = true;

            const { error } = await supabase.from('buddylist').delete().eq('id', buddyId);

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error);
        } finally {
            loading = false;
        }
    };

    function buddyAction() {
        switch (buddyStatus) {
            case 0:
                addBuddy();
                break;
            case 1:
            case 2:
                removeBuddy();
                break;
            case 3:
                acceptBuddy();
        }
    }
</script>

<svelte:head>
    <title>{username}'s profile - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    {#if false}
        <Notice
            icon="user-group"
            title={username + ' is on YouOkay.'}
            content="Sign in to add this person as buddy."
            color="grey"
            textColor={true}
        />
    {/if}
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
            {#if false && $page.data.session && user.id !== profile_id}
                <!-- on:click={buddyAction} -->
                <button disabled
                    ><i class="fa-solid fa-fw fa-{buddyIcon}" /><strong>{buddyButton}</strong
                    ></button
                >
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
        {#if last_hour === undefined}
            <h3>{username} has just created this account and haven't updated their status yet.</h3>
        {:else if last_hour < 25}
            <h2>{username}'s today status:</h2>
            <h1>{is_well ? string_good : string_bad}</h1>
            {#if status_text !== null}
                <blockquote>Message: {status_text}</blockquote>
            {/if}
        {:else}
            <h3>{username} has not updated their status for the past 24 hours.</h3>
            <p>Their last status was "{is_well ? string_good : string_bad}"</p>
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
        width: 25em;
        text-align: center;
    }
</style>
