<script>
    import { onDestroy, onMount } from "svelte";

    export let data;
    let accessToken;
    $: accessToken = data.accessToken;

    let playbackStateInterval;
    let playbackData;
    let playbackProgressBar;

    onMount(() => {
        if (accessToken !== '') {
            playbackStateInterval = setInterval(() => {
                getPlaybackState()
            }, 1000)
        }
    })

    onDestroy(() => {
        clearInterval(playbackStateInterval);
    })

    const getPlaybackState = async () => {
        const req = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        })

        const statusCode = req.status;

        if (statusCode === 200) {
            playbackData = await req.json();
            if (playbackProgressBar) {
                let playbackProgress = (playbackData['progress_ms'] / playbackData['item']['duration_ms']) * 100;
                playbackProgressBar.style.width = playbackProgress + '%';
            }
        } else {
            playbackData = undefined;
        }
    }

    const msToMinutesAndSeconds = ms => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);

        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

    *, *::before, *::after {
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
        color: #ddd;
    }

    .current-playback {
        display: flex;
        flex-direction: row;
        padding: 25px;
        align-items: center;
        width: 1600px;
        height: 400px;
        position: relative;
    }

    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #222;
        opacity: 0.9;
        border-radius: 25px;
        z-index: -1;
    }

    .album-cover {
        width: 15%;
        height: auto;
        aspect-ratio: 1/1;
    }

    .song-data {
        display: flex;
        width: 85%;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        padding: 0 30px;
    }

    .song-title {
        font-weight: 700;
        font-size: 60px;
    }

    .song-artist {
        font-weight: 400;
        font-size: 40px;
    }

    .song-progressbar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 20px 0;
    }

    .timer {
        width: 100px;
        text-align: center;
        font-size: 30px;
        flex: 1;
    }

    .timer.left {
        text-align: left;
    }

    .timer.right {
        text-align: right;
    }

    .bar {
        flex: 12;
        position: relative;
    }

    .background-bar {
        position: absolute;
        background: #444;
        width: 100%;
        height: 24px;
        transform: translateY(-12px);
        border-radius: 12px;
    }

    .fill-bar {
        position: absolute;
        background: #bbb;
        width: 0;
        height: 24px;
        transform: translateY(-12px);
        border-radius: 12px;
        transition: width 0.5s ease;
    }
</style>

{#if accessToken}
    {#if playbackData}
        <div class="current-playback">
            <div class="background"></div>
            <img src="{playbackData['item']['album']['images'][1]['url']}" class="album-cover" alt="Album cover">
            <div class="song-data">
                <span class="song-title">{playbackData['item']['name']}</span>
                <span class="song-artist">{playbackData['item']['artists'][0]['name']}</span>
                <div class="song-progressbar">
                    <span class="timer left">{msToMinutesAndSeconds(playbackData['progress_ms'])}</span>
                    <div class="bar">
                        <span class="background-bar"></span>
                        <span class="fill-bar" bind:this={playbackProgressBar}></span>
                    </div>
                    <span class="timer right">{msToMinutesAndSeconds(playbackData['item']['duration_ms'])}</span>
                </div>
            </div>
        </div>
    {:else}
        <div class="current-playback">
            <div class="background"></div>
            <div class="song-title">No playback.</div>
        </div>
    {/if}
{:else}
    <a href="/auth">Auth</a>
{/if}