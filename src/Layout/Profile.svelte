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

    let website: string | null = null;
    let discord: string | null = null;
    let twitter: string | null = null;
    let github: string | null = null;

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

                website = data.website;
                discord = data.discord;
                twitter = data.twitter;
                github = data.github;

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
        return error(404, "Not Found");
    }
</script>

<svelte:head>
    <title>{username}'s profile - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    <h2>{username}'s today status:</h2>
    <p>({pronoun})</p>
    <h1>{is_well ? string_good : string_bad}</h1>
    {#if status_text !== null}
        <blockquote>Message: {status_text}</blockquote>
    {/if}
{/if}

<style lang="scss">
</style>
