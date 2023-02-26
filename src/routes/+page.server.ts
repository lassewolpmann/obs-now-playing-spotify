import { accessToken } from "../stores";
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ depends }) => {
    let accessTokenValue: string = '';

    accessToken.subscribe(value => accessTokenValue = value);
    depends('auth:accessToken');

    return {
        accessToken: accessTokenValue
    }
}