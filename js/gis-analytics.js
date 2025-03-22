// Initialize map
let map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Sample data for different layers
const mapLayers = {
    soil: {
        data: [
            { lat: 51.505, lng: -0.09, value: 'Good' },
            { lat: 51.51, lng: -0.1, value: 'Excellent' }
        ],
        color: '#4CAF50'
    },
    water: {
        data: [
            { lat: 51.505, lng: -0.09, value: 'Well' },
            { lat: 51.515, lng: -0.095, value: 'Well' }
        ],
        color: '#1976D2'
    },
    yield: {
        data: [
            { lat: 51.505, lng: -0.09, value: 'High' },
            { lat: 51.51, lng: -0.1, value: 'Medium' }
        ],
        color: '#FFC107'
    }
};

let currentLayer = null;

// Function to update map layer
function updateMapLayer(layerType) {
    // Remove current layer if exists
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    // Create new layer group
    currentLayer = L.layerGroup();

    // Add markers for selected layer
    mapLayers[layerType].data.forEach(point => {
        L.circle([point.lat, point.lng], {
            color: mapLayers[layerType].color,
            fillColor: mapLayers[layerType].color,
            fillOpacity: 0.5,
            radius: 500
        })
        .bindPopup(`Value: ${point.value}`)
        .addTo(currentLayer);
    });

    // Add layer to map
    currentLayer.addTo(map);
}

// Event listeners
document.getElementById('mapLayer').addEventListener('change', (e) => {
    updateMapLayer(e.target.value);
});

document.getElementById('refreshMap').addEventListener('click', () => {
    const currentLayerType = document.getElementById('mapLayer').value;
    updateMapLayer(currentLayerType);
});

// Initialize with soil health layer
updateMapLayer('soil'); 