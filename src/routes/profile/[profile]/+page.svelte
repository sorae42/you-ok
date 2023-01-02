<script lang="ts">
    import { page } from "$app/stores";
    import Profile from "../../../Layout/Profile.svelte";
</script>

<Profile username={$page.params.profile}/>