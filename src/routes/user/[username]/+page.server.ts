import { redirect } from '@sveltejs/kit';
import { StatusHelper, type Status } from '$lib/StatusHelper';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession }, params }) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/');
    }

    return {
        session,
        streamed: {
            profileInfo: fetchProfile(supabase, params.username)
        }
    };
};

async function fetchProfile(
    supabase: SupabaseClient,
    username: string
): Promise<Status> {
    let status = new StatusHelper(supabase);

    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

    return status.getStatus(data?.id);
}
