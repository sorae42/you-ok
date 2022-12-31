<script lang="ts">
    function get_random(list: Array<string>) {
        return list[Math.floor(Math.random() * list.length)];
    }

    const subject = ['friends', 'family', 'loved one'];
    const verb = ['OK', 'safe', 'fine'];

    import { supabase } from '$lib/supabaseClient';

    let loading = false;
    let email: string;

    const handleLogin = async () => {
        try {
            loading = true;
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            alert('Check your email for the login link!');
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
    <title>YouOkay</title>
</svelte:head>

<div id="main">
    <h1>Let your {get_random(subject)} know that you are {get_random(verb)}.</h1>
    <p>
        A way to let them know that you are doing fine today, even when you are away from social
        media.
    </p>
</div>

<div id="login">
    <h2>Getting Started</h2>
    <form method="post" on:submit|preventDefault={handleLogin}>
        <label for="username">Email</label>
        <input
            type="email"
            name="username"
            id="username"
            bind:value={email}
            placeholder="example@mail.com"
            required
        />
        <br />
        <input type="submit" value={loading ? 'Please wait warmly!' : 'Send magic link'} />
    </form>
    <a href="/">Why "magic link"?</a>
</div>

<style lang="scss">
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;

        form {
            display: flex;
            flex-direction: column;
            width: 24%;

            input[type='email'] {
                width: 100%;
            }
        }

        &#main, &#login {
            height: 50vh;
        }
    }
</style>
