// Select and create a url for the geoJSON
// Selected all earthquakes with a magnitude of 2.5 or greater in the past 30 days
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

// Perform a GET request to the query URL
d3.json(url).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    });

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layer
    let Esri_DeLorme = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
        minZoom: 1,
        maxZoom: 11
    });

    // Create the basemaps object
    let baseMaps = {
        "Esri DeLorme": Esri_DeLorme
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