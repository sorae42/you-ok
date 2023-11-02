import { redirect } from '@sveltejs/kit';
import { StatusHelper, type Status } from '$lib/StatusHelper';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession }, params }) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/');
    }

    return {
        session,
        username: params.username,
        streamed: {
            profileInfo: fetchProfile(supabase, params.username),
            extra: fetchProfileExtras(supabase, params.username)
        }
    };
};

async function fetchProfile(supabase: SupabaseClient, username: string) {
    let status = new StatusHelper(supabase);

    const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

    return status.getStatus(data?.id);
}

// fetch extra details
async function fetchProfileExtras(supabase: SupabaseClient, username: string) {
    const { data } = await supabase
        .from('profiles')
        .select('id, bio, website, twitter, discord')
        .eq('username', username)
        .single();
    
    return data;
}
