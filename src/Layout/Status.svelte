<svelte:head>
    <title>Update your status</title>
</svelte:head>

<script lang="ts">
    
</script>

<div id="main">
    <h1>Update your status</h1>
    <form action="/" method="post">
        <span>
            <p>How are you feeling today?</p>
            <input type="radio" id="good" name="quick-stat" required />
            <label for="good">I'm doing good!</label>
            <br />
            <input type="radio" id="bad" name="quick-stat" required />
            <label for="bad">I'm feeling bad...</label>
        </span>
        <span>
            <label for="long-stat">Status (limit to 200 characters)</label>
            <input type="text" id="long-stat" name="long-stat" maxlength="200" placeholder="I'm doing good today!" />
        </span>
        <p>Once you updated your status, you cannot change how you are feeling within 24 hours. However, you can still change the status at will.</p>
        <input type="submit" value="Update my status" />
    </form>
</div>

<style lang="scss">
    div#main {
        form {
            display: flex;
            flex-direction: column;
            width: 42%;

            input[type="text"] {
                width: 100%;
            }

            span {
                margin: 24px 0;
            }
        }
    }
</style>