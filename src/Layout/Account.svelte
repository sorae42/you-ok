<script lang="ts">
    import { onMount } from 'svelte';
    import type { AuthSession } from '@supabase/supabase-js';
    import { supabase } from '$lib/supabaseClient';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';

    import Loading from './Loading.svelte';

    export let session: AuthSession;

    let loading = false;
    let notice = false;

    // profile
    let username: string | null = null;
    let private_profile: boolean | null = true;

    // connections
    let website: string | null = null;
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
                    `username, website, private_profile, discord, twitter, github, string_good, string_bad`
                )
                .eq('id', user.id)
                .single();

            if (data) {
                username = data.username;
                private_profile = data.private_profile;

                string_good = data.string_good;
                string_bad = data.string_bad;

                website = data.website;
                discord = data.discord;
                twitter = data.twitter;
                github = data.github;
            }

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

            const updates = {
                id: user.id,
                username,
                website,
                discord,
                github,
                twitter,
                string_bad,
                string_good,
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

{#if loading}
    <Loading />
{/if}

<h1>Edit Profile</h1>
<form class="form-widget" on:submit|preventDefault={updateProfile}>
    <h2><i class="fa-solid fa-user" /> Profile</h2>
    <label for="username">Username</label>
    <input id="username" type="text" bind:value={username} required />

    {#if username === 'UNREGISTERED'}
        <p>
            This username will not allow you to use the service and will hide your profile from the
            public.
        </p>
    {/if}

    <span>
        <input id="private" type="checkbox" bind:checked={private_profile} />
        <label for="private">Make profile private</label>
        <p>
            This will make your profile completely invisible and only your buddies can see your
            profile.
        </p>
    </span>

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
        <div id="notice" out:fade>
            <p><i class="fa-solid fa-check" /> Profile updated successfully!</p>
        </div>
    {/if}

    <h3>View your profile?</h3>
    <a href="/profile/{username}"><button>View my profile</button></a>

    <h3>Sign out of account?</h3>
    <button on:click={signOut} disabled={loading}>Sign Out <i class="fa fa-sign-out" /></button>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        width: 42%;

        span {
            margin: 24px 0;
        }
    }
</style>
