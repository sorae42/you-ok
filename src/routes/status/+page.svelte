<svelte:head>
    <title>Update your status</title>
</svelte:head>

<script lang="ts">
    
</script>

<div id="main">
    <h2>Update your status</h2>
    <form action="/" method="post">
        <span>
            <p>How are you feeling today?</p>
            <input type="radio" id="good" name="quick-stat" required />
            <label for="good">Doing good!</label>
            <br />
            <input type="radio" id="bad" name="quick-stat" required />
            <label for="bad">Feeling bad...</label>
        </span>
        <span>
            <label for="long-stat">Free text (limit to 200 characters)</label>
            <input type="text" id="long-stat" name="long-stat" maxlength="200" placeholder="I'm doing good today!" />
        </span>
        <p>Once you updated your status, you cannot change how you are feeling within 24 hours. However, you can still change the free text at will.</p>
        <input type="submit" value="Update my status" />
    </form>
</div>

<style lang="scss">
    div#main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;

        form {
            display: flex;
            flex-direction: column;

            input[type="text"] {
                width: 100%;
            }

            span {
                margin: 24px 0;
            }
        }
    }
</style>