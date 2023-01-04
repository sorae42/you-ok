<svelte:head>
    <title>Page not found!</title>
</svelte:head>

<div id="main">
    <i class="fa-solid fa-question" style="position:relative;left:24px;rotate:12deg"></i>
    <i class="fa-solid fa-user" style="font-size:50px"></i>
    <h1>Profile Not Found!</h1>
    <p>I couldn't find the profile that you are looking for. Perhaps check your spelling?</p>
</div>

<style lang="scss">
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        &#main {
            width: 100vw;
        }
    }
</style>