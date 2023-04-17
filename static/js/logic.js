// Select and create a url for the geoJSON
// Selected all earthquakes with a magnitude of 2.5 or greater in the past 30 days
const queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    });

function createFeatures(earthquakeData) {

    // Give each feature a popup that describes place, time, magnitude, depth
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Function to create the markers 
    function createMarkers(feature, latlng){
        let markerOptions = {
            radius: feature.properties.mag * 4,
            fillColor: depthColors(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: depthColors(feature.geometry.coordinates[2]),
            weight: 1,
        };
        return L.circleMarker(latlng, markerOptions);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarkers
    });
    
  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
};

// Function to assign the color of the marker based on depth (features.geometry.coordinates[2])
function depthColors(depth) {

    // Loop through the depth intervals and assign the color (red to yellow) based on the depth
    if (depth > 5) return '#EF0504';
    else if (depth > 4) return '#FF2B05';
    else if (depth > 3) return '#FD6004';
    else if (depth > 2) return '#FC9A03';
    else if (depth > 1) return '#FECE04';
    else return '#FEF001';
};

function createMap(earthquakes) {

    // Create the base layers
    // Topo map layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Esri DeLorme map layer
    let Esri_DeLorme = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
        minZoom: 1,
        maxZoom: 11
    });

    // Create the basemaps object
    let baseMaps = {
        "Esri DeLorme": Esri_DeLorme,
        "Topo": topo
    };

    // Create the overlay object
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create the map, giving it the Esri DeLorme and earthquakes layers to display on load
    let myMap = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [Esri_DeLorme, earthquakes]
    });

    // Create a layer control
    // Pass in the baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

};