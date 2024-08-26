document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const timeRangeSelect = document.getElementById('timeRange');
    const trackList = document.getElementById('trackList');

    fetchBtn.addEventListener('click', fetchTopTracks);

    async function fetchTopTracks() {
        const timeRange = timeRangeSelect.value;
        try {
            const response = await fetch(`/api/charts/top-tracks?timeRange=${timeRange}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.tracks && Array.isArray(data.tracks)) {
                displayTracks(data.tracks);
            } else {
                throw new Error('Invalid data structure received from server');
            }
        } catch (error) {
            console.error('Error fetching top tracks:', error);
            trackList.innerHTML = `<li>Error fetching tracks: ${error.message}. Please try again.</li>`;
        }
    }

    function displayTracks(tracks) {
        if (!Array.isArray(tracks)) {
            console.error('Invalid tracks data:', tracks);
            trackList.innerHTML = '<li>Error: Invalid track data received.</li>';
            return;
        }
        trackList.innerHTML = '';
        tracks.forEach(track => {
            const li = document.createElement('li');
            li.textContent = `${track.position}. ${track.name} by ${track.artist}`;
            trackList.appendChild(li);
        });
    }
});