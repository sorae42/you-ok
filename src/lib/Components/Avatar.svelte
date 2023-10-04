<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { Avatar } from '@skeletonlabs/skeleton';
    import { ImageHelper } from '$lib/ImageHelper';
    import userImage from '$lib/assets/default.png';

    export let supabase: SupabaseClient;
    export let url: string;
    export let size: string = 'w-16';
    export let name: string;

    let imageUrl: string | undefined;
    let imageUpload = new ImageHelper(supabase);

    async function downloadAvatar() {
        if (url) {
            imageUrl = await imageUpload.downloadImage(url, 'avatars');
        }
    }

    var result = '';

    function initials() {
        var tokens = name.split(/\s/);
        for (var i = 0; i < tokens.length; i++) {
            result += tokens[i].substring(0, 1).toUpperCase();
        }
    }

    initials();

    $: downloadAvatar();
</script>

<Avatar
    src={imageUrl}
    rounded="rounded-full"
    border="border-2 border-surface-300-600-token"
    width={size}
    fallback={userImage}
    initials={result}
/>
