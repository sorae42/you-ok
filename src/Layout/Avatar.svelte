<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { supabase } from '$lib/supabaseClient';

    export let url: string;

    let avatarUrl: string;
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

            await supabase.storage.from('avatars').remove([avatarUrl]).then(() => {
                supabase.storage.from('avatars').upload(filePath, file);
            })

            url = filePath;
            dispatch('upload');
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


<span id="image-upload">
    {#if avatarUrl}
        <img src={avatarUrl} alt={avatarUrl ? 'Avatar' : 'No image'} />
    {:else}
        <img src="$lib/assets/default.png" alt="" />
    {/if}
    
    <span>
        <label class="fake-button" for="single">
            {uploading ? 'Please wait warmly!...' : 'Upload avatar'}
        </label>
        <input
            style="display: none; position:absolute;"
            type="file"
            id="single"
            accept="image/*"
            bind:files
            on:change={uploadAvatar}
            disabled={uploading}
        />
    </span>
</span>

<style lang="scss">
    #image-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }

    img {
        width: 8em;
        border: 1px solid white;
        margin: 12px;
    }
</style>
