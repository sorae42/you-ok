<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { Auth } from '@supabase/auth-ui-svelte';
    import { ThemeSupa, type ViewType } from '@supabase/auth-ui-shared';

    export let data;
    let authView: number = 0;
    let authMessage: string;
    let authName: ViewType;
    $: switch (authView) {
        case 0:
            authName = 'sign_in';
            authMessage = 'Log in to your account';
            break;
        case 2:
            authName = 'forgotten_password';
            authMessage = 'Login using magic link';
            break;
    }
</script>

<div class="flex h-screen flex-col items-center justify-center gap-12 lg:flex-row">
    <div class="prose prose-invert flex w-screen flex-1 flex-col items-center text-center">
        <img src="$lib/assets/icon.svg" alt="YouOkay icon" class="mb-0" />
        <h2>Let your loved one know that you are fine.</h2>
        <p>
            A way to let them know that you are doing fine today,
            <br />
            even when you are away from social media.
        </p>
    </div>
    <div class="bg-lgrey prose prose-invert w-3/5 flex-1 rounded-xl p-12 lg:max-w-lg">
        <h2 class="text-center">{authMessage}</h2>
        <Auth
            supabaseClient={data.supabase}
            redirectTo={`${data.url}/auth/callback`}
            showLinks={false}
            view={authName}
            theme="dark"
            appearance={{
                theme: ThemeSupa,
                style: { input: 'color: #fff', label: 'color: #fff', message: 'Log in' }
            }}
            localization={{
                variables: {
                    sign_in: {
                        email_label: 'Email',
                        email_input_placeholder: 'youokay@mail.com',
                        password_label: 'Password',
                        password_input_placeholder: '••••••••'
                    }
                }
            }}
        />

        <br />

        <!-- TODO: Use something better than anchor -->
        {#if authView == 0}
            <a
                href={'#'}
                on:click={() => {
                    authView = 2;
                }}
            >
                I forgot my password
            </a>
        {/if}
        {#if authView > 0}
            <a
                href={'#'}
                on:click={() => {
                    authView = 0;
                }}
            >
                Go back to sign in
            </a>
        {/if}
    </div>
</div>
