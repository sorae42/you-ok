<script lang="ts">
    import ProfileEditor from "../../Layout/ProfileEdit.svelte";
    import { page } from '$app/stores';
</script>

<ProfileEditor session={$page.data.session} />