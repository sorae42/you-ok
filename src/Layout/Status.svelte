<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import type { AuthSession } from '@supabase/supabase-js';
    import { onMount } from 'svelte';

    import Loading from './Loading.svelte';

    export let session: AuthSession;

    let loading = false;

    let username: string | null = null;

    let status_text: string | null = null;
    let string_good: string | null = "I'm doing good!";
    let string_bad: string | null = "I'm feeling bad...";

    let is_well: boolean | null = false;
    let last_well: Date | null = null;

    let now = new Date();

    onMount(() => {
        getStatus();
    });

    const getStatus = async () => {
        try {
            loading = true;
            const { user } = session;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, is_well, last_well, status_text, string_good, string_bad`)
                .eq('id', user.id)
                .single();

            if (data) {
                username = data.username;
                string_good = data.string_good;
                string_bad = data.string_bad;
                status_text = data.status_text;
                is_well = data.is_well;
                last_well = data.last_well;
            }

            let last_well_date = new Date(last_well);

            if (last_well_date.getTime() - now.getTime() > 86400000) {}

            if (string_good?.length === 0) string_good = "I'm doing good!";
            if (string_bad?.length === 0) string_bad = "I'm feeling bad...";

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
            const { user } = session;

            const updates = {
                id: user.id,
                last_well: new Date()
            };

            let { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>Update your status</title>
</svelte:head>

{#if loading}
    <Loading />
{/if}

{#if username === 'UNREGISTERED'}
    <h2>You need a username!</h2>
    <p>
        If you haven't set your username yet, please do so in the <a href="/profile">profile page</a
        >!
    </p>
    <p>Also, your username can't be "UNREGISTERED" either. It doesn't make sense either, is it?</p>
{:else}
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
        <p>
            Once you updated your status, you cannot change how you are feeling within 24 hours.
            However, you can still change the status at will.
        </p>
        <input type="submit" value="Update my status" />
    </form>
{/if}

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        width: 42%;

        input[type='text'] {
            width: 100%;
        }

        span {
            margin: 24px 0;
        }
    }
</style>
