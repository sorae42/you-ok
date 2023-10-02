<script lang="ts">
    import { getDrawerStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { NewspaperSolid, PersonCircleMinusSolid, UserPenSolid } from 'svelte-awesome-icons';

    const drawerStore = getDrawerStore();

    function drawerClose(): void {
        drawerStore.close();
    }

    import { getModalStore } from '@skeletonlabs/skeleton';
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { redirect } from '@sveltejs/kit';

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

    async function signOut() {
        drawerClose();
        modalStore.trigger(modal);
    }
</script>

<nav class="list-nav !no-underline">
    <ul>
        <li>
            <a href="/feed" on:click={drawerClose} class="h-14 gap-4"><NewspaperSolid /> Feed</a>
        </li>
        <li>
            <a href="/edit-profile" on:click={drawerClose} class="h-14 gap-4">
                <UserPenSolid /> Edit Profile
            </a>
        </li>
        <hr />
        <li>
            <a href={'#'} on:click={signOut} class="h-14 gap-4 hover:!variant-filled-error">
                <PersonCircleMinusSolid /> Sign out
            </a>
        </li>
    </ul>
</nav>
