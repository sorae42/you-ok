<script lang="ts">
    import { page } from '$app/stores';
    import { MetaTags } from 'svelte-meta-tags';

    import Profile from '../../../Layout/Profile.svelte';

    let username = $page.params.profile;
</script>

<MetaTags
    title={username}
    titleTemplate="%s's Profile on YouOkay"
    description={'See how ' + username + ' up to these days on YouOkay.'}
    robotsProps={{
        noarchive: true,
        nosnippet: true,
        maxSnippet: -1,
        maxImagePreview: 'none',
        maxVideoPreview: -1,
        notranslate: true
    }}
/>

<Profile {username} />
