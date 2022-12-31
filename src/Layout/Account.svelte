<script lang="ts">
    import { onMount } from 'svelte';
    import type { AuthSession } from '@supabase/supabase-js';
    import { supabase } from '$lib/supabaseClient';

    export let session: AuthSession;

    let loading = false;
    let username: string | null = null;
    let website: string | null = null;

    onMount(() => {
        getProfile();
    });

    const getProfile = async () => {
        try {
            loading = true;
            const { user } = session;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website`)
                .eq('id', user.id)
                .single();

            if (data) {
                username = data.username;
                website = data.website;
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
                updated_at: new Date(),
                is_well: new Date()
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
        }
    }
</script>

<div id="main">
    <h1>Edit Profile</h1>
    <form class="form-widget" on:submit|preventDefault={updateProfile}>
        <h2>Basic Infomation</h2>
        <label for="username">Username</label>
        <input id="username" type="text" bind:value={username} />

        <label for="website">Website</label>
        <input id="website" type="website" bind:value={website} />

        <input
            type="submit"
            value={loading ? 'Please wait warmly!' : 'Update'}
            disabled={loading}
        />
        <hr />

        <h2>Customization</h2>
        <h3>Status</h3>
        <p>Customize the "feeling well" status:</p>
        <label for="good">Good</label>
        <input type="text" id="good" placeholder="I'm doing well">
        <label for="good">Bad</label>
        <input type="text" id="good" placeholder="I'm feeling bad...">
        <input
            type="submit"
            value={loading ? 'Please wait warmly!' : 'Update'}
            disabled={loading}
        />
        <hr>

        <h2>Account</h2>

        <label for="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
        <button on:click={signOut} disabled={loading}>Sign Out</button>
    </form>
</div>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        width: 42%;
    }
</style>
