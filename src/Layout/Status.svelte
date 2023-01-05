<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';

    import Loading from './Loading.svelte';
    import Notice from '../Components/Notice.svelte';
    import { page } from '$app/stores';
    import { getDiff, timeFormatter } from '$lib/DateTimeHelper';

    const { user } = $page.data.session;

    let loading = false;

    let username: string | null = null;

    let status_text: string | null = null;
    let string_good: string | null = "I'm doing good!";
    let string_bad: string | null = "I'm feeling bad...";

    let is_well: boolean | null = false;
    let last_well: string;
    let has_created: boolean | null = true;

    let last_hour: number | undefined;
    let last_day: number | undefined;

    onMount(() => {
        getStatus();
    });

    const getStatus = async () => {
        try {
            loading = true;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(
                    `username, is_well, last_well, status_text, string_good, string_bad, has_created`
                )
                .eq('id', user.id)
                .single();

            if (data) {
                username = data.username;
                string_good = data.string_good;
                string_bad = data.string_bad;
                status_text = data.status_text;
                is_well = data.is_well;
                last_well = data.last_well;
                has_created = data.has_created;
            }

            last_hour = getDiff(last_well).hours;
            last_day = getDiff(last_well).days;

            console.log(getDiff(last_well));

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

            let day: string;

            if (last_day == null || last_day > 0) {
                day = DateTime.now().toISO();
            } else {
                day = last_well;
            }

            const updates = {
                id: user.id,
                is_well,
                status_text,
                last_well: day
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
        {#if last_day === undefined || last_day > 0}
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
        {:else}
            <span>
                {#if last_hour !== undefined}
                    <p>
                        Come back in {timeFormatter(24 - last_hour)} to update your today's wellbeing!
                    </p>
                {/if}
            </span>
        {/if}

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
{/if}
