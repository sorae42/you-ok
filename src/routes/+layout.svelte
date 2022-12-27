<script>
    import '../app.scss';

    const name = "sorae42";
</script>

<nav>
    <div id="left">
        <a href="/">[logo here]</a>
    </div>
    <div id="right">
        {#if false} <!-- the user is logged in-->
            <a href="/people">People list</a>
            <a href="/status">Set Status</a>
            <a href="/profile/{name}">{name}</a>
        {:else}
            <a href="/login">Log in</a>
            <a href="/signup">Create an account</a>
        {/if}
    </div>
</nav>

<slot />

<style lang="scss">
    nav {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #424242;
        width: 100vw;
        height: 42px;

        div {
            padding: 0 42px;
            
            * {
                padding: 0 10px;
            }
        }

        a {
            color: white;
            text-decoration: none;
            height: 100%;

            &:hover {
                background-color: white;
                color: black;
            }
        }
    }
</style>
