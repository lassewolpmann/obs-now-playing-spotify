import {accessToken, expiresIn, refreshToken, scope, tokenTimestamp, tokenType} from "../stores";
import {PUBLIC_CLIENT_ID} from "$env/static/public";

export const tokenRefresher = async () => {
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
        refreshURL.searchParams.append('client_id', PUBLIC_CLIENT_ID);

        const refreshReq = await fetch(refreshURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        if (refreshReq.status === 200) {
            const refreshData = await refreshReq.json();

            accessToken.set(refreshData['access_token']);
            tokenType.set(refreshData['token_type']);
            scope.set(refreshData['scope']);
            expiresIn.set(refreshData['expires_in']);
            refreshToken.set(refreshData['refresh_token']);
            tokenTimestamp.set(new Date().getTime());

            console.log('New token expires at: ' + new Date(new Date().getTime() + (refreshData['expires_in'] * 1000)));
        } else {
            console.log('Token refresh did not succeed.');
        }
    }
}