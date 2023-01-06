import type { AuthSession } from '@supabase/supabase-js';
import { page } from '$app/stores';
import { redirect } from '@sveltejs/kit';

export function load() {
    let session: AuthSession;

    page.subscribe((value) => {
        session = value.data.session;
    
        if (!session) {
            throw redirect(302, '/');
        }
    });

}
