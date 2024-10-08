require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const chartRoutes = require('./routes/chartRoutes');

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.use(express.json());
app.use(express.static('public'));

app.use('/api/charts', chartRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Spotify Charts API!');
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

module.exports = { app, spotifyApi, authenticateSpotify };