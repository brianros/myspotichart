const express = require('express');
const router = express.Router();
const { processTopTracksData } = require('../services/chartDataService');
const { getTopTracks } = require('../services/spotifyService');

router.get('/top-tracks', async (req, res) => {
  const { timeRange = 'medium_term', limit = 50 } = req.query;
  try {
    const tracks = await getTopTracks(timeRange, parseInt(limit));
    const processedData = await processTopTracksData(timeRange, parseInt(limit));
    res.json(processedData);
  } catch (error) {
    console.error('Error in /top-tracks route:', error);
    res.status(500).json({ error: 'Error fetching top tracks', details: error.message });
  }
});

module.exports = router;