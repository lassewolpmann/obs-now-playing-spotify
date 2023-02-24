import { writable } from 'svelte/store'

export const accessToken = writable('');
export const tokenType = writable('');
export const scope = writable('');
export const expiresIn = writable(0);
export const refreshToken = writable('');
export const tokenTimestamp = writable(0);