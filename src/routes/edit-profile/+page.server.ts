import { ActionFailure, fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select(
            `username, display_name, bio, website, avatar_url, twitter, discord, pronoun, private_profile, string_good, string_bad`
        )
        .eq('id', session.user.id)
        .single();

    return { session, profile };
};

export const actions = {
    update: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();

        const formData = await request.formData();

        const data = {
            display_name: (formData.get('displayName') as string) || '',
            username: (formData.get('username') as string) || '',
            avatar_url: (formData.get('avatarUrl') as string) || '',
            bio: (formData.get('bio') as string) || '',
            pronoun: (formData.get('pronoun') as string) || '',
            string_good: (formData.get('stringGood') as string) || '',
            string_bad: (formData.get('stringBad') as string) || '',
            website: (formData.get('website') as string) || '',
            twitter: (formData.get('twitter') as string) || '',
            discord: (formData.get('discord') as string) || ''
        };

        const { error } = await supabase.from('profiles').upsert({
            id: session?.user.id,
            updated_at: new Date(),
            ...data
        });

        if (error) {
            return fail(500, data);
        }

        return data;
    }
};
