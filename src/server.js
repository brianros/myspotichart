require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios'); // Make sure to install axios: npm install axios
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Function to get access token
async function getAccessToken() {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'client_credentials'
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

app.get('/api/charts/top-tracks', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const tracks = response.data.items.map(item => ({
      name: item.track.name,
      artists: item.track.artists.map(artist => artist.name)
    }));
    
    res.json({ tracks });
  } catch (error) {
    console.error('Error fetching top tracks:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch top tracks', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));