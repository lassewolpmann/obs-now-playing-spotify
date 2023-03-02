import type { PageServerLoad } from './$types'
import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public'
import { accessToken, tokenType, scope, expiresIn, refreshToken, tokenTimestamp, state, codeVerifier } from "../../stores";
import { redirect } from "@sveltejs/kit";
import { tokenRefresher } from "../../lib/tokenRefresher";

export const load: PageServerLoad = async ({url, fetch}) => {
    const error = url.searchParams.get('error');
    const code = url.searchParams.get('code');

    if (code !== null && error === null) {
        let verifier: string = '';
        codeVerifier.subscribe(value => {
            verifier = value;
        })

        const authURL: URL = new URL('https://accounts.spotify.com/api/token');
        authURL.searchParams.append('grant_type', 'authorization_code');
        authURL.searchParams.append('code', code);
        authURL.searchParams.append('redirect_uri', PUBLIC_REDIRECT_URI);
        authURL.searchParams.append('client_id', PUBLIC_CLIENT_ID);
        authURL.searchParams.append('code_verifier', verifier);

        const authReq = await fetch(authURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        if (authReq.status === 200) {
            const authData = await authReq.json();

            accessToken.set(authData['access_token']);
            tokenType.set(authData['token_type']);
            scope.set(authData['scope']);
            expiresIn.set(authData['expires_in']);
            refreshToken.set(authData['refresh_token']);
            tokenTimestamp.set(new Date().getTime());

            console.log('Token expires at: ' + new Date(new Date().getTime() + (authData['expires_in'] * 1000)));

            setInterval(tokenRefresher, 1000);

            throw redirect(307, '/');
        } else {
            console.log(await authReq.json())
        }
    } else {
        console.log(error);

        throw redirect(307, '/');
    }
}