<script lang="ts">
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabaseClient';
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import '../app.scss';

    onMount(() => {
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(() => {
            invalidate('supabase:auth');
        });

        return () => {
            subscription.unsubscribe();
        };
    });
</script>

<nav>
    <span id="left">
        <a href="/">α[logo here]</a>
    </span>
    {#if $page.data.session}
        <span id="right">
            <a href="/buddy"><strike>Buddy list</strike></a>
            <a href="/profile">Profile</a>
        </span>
    {/if}
</nav>

<div id="main">
    <slot />
</div>

<footer>
    <span>
        <p><strong>YouOkay</strong> - Connected wherever.</p>
        <p>
            Made with <i class="fa-solid fa-heart" /> by
            <a href="https://sorae42.github.io">sorae42</a>!
        </p>
    </span>
    <span>
        <p>YouOkay is still in the alpha development.</p>
    </span>
</footer>

<style lang="scss">
    div#main {
        flex: 1;
    }

    nav {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: #424242;
        width: 100vw;
        height: 42px;

        span {
            padding: 0 42px;

            * {
                padding: 0 10px;
            }
        }

        a {
            color: white;
            text-decoration: none;
            height: 100%;

            &:hover {
                background-color: white;
                color: black;
            }
        }
    }

    footer {
        width: 100%;
        bottom: 0;
        background-color: #2d2d2d;
        margin-top: 24px;

        span {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
        }
    }
</style>
