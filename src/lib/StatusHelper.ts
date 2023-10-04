import type { SupabaseClient } from '@supabase/supabase-js';
import type { DateTime } from 'luxon';

export interface Status {
    httpStatus: number,
    id: number,
    username: string,
    avatarUrl: string,
    status: boolean,
    status_text: string,
    text: string,
    updated_on: string
}

interface Profile {
    id: number,
    username: string,
    display_name: string,
    string_good: string,
    string_bad: string,
    avatar_url: string
}

export class StatusHelper {
    protected supabase: SupabaseClient;

    constructor(sb: SupabaseClient) {
        this.supabase = sb;
    }

    public async getStatus(userID: string) {
        try {
            const { data, error, status } = await this.supabase
                .from('statuses')
                .select(
                    'id, is_well, status_text, updated_on, profiles(id, username, display_name, string_good, string_bad, avatar_url)'
                )
                .eq('user_id', userID)
                .single();

            if (error) throw error;

            // FIXME: this works but types are not parsed correctly so there are errors
            // @ts-ignore
            const profileData: Profile = data.profiles;
        
            let userStatus: Status = {
                httpStatus: status,
                id: data.id,
                username: profileData.username,
                avatarUrl: profileData.avatar_url,
                status: data.is_well,
                status_text: data.is_well ? profileData.string_good : profileData.string_bad || "",
                text: data.status_text || "",
                updated_on: data.updated_on
            };

            return userStatus;
        } catch (error) {
            return {httpStatus: 404, error};
        }
    }
}
