<div id="main">
    <h2>Login to your account</h2>
    <form action="" method="post">
        <label for="username">Email or username</label>
        <input type="email" name="username" id="username" placeholder="example@mail.com" required />
        <br />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="Password" required/>
        <input type="submit" value="Log In" />
    </form>
    <a href="/forgot">Forgot Password?</a>
    <a href="/signup">Don't have an account?</a>
    <h3>Or sign in using</h3>
    <div id="alternative">

    </div>
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

            input[type='email'] {
                width: 100%;
            }
        }
    }
</style>
