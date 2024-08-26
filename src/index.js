require('dotenv').config();
    const express = require('express');
    const SpotifyWebApi = require('spotify-web-api-node');

    const app = express();
    const port = process.env.PORT || 3000;

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });