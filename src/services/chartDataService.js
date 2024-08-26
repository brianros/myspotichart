const { spotifyApi } = require('../index');

/**
 * Fetches and processes top tracks data
 * @param {string} timeRange - The time range for the chart data (short_term, medium_term, long_term)
 * @param {number} limit - The number of tracks to fetch (max 50)
 * @returns {Promise<Object>} Processed chart data
 */
async function processTopTracksData(timeRange = 'short_term', limit = 50) {
  try {
    const data = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: limit });
    const tracks = data.body.items;

    // Process the tracks data
    const processedData = tracks.map((track, index) => ({
      position: index + 1,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      popularity: track.popularity,
      duration: track.duration_ms,
      previewUrl: track.preview_url
    }));

    // Calculate some additional statistics
    const totalPopularity = processedData.reduce((sum, track) => sum + track.popularity, 0);
    const averagePopularity = totalPopularity / processedData.length;

    const chartData = {
      timeRange,
      trackCount: processedData.length,
      averagePopularity,
      tracks: processedData
    };

    return chartData;
  } catch (error) {
    console.error('Error processing top tracks data:', error);
    throw error;
  }
}

/**
 * Groups tracks by artist and counts the number of tracks for each artist
 * @param {Array} tracks - The processed tracks data
 * @returns {Array} Artist frequency data
 */
function getArtistFrequency(tracks) {
  const artistCount = tracks.reduce((acc, track) => {
    const artists = track.artist.split(', ');
    artists.forEach(artist => {
      acc[artist] = (acc[artist] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(artistCount)
    .map(([artist, count]) => ({ artist, count }))
    .sort((a, b) => b.count - a.count);
}

module.exports = {
  processTopTracksData,
  getArtistFrequency
};