import type { PageLoad } from './$types'
import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public'
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = () => {
    const scope: string = 'user-read-playback-state';

    const authURL: URL = new URL('https://accounts.spotify.com/authorize?');
    authURL.searchParams.append('response_type', 'code');
    authURL.searchParams.append('client_id', PUBLIC_CLIENT_ID);
    authURL.searchParams.append('scope', scope);
    authURL.searchParams.append('redirect_uri', PUBLIC_REDIRECT_URI);

    throw redirect(307, authURL.toString());
}