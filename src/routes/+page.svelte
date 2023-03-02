<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { getPlaybackState } from "../lib/getPlaybackState.ts";
    import { msToMinSec } from "../lib/msToMinSec";

    export let data;
    let accessToken;

    $: accessToken = data.accessToken;

    let playbackStateInterval, playbackData;
    let albumCover, songTitle, songArtist, songDuration, songProgress;
    let playbackProgressBarEl, playbackBackgroundEl, playbackDivEl, albumCoverEl, albumCanvasEl;

    $: {
        if (playbackData) {
            albumCover = playbackData['item']['album']['images'][1]['url'];
            songTitle = playbackData['item']['name'];
            songArtist = playbackData['item']['artists'][0]['name'];
            songDuration = msToMinSec(playbackData['item']['duration_ms']);
            songProgress = msToMinSec(playbackData['progress_ms']);
        }
    }

    onMount(() => {
        if (accessToken) {
            playbackStateInterval = setInterval(() => {
                getPlaybackState(accessToken, playbackProgressBarEl, albumCoverEl, albumCanvasEl, playbackBackgroundEl, playbackDivEl)
                    .then(res => playbackData = res);
            }, 1000)
        }
    })

    onDestroy(() => {
        clearInterval(playbackStateInterval);
    })
</script>
<svelte:head>
    <link rel="stylesheet" href="/style.css?v=1.2">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>
<canvas id="canvas" bind:this={albumCanvasEl}></canvas>
{#if accessToken}
    {#if playbackData}
        <div class="current-playback" bind:this={playbackDivEl}>
            <div class="background" bind:this={playbackBackgroundEl}></div>
            <img crossorigin="anonymous" src="{albumCover}" class="album-cover" alt="Album cover" bind:this={albumCoverEl}>
            <div class="song-data">
                <span class="title">{songTitle}</span>
                <span class="artist">{songArtist}</span>
                <div class="song-progressbar">
                    <span class="timer left">{songProgress}</span>
                    <div class="bar">
                        <span class="background-bar"></span>
                        <span class="fill-bar" bind:this={playbackProgressBarEl}></span>
                    </div>
                    <span class="timer right">{songDuration}</span>
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