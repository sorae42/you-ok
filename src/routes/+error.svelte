<svelte:head>
    <title>Page not found!</title>
</svelte:head>

<div id="main">
    <h1>404 Not Found!</h1>
    <p>I couldn't find the page that you are looking for. Perhaps check your spelling?</p>
</div>

<style lang="scss">
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        &#main {
            width: 100vw;
            height: 100vh;
        }
    }
</style>