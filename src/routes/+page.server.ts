import { accessToken } from "../stores";
import type { PageServerLoad } from './$types'
import { createAuthURL } from "../lib/createAuthURL";

export const load: PageServerLoad = async ({depends}) => {
    let accessTokenValue: string = '';
    let authURL = await createAuthURL();

    accessToken.subscribe(value => accessTokenValue = value);
    depends('auth:accessToken');

    return {
        accessToken: accessTokenValue,
        authURL: authURL.toString()
    }
}