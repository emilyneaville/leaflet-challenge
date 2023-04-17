// Select and create a url for the geoJSON
// Selected all earthquakes with a magnitude of 2.5 or greater in the past 30 days
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

// Adding tile layer
var Esri_DeLorme = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
	minZoom: 1,
	maxZoom: 11
});