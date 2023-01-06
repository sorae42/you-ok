<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';

    import Loading from '../Components/Loading.svelte';
    import Notice from '../Components/Notice.svelte';
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';

    const { user } = $page.data.session;

    let loading = false;
    let notice = false;

    let username: string | null = null;

    let status_text: string | null = null;
    let string_good: string | null = "I'm doing good!";
    let string_bad: string | null = "I'm feeling bad...";

    let is_well: boolean | null = false;
    let has_created: boolean | null = true;

    onMount(() => {
        getStatus();
    });

    const getStatus = async () => {
        try {
            loading = true;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, is_well, status_text, string_good, string_bad, has_created`)
                .eq('id', user.id)
                .single();

            if (data) {
                username = data.username;
                string_good = data.string_good || "I'm doing good!";
                string_bad = data.string_bad || "I'm feeling bad...";
                status_text = data.status_text;
                is_well = data.is_well;
                has_created = data.has_created;
            }

            if (error && status !== 406) throw error;
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        } finally {
            loading = false;
        }
    };

    const updateStatus = async () => {
        try {
            loading = true;

            const updates = {
                id: user.id,
                is_well,
                status_text,
                last_well: DateTime.now().toISO()
            };

            let { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
            getStatus();
            notice = true;
            setTimeout(() => {
                notice = false;
            }, 2400);
        }
    };
</script>

<svelte:head>
    <title>Update your status - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    {#if has_created}
        <Notice
            icon="hand-peace"
            title="Welcome!"
            content="If you haven't set up your profile and username yet, head to Edit Profile and start there!"
            color="green"
            textColor={true}
        />
    {/if}

    <h1>Update your status</h1>

    <form method="post" on:submit|preventDefault={updateStatus}>
        <span>
            <p>How are you feeling today?</p>
            <input
                type="radio"
                id="good"
                name="quick-stat"
                bind:group={is_well}
                value={true}
                required
            />
            <label for="good">{string_good}</label>
            <br />
            <input
                type="radio"
                id="bad"
                name="quick-stat"
                bind:group={is_well}
                value={false}
                checked
                required
            />
            <label for="bad">{string_bad}</label>
        </span>
        <span>
            <label for="long-stat">Status (limit to 200 characters)</label>
            <input
                type="text"
                id="long-stat"
                name="long-stat"
                maxlength="200"
                placeholder="I'm doing good today!"
                bind:value={status_text}
            />
        </span>

        <input type="submit" value="Update my status" />
        <a href="/profile/{username}"><button>View my profile</button></a>
    </form>

    {#if notice}
        <span out:fade>
            <Notice
                icon="check"
                title="Status successfully updated!"
                color="green"
                textColor={true}
            />
        </span>
    {/if}
{/if}
