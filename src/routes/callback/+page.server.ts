import type { PageServerLoad } from './$types'
import { SECRET_CLIENT_SECRET } from '$env/static/private'
import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public'
import { accessToken, tokenType, scope, expiresIn, refreshToken, tokenTimestamp } from "../../stores";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({url, fetch}) => {
    if (url.searchParams.get('code') !== null) {
        // @ts-ignore
        const authCode: string = url.searchParams.get('code').toString();

        const authURL: URL = new URL('https://accounts.spotify.com/api/token');
        authURL.searchParams.append('grant_type', 'authorization_code');
        authURL.searchParams.append('code', authCode);
        authURL.searchParams.append('redirect_uri', PUBLIC_REDIRECT_URI);

        const authReq = await fetch(authURL, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(PUBLIC_CLIENT_ID + ':' + SECRET_CLIENT_SECRET).toString('base64'),
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
        }
    } else {
        console.log('No code!');
    }
}

const tokenRefresher = async () => {
    let currentTimestamp = new Date().getTime();
    let tokenTimestampValue: number = 0;
    let refreshTokenValue: string = '';
    let expiresInValue: number = 0;

    tokenTimestamp.subscribe(value => {
        tokenTimestampValue = value;
    })

    refreshToken.subscribe(value => {
        refreshTokenValue = value;
    })

    expiresIn.subscribe(value => {
        expiresInValue = value * 1000;
    })

    if (tokenTimestampValue + expiresInValue < currentTimestamp) {
        console.log('Token needs to be refreshed!')

        const refreshURL: URL = new URL('https://accounts.spotify.com/api/token');
        refreshURL.searchParams.append('grant_type', 'refresh_token');
        refreshURL.searchParams.append('refresh_token', refreshTokenValue);

        const refreshReq = await fetch(refreshURL, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(PUBLIC_CLIENT_ID + ':' + SECRET_CLIENT_SECRET).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        if (refreshReq.status === 200) {
            const refreshData = await refreshReq.json();

            accessToken.set(refreshData['access_token']);
            tokenType.set(refreshData['token_type']);
            scope.set(refreshData['scope']);
            expiresIn.set(refreshData['expires_in']);
            tokenTimestamp.set(new Date().getTime());

            console.log('New token expires at: ' + new Date(new Date().getTime() + (refreshData['expires_in'] * 1000)));
        } else {
            console.log('Token refresh did not succeed.')
        }
    }
}