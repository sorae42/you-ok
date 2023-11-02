<script lang="ts">
    import { enhance } from '$app/forms';
    import {
        AtSolid,
        DiscordBrand,
        FaceFrownSolid,
        FaceSmileBeamSolid,
        GithubBrand,
        TwitterBrand
    } from 'svelte-awesome-icons';
    import { SlideToggle, Tab, TabGroup, getToastStore } from '@skeletonlabs/skeleton';

    import Avatar from '$lib/Components/Avatar.svelte';
    import AvatarUpload from '$lib/Components/AvatarUpload.svelte';

    const toastStore = getToastStore();

    export let data;
    export let form;

    let { session, supabase, profile } = data;
    $: ({ session, supabase, profile } = data);

    let tabSet: number = 0;
    let loading = false;

    let profileForm: HTMLFormElement;

    let username: string = profile?.username ?? '';
    let display_name: string = profile?.display_name ?? '';
    let bio: string = profile?.bio ?? '';
    let avatarUrl: string = profile?.avatar_url ?? '';
    let pronoun: string = profile?.pronoun ?? '';

    let string_good: string = profile?.string_good ?? '';
    let string_bad: string = profile?.string_bad ?? '';

    let website: string = profile?.website ?? '';
    let twitter: string = profile?.twitter ?? '';
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

<svelte:head>
    <title>Edit Profile - YouOkay</title>
</svelte:head>

<form
    method="post"
    action="?/update"
    class="space-y-4"
    use:enhance={handleSubmit}
    bind:this={profileForm}
>
    <!--
        <TabGroup justify="justify-center">
            <Tab bind:group={tabSet} name="tab1" value={0}>Profile</Tab>
            <Tab bind:group={tabSet} name="tab2" value={1}>Prompts</Tab>
            <Tab bind:group={tabSet} name="tab3" value={2}>Social Links</Tab>
            <Tab bind:group={tabSet} name="tab4" value={3}>Account</Tab>
        </TabGroup>
    -->

    <!-- Can't clear these up unless I break each section to different pages -->
    <div class="px-2 py-6 md:px-36 lg:px-64 xl:px-80">
        <div class="flex flex-col gap-10 md:flex-row">
            <div>
                <Avatar {supabase} bind:url={avatarUrl} size="w-64" name={username} />
                <br />
                <AvatarUpload
                    {supabase}
                    bind:url={avatarUrl}
                    on:upload={() => {
                        profileForm.requestSubmit();
                    }}
                />
            </div>
            <div class="w-full">
                <div>
                    <label for="displayName">Name</label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={form?.display_name ?? display_name}
                        required
                    />
                    <p>Name that will shown on your profile.</p>
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
                    <!-- TODO: Private profile
                    <SlideToggle
                        name="privateProfile"
                        checked={form?.private_profile ?? privateProfile}
                    >
                        Private Profile
                    </SlideToggle>
                    -->
                </div>
                <div>
                    <label for="bio">Bio</label>
                    <textarea name="bio" id="bio" rows="6">{form?.bio ?? bio}</textarea>
                </div>
            </div>
        </div>
        <hr />
        <div>
            <div>
                <label for="stringGood">Good</label>
                <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                    <div class="input-group-shim"><FaceSmileBeamSolid /></div>
                    <input
                        id="stringGood"
                        name="stringGood"
                        type="text"
                        value={form?.string_good ?? string_good}
                        placeholder="I'm feeling good!"
                        required
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
                        placeholder="I'm feeling bad..."
                        required
                    />
                </div>
            </div>
            <p>Prompts are tied to your account.</p>
        </div>
        <hr />
        <div>
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
        </div>
        <hr />
        <div>
            <label for="username">Username</label>
            <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                <div class="input-group-shim"><AtSolid /></div>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={form?.username ?? username}
                    required
                />
            </div>
            <p>
                Name that people can use to find you. Only letters, numbers, hyphen (-) and
                underscore (_) are allowed.
            </p>
        </div>
        <div>
            <label for="email" class="label">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
            <p>You cannot change this for the time being.</p>
        </div>

        <div class="my-6">
            <input
                type="submit"
                class="variant-filled"
                value={loading ? 'Saving...' : 'Save'}
                disabled={loading}
            />
        </div>
    </div>
</form>
