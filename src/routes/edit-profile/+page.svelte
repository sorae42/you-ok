<script lang="ts">
    import { enhance } from '$app/forms';
    import {
        DiscordBrand,
        FaceFrownSolid,
        FaceSmileBeamSolid,
        GithubBrand,
        TwitterBrand
    } from 'svelte-awesome-icons';
    import { SlideToggle, getToastStore } from '@skeletonlabs/skeleton';

    import Avatar from '$lib/Components/Avatar.svelte';

    const toastStore = getToastStore();

    export let data;
    export let form;

    let { session, supabase, profile } = data;
    $: ({ session, supabase, profile } = data);

    let profileForm: HTMLFormElement;
    let loading = false;
    let username: string = profile?.username ?? '';
    let avatarUrl: string = profile?.avatar_url ?? '';
    let privateProfile: boolean = profile?.private_profile ?? '';
    let pronoun: string = profile?.pronoun ?? '';

    let string_good: string = profile?.string_good ?? '';
    let string_bad: string = profile?.string_bad ?? '';

    let website: string = profile?.website ?? '';
    let twitter: string = profile?.twitter ?? '';
    let github: string = profile?.github ?? '';
    let discord: string = profile?.discord ?? '';

    const handleSubmit = () => {
        loading = true;
        return async () => {
            loading = false;
            toastStore.trigger({
                message: '✅ Profile updated!',
                background: 'variant-filled-success',
                hideDismiss: true
            });
        };
    };
</script>

<div class="flex flex-col justify-center p-12 lg:flex-row">
    <div>
        <Avatar
            {supabase}
            bind:url={avatarUrl}
            on:upload={() => {
                profileForm.requestSubmit();
            }}
        />
    </div>
    <div class="w-96 space-y-6">
        <form
            method="post"
            action="?/update"
            class="space-y-4"
            use:enhance={handleSubmit}
            bind:this={profileForm}
        >
            <div class="space-y-4">
                <h2 class="h2">Basic Infomation</h2>
                <div>
                    <label for="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={form?.username ?? username}
                        required
                    />
                </div>
                <div>
                    <label for="pronoun">Pronoun</label>
                    <input
                        id="pronoun"
                        name="pronoun"
                        type="text"
                        value={form?.pronoun ?? pronoun}
                    />
                </div>
                <div>
                    <SlideToggle
                        name="privateProfile"
                        checked={form?.private_profile ?? privateProfile}
                    >
                        Private Profile
                    </SlideToggle>
                </div>
            </div>

            <hr />

            <div class="space-y-4">
                <h2 class="h2">Prompts</h2>
                <div>
                    <label for="stringGood">Good</label>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><FaceSmileBeamSolid /></div>
                        <input
                            id="stringGood"
                            name="stringGood"
                            type="text"
                            value={form?.string_good ?? string_good}
                        />
                    </div>
                </div>
                <div>
                    <label for="stringBad">Bad</label>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><FaceFrownSolid /></div>
                        <input
                            id="stringBad"
                            name="stringBad"
                            type="text"
                            value={form?.string_bad ?? string_bad}
                        />
                    </div>
                </div>
                <p>Prompts are tied to your account.</p>
            </div>

            <hr />

            <div class="space-y-4">
                <h2 class="h2">Social Links</h2>
                <div>
                    <label for="website">Website</label>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim">https://</div>
                        <input
                            id="website"
                            name="website"
                            type="text"
                            value={form?.website ?? website}
                        />
                    </div>
                </div>
                <div>
                    <label for="twitter">Twitter</label>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><TwitterBrand /></div>
                        <input
                            id="twitter"
                            name="twitter"
                            type="text"
                            value={form?.twitter ?? twitter}
                        />
                    </div>
                </div>
                <div>
                    <label for="discord">Discord</label>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><DiscordBrand /></div>
                        <input
                            id="discord"
                            name="discord"
                            type="text"
                            value={form?.discord ?? discord}
                        />
                    </div>
                </div>
                <div>
                    <label for="github">GitHub</label>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                        <div class="input-group-shim"><GithubBrand /></div>
                        <input
                            id="github"
                            name="github"
                            type="text"
                            value={form?.github ?? github}
                        />
                    </div>
                </div>
            </div>

            <hr />

            <div>
                <input
                    type="submit"
                    class="variant-filled"
                    value={loading ? 'Saving...' : 'Save'}
                    disabled={loading}
                />
            </div>
        </form>

        <div>
            <label for="email" class="label">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
            <p>You cannot change this for the time being.</p>
        </div>
    </div>
</div>
