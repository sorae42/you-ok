<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';
    import { error } from '@sveltejs/kit';

    import Loading from './Loading.svelte';

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
    let last_well: Date | null = null;

    let now = DateTime.now();

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

            if (string_good?.length === 0) string_good = "I'm doing good!";
            if (string_bad?.length === 0) string_bad = "I'm feeling bad...";

            if (status === 406 || private_profile === true) notFound();
            if (error && status !== 406) throw error;
        } catch (err) {
            if (err instanceof Error) alert(err);
        } finally {
            loading = false;
        }
    });

    function notFound() {
        return error(404, 'Not Found');
    }
</script>

<svelte:head>
    <title>{username}'s profile - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    <div id="profile">
        <img src="$lib/assets/default.png" alt="" />
        <span>
            <h2>{username}</h2>
            <span>({pronoun})</span>
        </span>

        <h3>Connections</h3>
        <div id="connections">
            {#each Object.entries(connections) as [social, link]}
                <span>
                    <p>
                        <i class="fa-brands fa-fw fa-{social}" /> {link}
                    </p>
                </span>
            {/each}
            <p><i class="fa-solid fa-fw fa-globe" /> <a href={website}>{website}</a></p>
        </div>
    </div>
    <div id="status">
        <h2>{username}'s today status:</h2>
        <h1>{is_well ? string_good : string_bad}</h1>
        {#if status_text !== null}
            <blockquote>Message: {status_text}</blockquote>
        {/if}
    </div>
{/if}

<style lang="scss">
    div {
        width: 42%;
        padding: 24px;
        border-radius: 15px;
    }

    div#profile {
        background-color: rgb(84, 84, 84);
        margin-top: 42px;

        i {
            font-size: 24px;
        }

        img {
            width: 24%;
            height: auto;
            border-radius: 50%;
            margin: 12px;
        }

        h2 {
            display: inline;
        }

        div#connections {
            display: block;
            padding: 0;
        }
    }
</style>
