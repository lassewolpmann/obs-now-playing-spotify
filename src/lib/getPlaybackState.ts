import { invalidate } from "$app/navigation";
import { getAlbumCoverColorPalette } from "./getAlbumCoverColorPalette";

export const getPlaybackState = (accessToken: string,
                                       playbackProgressBar: any,
                                       albumCover: HTMLImageElement,
                                       albumCanvas: HTMLCanvasElement,
                                       background: HTMLElement,
                                       playbackDiv: HTMLElement) => {

    return new Promise((resolve, reject) => fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(resJson => {
        if (playbackDiv) {
            let playbackProgress = (resJson['progress_ms'] / resJson['item']['duration_ms']) * 100;
            playbackProgressBar.style.width = playbackProgress + '%';
            getAlbumCoverColorPalette(albumCover, albumCanvas, background, playbackDiv, playbackProgressBar);
        }

        resolve(resJson);
    }).catch(error => {
        console.log(error)
    }))
}

const invalidateToken = () => {
    invalidate('auth:accessToken');
}