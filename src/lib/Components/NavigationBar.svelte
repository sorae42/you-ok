<script lang="ts">
    import { getDrawerStore, popup } from '@skeletonlabs/skeleton';
    import type { ModalSettings, PopupSettings } from '@skeletonlabs/skeleton';
    import {
        CommentsSolid,
        NewspaperSolid,
        PenToSquareSolid,
        PersonCircleMinusSolid,
        UserPenSolid
    } from 'svelte-awesome-icons';

    import { getModalStore } from '@skeletonlabs/skeleton';
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { redirect } from '@sveltejs/kit';
    
    const drawerStore = getDrawerStore();

    function drawerClose(): void {
        drawerStore.close();
    }


    export let supabase: SupabaseClient;

    const modalStore = getModalStore();

    const modal: ModalSettings = {
        type: 'confirm',
        title: 'Do you want to sign out?',
        buttonTextConfirm: 'Sign out',
        response: async (r: boolean) => {
            if (r === true) {
                const session = await supabase.auth.getSession();
                if (session) {
                    await supabase.auth.signOut();
                    throw redirect(303, '/');
                }
            }
        }
    };

    const updateStatusDisallow: PopupSettings = {
        event: 'hover',
        target: 'updateStatusDisallow',
        placement: 'bottom'
    };

    async function signOut() {
        drawerClose();
        modalStore.trigger(modal);
    }
</script>

<div class="card p-4 variant-filled-secondary z-50" data-popup="updateStatusDisallow">
	<p>This feature is being reworked on. Check back soon!</p>
	<div class="arrow variant-filled-secondary" />
</div>

<nav class="list-nav h-full space-y-2 !no-underline">
    <ul class="flex h-full flex-1 flex-col justify-between [&>*>*>*]:h-14 [&>*>*>*]:gap-4">
        <div>
            <li>
                <button
                    class="hover:text-white variant-filled-primary"
                    use:popup={updateStatusDisallow}
                    disabled
                >
                    <PenToSquareSolid /> Update status
                </button>
            </li>
            <li>
                <a href="/feed" on:click={drawerClose}>
                    <NewspaperSolid /> Feed
                </a>
            </li>
            <li>
                <a href="/edit-profile" on:click={drawerClose}>
                    <UserPenSolid /> Edit Profile
                </a>
            </li>
        </div>

        <div>
            <li>
                <a href="/">
                    <CommentsSolid /> Send Feedback
                </a>
            </li>
            <li>
                <a href={'#'} on:click={signOut} class="hover:!variant-filled-error">
                    <PersonCircleMinusSolid /> Sign out
                </a>
            </li>
        </div>
    </ul>
</nav>
