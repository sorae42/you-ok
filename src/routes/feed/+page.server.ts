import { StatusHelper } from '$lib/StatusHelper';
import { redirect } from '@sveltejs/kit';
import type { Status } from '$lib/StatusHelper';

export const load = async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/');
    }

    let status = new StatusHelper(supabase);

    const { data, error } = await supabase.from('followers').select('following');
    let statusList: Array<Status> = [];

    if (data) {
        for (let user of data) {
            let a: any = await status.getStatus(user.following);
            if (a.httpStatus == 404) continue;
            statusList.push(a);
        }
    }

    return { session, statusList };
};
