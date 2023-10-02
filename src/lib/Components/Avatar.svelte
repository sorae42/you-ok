<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { createEventDispatcher } from 'svelte';
    import { Avatar } from '@skeletonlabs/skeleton';

    export let url: string;
    export let supabase: SupabaseClient;

    let avatarUrl: string | undefined;
    let uploading = false;
    let files: FileList;

    const dispatch = createEventDispatcher();

    const downloadImage = async (path: string) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);

            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            avatarUrl = url;
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image: ', error.message);
            }
        }
    };

    const uploadAvatar = async () => {
        try {
            uploading = true;

            if (!files || files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${Math.random()}.${fileExt}`;

            let { error } = await supabase.storage.from('avatars').upload(filePath, file);

            if (error) {
                throw error;
            }

            url = filePath;
            setTimeout(() => {
                dispatch('upload');
            }, 100);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            uploading = false;
        }
    };

    $: if (url) downloadImage(url);
</script>

<div>
    <!-- need reworks -->
    <label for="single">
        <Avatar
            src={avatarUrl}
            rounded="rounded-full"
            border="border-4 border-surface-300-600-token hover:!border-primary-500"
            cursor="cursor-pointer"
            width="w-64"
        />
    </label>
    <input
        style="visibility:hidden"
        type="file"
        id="single"
        accept="image/*"
        bind:files
        on:change={uploadAvatar}
        disabled={uploading}
    />
    <input type="hidden" name="avatarUrl" value={url} />
    <p>Click on the avatar to change it.</p>
</div>
