<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import {
        AppBar,
        AppShell,
        Toast,
        Drawer,
        getDrawerStore,
        initializeStores,
        Modal,
        storePopup,
    } from '@skeletonlabs/skeleton';
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

    import NavigationBar from '$lib/Components/NavigationBar.svelte';
    import Avatar from '$lib/Components/Avatar.svelte';
    import { XmarkSolid } from 'svelte-awesome-icons';

    initializeStores();

    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

    export let data;

    let { supabase, session, profile } = data;
    $: ({ supabase, session, profile } = data);

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

    function drawerClose(): void {
        drawerStore.close();
    }
</script>

<svelte:head>
    <title>YouOkay</title>
</svelte:head>

<Toast position="tr" />
<Modal />
<Drawer width="w-[280px]" position="right">
    <h2 class="flex flex-row justify-between gap-2 p-4 text-xl">
        <button class="p-0" on:click={drawerClose}>
            <XmarkSolid />
        </button>
        <Avatar {supabase} url={profile?.avatar_url} size="!w-10" name={profile?.display_name} />
    </h2>
    <NavigationBar {supabase} username={profile?.username} displayName={profile?.display_name} />
</Drawer>

<AppShell
    scrollbarGutter="auto"
    slotSidebarLeft="bg-surface-500/5 {classesSidebar}"
    transitionIn={fly}
    transitionOut={fly}
    transitionInParams={{ duration: 420 }}
>
    <svelte:fragment slot="header">
        {#if session}
            <AppBar>
                <svelte:fragment slot="lead">
                    <div class="flex items-center">
                        <h2 class="flex flex-row gap-2 text-xl">
                            <img src="$lib/assets/icon.svg" alt="YouOkay icon" class="w-8" />
                            <span class="variant-filled-warning badge">BETA</span>
                        </h2>
                    </div>
                </svelte:fragment>
                <svelte:fragment slot="trail">
                    <div class="flex gap-2">
                        <button class="p-0" on:click={drawerOpen}>
                            <Avatar
                                {supabase}
                                url={profile?.avatar_url}
                                size="!w-10"
                                name={profile?.display_name}
                            />
                        </button>
                    </div>
                </svelte:fragment>
            </AppBar>
        {/if}
    </svelte:fragment>

    <div>
        <slot />
    </div>
</AppShell>
