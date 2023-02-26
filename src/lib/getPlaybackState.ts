import { invalidate } from "$app/navigation";
import { getAlbumCoverColorPalette } from "./getAlbumCoverColorPalette";

export const getPlaybackState = async (accessToken: string,
                                       playbackProgressBar: any,
                                       albumCover: HTMLImageElement,
                                       albumCanvas: HTMLCanvasElement,
                                       background: HTMLElement,
                                       playbackDiv: HTMLElement) => {
    let data;
    const req = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })

    const statusCode = req.status;

    if (statusCode === 200) {
        data = await req.json();
        if (playbackDiv) {
            let playbackProgress = (data['progress_ms'] / data['item']['duration_ms']) * 100;
            playbackProgressBar.style.width = playbackProgress + '%';
            getAlbumCoverColorPalette(albumCover, albumCanvas, background, playbackDiv, playbackProgressBar);
        }
    } else if (statusCode === 401) {
        data = undefined;
        console.log('Auth token expired, fetching new token.')
        invalidateToken();
    } else {
        data = undefined;
        console.log('Error ' + statusCode);
    }

    return data
}

const invalidateToken = () => {
    invalidate('auth:accessToken');
}