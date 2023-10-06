<script lang="ts">
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import {
        CommentsSolid,
        NewspaperSolid,
        PersonCircleMinusSolid,
        UserPenSolid
    } from 'svelte-awesome-icons';

    import { getModalStore } from '@skeletonlabs/skeleton';
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { redirect } from '@sveltejs/kit';
    //import Marqueeck from '@arisbh/marqueeck';

    export let supabase: SupabaseClient;
    export let username: string;
    export let displayName: string;

    const drawerStore = getDrawerStore();

    function drawerClose(): void {
        drawerStore.close();
    }

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

    async function signOut() {
        drawerClose();
        modalStore.trigger(modal);
    }
</script>

<nav class="list-nav space-y-2 !no-underline">
    <ul class="flex h-full flex-1 flex-col [&>*>*]:h-14 [&>*>*]:gap-4">
        <li class="text-right">
            <a href="/{username}" class="!block !h-max">
                <strong>
                    {displayName}
                </strong>
                <br />
                <span>@{username}</span>
            </a>
        </li>
        <li>
            <a href="/edit-profile" on:click={drawerClose}>
                <UserPenSolid /> Edit Profile
            </a>
        </li>
        <hr />
        <li>
            <a href="mailto:bonniefoxy2009@gmail.com">
                <CommentsSolid /> Send Feedback
            </a>
        </li>
        <li>
            <a href={'#'} on:click={signOut} class="hover:!variant-filled-error">
                <PersonCircleMinusSolid /> Sign out
            </a>
        </li>
    </ul>
</nav>
