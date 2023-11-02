import { StatusHelper } from '$lib/StatusHelper';
import { fail, redirect } from '@sveltejs/kit';
import type { Status } from '$lib/StatusHelper';
import type { PageServerLoad } from './$types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/');
    }

    return {
        session,
        streamed: {
            user: userStatus(supabase, session),
            statusList: fetchFeed(supabase)
        }
    };
};

export const actions = {
    update: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();

        if (!session) return;

        const formStatus = await request.formData();
        const status = {
            status_text: formStatus.get('status-text') as string,
            is_well: formStatus.get('status') as string === "true"
        };

        const { error } = await supabase.from('statuses').upsert({
            user_id: session?.user.id,
            updated_on: new Date(),
            ...status
        });

        if (error) {
            return fail(500, status);
        }

        return status;
    }
};

async function userStatus(supabase: SupabaseClient, session: Session) {
    const { data: userPref } = await supabase
        .from('profiles')
        .select(`string_good, string_bad`)
        .eq('id', session.user.id)
        .single();
    const { data: status } = await supabase
        .from('statuses')
        .select(`is_well, status_text`)
        .eq('user_id', session.user.id)
        .single();

    return {
        string_good: userPref?.string_good,
        string_bad: userPref?.string_bad,
        is_well: status?.is_well,
        status_text: status?.status_text
    };
}

async function fetchFeed(supabase: SupabaseClient) {
    let status = new StatusHelper(supabase);

    const { data, error } = await supabase.from('followers').select('following');

    let statusList: Array<Status> = [];

    if (data) {
        for (let user of data) {
            let a: any = await status.getStatus(user.following);
            if (a.httpStatus == 404 || a.code == 'PGRST116') continue;
            statusList.push(a);
        }
    }

    return statusList;
}
