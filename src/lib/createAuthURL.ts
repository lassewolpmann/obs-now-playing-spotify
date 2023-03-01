import {PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI} from "$env/static/public";
import {codeVerifier, state} from "../stores";
import * as crypto from "crypto";

export const createAuthURL = async () => {
    const scope: string = 'user-read-playback-state';
    const id: string = crypto.randomUUID();
    const verifier: string = generateCodeVerifier();
    const challenge: string = await generateCodeChallenge(verifier);

    state.set(id);
    codeVerifier.set(verifier);

    const authURL: URL = new URL('https://accounts.spotify.com/authorize?');
    authURL.searchParams.append('client_id', PUBLIC_CLIENT_ID);
    authURL.searchParams.append('response_type', 'code');
    authURL.searchParams.append('redirect_uri', PUBLIC_REDIRECT_URI);
    authURL.searchParams.append('state', id);
    authURL.searchParams.append('scope', scope);
    authURL.searchParams.append('show_dialog', 'true');
    authURL.searchParams.append('code_challenge_method', 'S256');
    authURL.searchParams.append('code_challenge', challenge);

    return authURL;
}

const generateCodeVerifier = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 64; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const generateCodeChallenge = async (verifier: string) => {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(verifier),
    );

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}