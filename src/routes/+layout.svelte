<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import {
        AppBar,
        AppShell,
        Toast,
        Drawer,
        getDrawerStore,
        initializeStores,
        Modal
    } from '@skeletonlabs/skeleton';

    import NavigationBar from '$lib/Components/NavigationBar.svelte';
    import BurgerIcon from '$lib/assets/burger.svelte';

    initializeStores();

    export let data;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    const drawerStore = getDrawerStore();

    $: classesSidebar = session === null ? 'w-0' : 'w-0 lg:w-64';

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        });

        return () => data.subscription.unsubscribe();
    });

    function drawerOpen(): void {
        drawerStore.open({});
    }
</script>

<svelte:head>
    <title>YouOkay</title>
</svelte:head>

<Toast position="tr" />
<Modal />
<Drawer width="w-[280px]">
    <h2 class="flex flex-row p-4 text-xl">
        <img src="$lib/assets/icon.svg" alt="YouOkay icon" class="w-8" />
        <strong>YouOkay</strong>
    </h2>
    <hr />
    <NavigationBar {supabase} />
</Drawer>

<AppShell scrollbarGutter="auto" slotSidebarLeft="bg-surface-500/5 {classesSidebar}">
    <svelte:fragment slot="header">
        {#if session}
            <AppBar>
                <svelte:fragment slot="lead">
                    <div class="flex items-center">
                        <button class="!bg-inherit btn btn-sm mr-4 lg:hidden" on:click={drawerOpen}>
                            <BurgerIcon />
                        </button>
                        <strong class="text-xl">YouOkay</strong>
                    </div>
                </svelte:fragment>
            </AppBar>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
        <NavigationBar {supabase} />
    </svelte:fragment>

    <div>
        <slot />
    </div>

    <svelte:fragment slot="footer">
        <footer class="p-1 text-center">
            <p>
                <strong>YouOkay</strong>
                is in experimental beta.
                <a href="placeholder.com" class="variant-outline btn">Send Feedback</a>
            </p>
        </footer>
    </svelte:fragment>
</AppShell>
