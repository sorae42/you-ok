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
    {#if $page.data.session}
        <span>
            <a href="/">
                <span>Update Status</span>
                <i class="fas fa-fw fa-pen-to-square" />
            </a>
            <a href="/feed">
                <span>Feed</span>
                <i class="fas fa-fw fa-message" />
            </a>
            <a href="/profile">
                <span>Edit Profile</span>
                <i class="fas fa-fw fa-user-pen" />
            </a>
        </span>
    {:else}
        <span>
            <img src="$lib/assets/icon.svg" alt="YouOkay">
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
        <p>YouOkay is in beta.</p>
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
        height: 50px;

        span {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;

            img {
                width: 48px;
                height: auto;
            }

            a {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                width: 60px;
                height: inherit;
                margin: 0 6px;
                color: white;
                text-decoration: none;

                i {
                    font-size: 24px;
                }

                span {
                    font-size: 8px;
                    height: fit-content;
                    white-space: nowrap;
                }

                &:hover {
                    background-color: white;
                    color: black;
                }
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

            @media screen and (max-width: 768px) {
                flex-direction: column;
            }
        }
    }
</style>
