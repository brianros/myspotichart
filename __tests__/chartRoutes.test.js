const request = require('supertest');
const { app } = require('../src/index');
const { processTopTracksData, getArtistFrequency } = require('../src/services/chartDataService');
const { getTopTracks } = require('../src/services/spotifyService');

// Mock the services and Spotify API
jest.mock('../src/services/chartDataService');
jest.mock('../src/services/spotifyService');
jest.mock('spotify-web-api-node', () => {
  return jest.fn().mockImplementation(() => ({
    clientCredentialsGrant: jest.fn().mockResolvedValue({ body: { access_token: 'mock_token' } }),
    setAccessToken: jest.fn(),
  }));
});

describe('Chart Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/charts/top-tracks', () => {
    it('should return processed top tracks data', async () => {
      const mockRawTracks = [
        { name: 'Track 1', artists: [{ name: 'Artist 1' }], album: { name: 'Album 1' }, popularity: 80, duration_ms: 200000 },
        { name: 'Track 2', artists: [{ name: 'Artist 2' }], album: { name: 'Album 2' }, popularity: 70, duration_ms: 180000 },
      ];

      const mockChartData = {
        timeRange: 'short_term',
        trackCount: 2,
        averagePopularity: 75,
        tracks: [
          { position: 1, name: 'Track 1', artist: 'Artist 1', album: 'Album 1', popularity: 80, duration: 200000 },
          { position: 2, name: 'Track 2', artist: 'Artist 2', album: 'Album 2', popularity: 70, duration: 180000 },
        ],
      };

      getTopTracks.mockResolvedValue(mockRawTracks);
      processTopTracksData.mockResolvedValue(mockChartData);

      const response = await request(app).get('/api/charts/top-tracks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockChartData);
      expect(getTopTracks).toHaveBeenCalledWith(undefined, undefined);
      expect(processTopTracksData).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should handle errors', async () => {
      getTopTracks.mockRejectedValue(new Error('API Error'));

      const response = await request(app).get('/api/charts/top-tracks');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error fetching top tracks' });
    });
  });

  describe('GET /api/charts/artist-frequency', () => {
    it('should return artist frequency data', async () => {
      const mockChartData = {
        tracks: [
          { position: 1, name: 'Track 1', artist: 'Artist 1' },
          { position: 2, name: 'Track 2', artist: 'Artist 2' },
          { position: 3, name: 'Track 3', artist: 'Artist 1' },
        ],
      };

      const mockArtistFrequency = [
        { artist: 'Artist 1', count: 2 },
        { artist: 'Artist 2', count: 1 },
      ];

      processTopTracksData.mockResolvedValue(mockChartData);
      getArtistFrequency.mockReturnValue(mockArtistFrequency);

      const response = await request(app).get('/api/charts/artist-frequency');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArtistFrequency);
      expect(processTopTracksData).toHaveBeenCalledWith(undefined, undefined);
      expect(getArtistFrequency).toHaveBeenCalledWith(mockChartData.tracks);
    });

    it('should handle errors', async () => {
      processTopTracksData.mockRejectedValue(new Error('API Error'));

      const response = await request(app).get('/api/charts/artist-frequency');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error fetching artist frequency' });
    });
  });
});