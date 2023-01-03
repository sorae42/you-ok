<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';

    import Loading from './Loading.svelte';
    import { error as routeError } from '@sveltejs/kit';

    let loading = false;

    export let username: string;
    let private_profile: boolean | null = true;
    let pronoun: string | null = null;

    let connections = {};
    let website: string | null = null;

    let status_text: string | null = null;
    let string_good: string | null = "I'm doing good!";
    let string_bad: string | null = "I'm feeling bad...";

    let is_well: boolean | null = false;
    let last_well: string;

    let now = DateTime.now();
    let last_hour: number | undefined;

    onMount(async () => {
        try {
            loading = true;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(
                    `pronoun, is_well, last_well, status_text, string_good, string_bad, private_profile, website, github, twitter, discord`
                )
                .eq('username', username)
                .single();

            if (data) {
                pronoun = data.pronoun;

                connections = {
                    twitter: data.twitter,
                    discord: data.discord,
                    github: data.github
                };
                website = data.website;

                string_good = data.string_good;
                string_bad = data.string_bad;
                status_text = data.status_text;

                is_well = data.is_well;
                last_well = data.last_well;
                private_profile = data.private_profile;
            }

            last_hour = now.diff(DateTime.fromISO(last_well), 'hours').toObject().hours;

            if (string_good?.length === 0) string_good = "I'm doing good!";
            if (string_bad?.length === 0) string_bad = "I'm feeling bad...";

            // this currently doesn't work
            if (status === 406 || private_profile === true) throw routeError(404, 'Not Found');
            if (error && status !== 406) throw error;
        } catch (err) {
            if (err instanceof Error) alert(err);
        } finally {
            loading = false;
        }
    });
</script>

<svelte:head>
    <title>{username}'s profile - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    <div id="profile">
        <div id="intro">
            <img src="$lib/assets/default.png" alt="" />
            <span>
                <h2>{username}</h2>
                <p>({pronoun || 'pronoun not specified'})</p>
            </span>
            <button disabled><i class="fa-solid fa-user-plus" /> <strong>Add buddy</strong></button>
        </div>

        <!-- TODO: Rework -->
        <div id="connections">
            <h3>Connections</h3>
            {#each Object.entries(connections) as [social, link]}
                {#if link !== undefined && link !== null && link !== ''}
                    <span>
                        <p>
                            <i class="fa-brands fa-fw fa-{social}" />
                            {link}
                        </p>
                    </span>
                {/if}
            {/each}
            {#if website !== null && website.length > 0}
                <p><i class="fa-solid fa-fw fa-globe" /> <a href={website}>{website}</a></p>
            {/if}
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
                justify-content: center;
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
            border: 2px solid white;
            border-radius: 50%;
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
