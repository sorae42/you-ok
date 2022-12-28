<svelte:head>
    <title>YouOkay</title>
</svelte:head>

<script lang="ts">
    function get_random(list: Array<string>) {
        return list[Math.floor(Math.random() * list.length)];
    }

    const subject = ['friends', 'family', 'loved one'];
    const verb = ['OK', 'safe', 'fine'];
</script>

<div id="main">
    <h1>Let your {get_random(subject)} know that you are {get_random(verb)}.</h1>
    <p>A way to let them know that you are doing fine today, even when you are away from social media.</p>
    <a href="/signup"><button>Get Started</button></a>
    <p>or <a href="/login">log in to your account</a>.</p>
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

    button {
        margin: 42px 0;
    }
</style>
