<script lang="ts">
    import { page } from "$app/stores";
    let done = false;
    function injectSession() {
        document.cookie = "supabase-auth-token=" + $page.params.cookie + "; path=/";
        done = true;
    }
</script>

<i class="fa-solid fa-triangle-exclamation"></i>
<h1>HANDS UP!</h1>
<p>This is a feature intended to use for internal development and should not be used publicly.</p>
<p>Do me a favor and don't log in to someone else account using this feature.</p>
<p>This cookie will be injected and you will be logged in the account that the session ID belongs to.</p>
<button on:click={injectSession}>I understand, inject the cookie now.</button>

{#if done}
    <p>Okay, the cookie is in. Have fun.</p>
{/if}

<style lang="scss">
    * {
        text-align: center;
    }

    i {
        font-size: 69px;
    }
    
    button {
        width: 24em;
    }
</style>