// prolly work on this later.
import { supabase } from './supabaseClient';

export async function getDataFromUID(uid: string) {
    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, is_well, status_text, string_good, string_bad, has_created`)
            .eq('id', uid)
            .single();

        if (data) {
            return data;
        }

        if (error && status !== 406) throw error;
    } catch (error) {
        if (error instanceof Error) alert(error.message);
    }
}
