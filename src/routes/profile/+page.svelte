<script lang="ts">
    import Account from "../../Layout/Account.svelte";
    import { page } from '$app/stores';
</script>

<Account session={$page.data.session} />