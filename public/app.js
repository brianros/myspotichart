document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-tracks');
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchTopTracks);
    } else {
        console.error("Button with id 'fetch-tracks' not found");
    }
});

async function fetchTopTracks() {
    const trackList = document.getElementById('track-list');
    if (!trackList) {
        console.error("Element with id 'track-list' not found");
        return;
    }

    trackList.innerHTML = 'Loading...';

    try {
        const response = await fetch('/api/charts/top-tracks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && data.tracks && Array.isArray(data.tracks)) {
            trackList.innerHTML = data.tracks.map(track => `
                <li>${track.name} by ${track.artists.join(', ')}</li>
            `).join('');
        } else if (data && data.error) {
            throw new Error(data.error);
        } else {
            throw new Error('Invalid data structure received from server');
        }
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        trackList.innerHTML = `<li>Error: ${error.message}</li>`;
    }
}