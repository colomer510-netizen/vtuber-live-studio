import SpotifyWebApi from 'spotify-web-api-node';
import { EventEmitter } from 'events';

export const spotifyEvents = new EventEmitter();

let spotifyApi: SpotifyWebApi | null = null;

export function initializeSpotify(clientId: string, clientSecret: string, redirectUri: string) {
  spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });
  console.log('Spotify initialized with Client ID:', clientId);
}

// Generate the authorization URL
export function getSpotifyAuthUrl(): string {
  if (!spotifyApi) return '';
  const scopes = ['user-modify-playback-state', 'user-read-playback-state', 'user-read-currently-playing'];
  const state = 'vtuber-app-state';
  return spotifyApi.createAuthorizeURL(scopes, state);
}

// Set access token after getting it from auth flow or from storage
export function setSpotifyTokens(accessToken: string, refreshToken?: string) {
  if (!spotifyApi) return;
  spotifyApi.setAccessToken(accessToken);
  if (refreshToken) {
    spotifyApi.setRefreshToken(refreshToken);
  }
  spotifyEvents.emit('ready');
}

// Spotify playback controls
export async function spotifyPlay() {
  if (!spotifyApi) return;
  try {
    await spotifyApi.play();
  } catch (err) {
    console.error('Error playing Spotify:', err);
  }
}

export async function spotifyPause() {
  if (!spotifyApi) return;
  try {
    await spotifyApi.pause();
  } catch (err) {
    console.error('Error pausing Spotify:', err);
  }
}

export async function spotifyNext() {
  if (!spotifyApi) return;
  try {
    await spotifyApi.skipToNext();
  } catch (err) {
    console.error('Error skipping Spotify:', err);
  }
}

export async function spotifyPrev() {
  if (!spotifyApi) return;
  try {
    await spotifyApi.skipToPrevious();
  } catch (err) {
    console.error('Error skipping prev Spotify:', err);
  }
}

export async function spotifyGetCurrentlyPlaying() {
  if (!spotifyApi) return null;
  try {
    const data = await spotifyApi.getMyCurrentPlayingTrack();
    return data.body;
  } catch (err) {
    console.error('Error getting current track:', err);
    return null;
  }
}
