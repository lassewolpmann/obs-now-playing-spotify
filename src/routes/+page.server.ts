import { accessToken } from "../stores";
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
    let accessTokenValue: string = '';

    accessToken.subscribe(value => {
        accessTokenValue = value;
    })

    return {
        accessToken: accessTokenValue
    }
}