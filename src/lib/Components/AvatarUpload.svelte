<script lang="ts">
    import { ImageHelper } from '$lib/ImageHelper';
    import type { SupabaseClient } from '@supabase/supabase-js';

    export let supabase: SupabaseClient;

    let url: string;
    let uploading = false;
    let files: FileList;

    let imageUpload = new ImageHelper(supabase);

    function uploadAvatar() {
        try {
            uploading = true;
            console.log("uploadAvatar() called.");
            imageUpload.uploadImage(files, 'avatars');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            uploading = false;
        }
    }
</script>

<input
    class="!bg-transparent"
    type="file"
    id="single"
    accept="image/*"
    bind:files
    on:change={uploadAvatar}
    disabled={uploading}
/>
<input type="hidden" name="avatarUrl" value={url} />
