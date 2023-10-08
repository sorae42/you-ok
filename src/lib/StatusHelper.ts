import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

export interface Status {
    httpStatus: number,
    id: number,
    display_name: string,
    username: string,
    avatarUrl: string,
    badge: string | null,
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
    avatar_url: string,
    badge: string | null
}

// TODO: better eror handling
export class StatusHelper {
    protected supabase: SupabaseClient;

    constructor(sb: SupabaseClient) {
        this.supabase = sb;
    }

    public async getStatus(userID: string): Promise<Status> {
        try {
            const { data, error, status } = await this.supabase
                .from('statuses')
                .select(
                    'id, is_well, status_text, updated_on, profiles(id, username, display_name, string_good, string_bad, avatar_url, badge)'
                )
                .eq('user_id', userID)
                .single();

            if (error) throw error;

            // FIXME: profiles is being seen as an array of object
            // @ts-ignore
            const profileData: Profile = data.profiles;
        
            let userStatus: Status = {
                httpStatus: status,
                id: data.id,
                display_name: profileData.display_name,
                username: profileData.username,
                avatarUrl: profileData.avatar_url,
                badge: profileData.badge || null,
                status: data.is_well,
                status_text: data.is_well ? profileData.string_good : profileData.string_bad || "",
                text: data.status_text || "",
                updated_on: data.updated_on
            };

            return userStatus;
        } catch (error: any) {
            return error;
        }
    }
}
