<script lang="ts">
    import { onMount } from 'svelte';
    import type { AuthSession } from '@supabase/supabase-js';
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';

    import Loading from './Loading.svelte';
    import Notice from './Notice.svelte';
    import { fade } from 'svelte/transition';

    export let session: AuthSession;

    let loading = false;
    let notice = false;

    // profile
    let username: string | null = null;
    let pronoun: string | null = null;
    let private_profile: boolean | null = true;

    // connections
    let website: string | undefined;
    let discord: string | null = null;
    let twitter: string | null = null;
    let github: string | null = null;

    // customization
    let string_good: string | null = null;
    let string_bad: string | null = null;

    onMount(() => {
        getProfile();
    });

    const getProfile = async () => {
        try {
            loading = true;
            const { user } = session;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(
                    `username, website, private_profile, discord, twitter, github, string_good, string_bad, pronoun`
                )
                .eq('id', user.id)
                .single();

            if (data) {
                username = data.username;
                pronoun = data.pronoun;
                private_profile = data.private_profile;

                string_good = data.string_good;
                string_bad = data.string_bad;

                website = data.website;
                discord = data.discord;
                twitter = data.twitter;
                github = data.github;
            }

            if (status === 409) throw new Error('Sorry, but this username is invalid.');
            if (error && status !== 406) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
        }
    };

    async function updateProfile() {
        try {
            loading = true;

            const { user } = session;

            website = website?.split('?')[0];

            const updates = {
                id: user.id,
                username,
                pronoun,
                website,
                discord,
                github,
                twitter,
                string_bad,
                string_good,
                has_created: false,
                private_profile,
                updated_at: new Date()
            };

            let { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
            notice = true;
            setTimeout(() => {
                notice = false;
            }, 2400);
        }
    }

    async function signOut() {
        try {
            loading = true;
            let { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            loading = false;
            goto('/');
        }
    }
</script>

<svelte:head>
    <title>Edit your Profile - YouOkay</title>
</svelte:head>

{#if loading}
    <Loading />
{/if}

<h1>Edit Profile</h1>
<form class="form-widget" on:submit|preventDefault={updateProfile}>
    <h2><i class="fa-solid fa-user" /> Profile</h2>
    <label for="username">Username</label>
    <input id="username" type="text" bind:value={username} required />

    <span>
        <input id="private" type="checkbox" bind:checked={private_profile} />
        <label for="private">Make profile private</label>
        <p>
            This will make your profile completely invisible and only your buddies can see your
            profile.
            <br />
        </p>
    </span>

    {#if private_profile}
        <Notice
            icon="triangle-exclamation"
            title="Please note!"
            content="No one will be able to view your profile as for now. Please wait patiently for the buddy system to be implemented."
        />
    {/if}

    <label for="pronoun">Pronouns</label>
    <input id="pronoun" type="text" bind:value={pronoun} />

    <h3>Connections</h3>
    <label for="website"><i class="fa-brands fa-discord" /> Discord</label>
    <input id="website" type="website" bind:value={discord} placeholder="username#1234" />
    <label for="website"><i class="fa-brands fa-twitter" /> Twitter</label>
    <input id="website" type="website" bind:value={twitter} placeholder="@twitter.handle" />
    <label for="website"><i class="fa-brands fa-github" /> GitHub</label>
    <input id="website" type="website" bind:value={github} placeholder="github_username" />
    <label for="website"><i class="fa-solid fa-globe" /> Website</label>
    <input id="website" type="website" bind:value={website} placeholder="https://yourwebsite.com" />
    <hr />

    <h2><i class="fa-solid fa-wrench" /> Customization</h2>
    <h3>Status</h3>
    <p>Customize the "feeling well" status:</p>
    <label for="good">Good</label>
    <input type="text" id="good" bind:value={string_good} placeholder="I'm doing well" />
    <label for="bad">Bad</label>
    <input type="text" id="bad" bind:value={string_bad} placeholder="I'm feeling bad..." />
    <p>These customized prompt will be tied to your account.</p>
    <hr />

    <h2><i class="fa fa-id-card" /> Account</h2>
    <label for="email">Email</label>
    <input id="email" type="text" value={session.user.email} disabled />
    <hr />

    <h3>Update settings?</h3>
    <input type="submit" value={loading ? 'Please wait warmly!' : 'Update'} disabled={loading} />
    {#if notice}
        <span out:fade>
            <Notice
                icon="check"
                title="Profile successfully updated!"
                color="green"
                textColor={true}
            />
        </span>
    {/if}

    <h3>View your profile?</h3>
    <a href="/profile/{username}"><button>View my profile</button></a>

    <h3>Sign out of account?</h3>
    <button on:click={signOut} disabled={loading}>Sign Out <i class="fa fa-sign-out" /></button>
</form>

<style lang="scss">
</style>
