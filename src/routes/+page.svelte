<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { getPlaybackState } from "../lib/getPlaybackState.ts";
    import { msToMinSec } from "../lib/msToMinSec";

    export let data;
    let accessToken;

    $: accessToken = data.accessToken;

    let playbackStateInterval, playbackData, playbackProgressBar, playbackBackground, playbackDiv;
    let albumCover, albumCanvas;

    onMount(() => {
        if (accessToken !== '') {
            playbackStateInterval = setInterval(async () => {
                playbackData = await getPlaybackState(accessToken,
                    playbackProgressBar,
                    albumCover,
                    albumCanvas,
                    playbackBackground,
                    playbackDiv);
            }, 1000)
        }
    })

    onDestroy(() => {
        clearInterval(playbackStateInterval);
    })
</script>

<style>
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .current-playback {
        display: flex;
        flex-direction: row;
        padding: 25px;
        align-items: center;
        width: 1600px;
        height: 400px;
        position: relative;
        font-family: 'Poppins', sans-serif;
        color: #fff;
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

    .title {
        font-weight: 700;
        font-size: 60px;
    }

    .artist {
        font-weight: 500;
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
        font-weight: 500;
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
        background: #ababab;
        width: 100%;
        height: 24px;
        transform: translateY(-12px);
        border-radius: 12px;
    }

    .fill-bar {
        position: absolute;
        background: none;
        width: 2px;
        height: 24px;
        transform: translate(-1px, -12px);
        border-radius: 12px;
        transition: width 0.5s ease;
    }

    #canvas {
        width: 0;
        height: 0;
    }
</style>

<canvas id="canvas" bind:this={albumCanvas}></canvas>
{#if accessToken}
    {#if playbackData}
        <div class="current-playback" bind:this={playbackDiv}>
            <div class="background" bind:this={playbackBackground}></div>
            <img crossorigin="anonymous" src="{playbackData['item']['album']['images'][1]['url']}" class="album-cover" alt="Album cover" bind:this={albumCover}>
            <div class="song-data">
                <span class="title">{playbackData['item']['name']}</span>
                <span class="artist">{playbackData['item']['artists'][0]['name']}</span>
                <div class="song-progressbar">
                    <span class="timer left">{msToMinSec(playbackData['progress_ms'])}</span>
                    <div class="bar">
                        <span class="background-bar"></span>
                        <span class="fill-bar" bind:this={playbackProgressBar}></span>
                    </div>
                    <span class="timer right">{msToMinSec(playbackData['item']['duration_ms'])}</span>
                </div>
            </div>
        </div>
    {:else}
        <div class="current-playback">
            <div class="background"></div>
            <div class="title">No playback.</div>
        </div>
    {/if}
{:else}
    <a href={data.authURL}>Auth</a>
{/if}