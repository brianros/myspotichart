const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

async function authenticateSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify API authenticated successfully');
  } catch (error) {
    console.error('Error authenticating Spotify API:', error);
  }
}

async function getTopTracks(timeRange = 'short_term', limit = 50) {
  try {
    const data = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: limit });
    return data.body.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
}

module.exports = {
  authenticateSpotify,
  getTopTracks
};