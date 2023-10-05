import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select(
            `username, display_name, website, avatar_url, twitter, github, discord, pronoun, private_profile, string_good, string_bad`
        )
        .eq('id', session.user.id)
        .single();

    return { session, profile };
};

export const actions = {
    update: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const display_name = formData.get('displayName') as string;
        const username = formData.get('username') as string;
        const avatar_url = formData.get('avatarUrl') as string;
        const private_profile = formData.get('privateProfile') as string;
        const pronoun = formData.get('pronoun') as string;

        const string_good = formData.get('stringGood') as string;
        const string_bad = formData.get('stringBad') as string;

        const website = formData.get('website') as string;
        const twitter = formData.get('twitter') as string;
        const github = formData.get('github') as string;
        const discord = formData.get('discord') as string;

        const session = await getSession();

        console.log(avatar_url);

        const { error } = await supabase.from('profiles').upsert({
            id: session?.user.id,
            username,
            display_name,
            avatar_url,
            private_profile: private_profile || false,
            pronoun,
            string_good,
            string_bad,
            website,
            twitter,
            discord,
            github,
            updated_at: new Date()
        });

        if (error) {
            return fail(500, {
                username,
                avatar_url,
                display_name,
                private_profile,
                pronoun,
                string_good,
                string_bad,
                website,
                twitter,
                discord,
                github
            });
        }

        return {
            username,
            display_name,
            avatar_url,
            private_profile,
            pronoun,
            string_good,
            string_bad,
            website,
            twitter,
            discord,
            github
        };
    }
};
