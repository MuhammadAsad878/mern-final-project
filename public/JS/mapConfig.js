mapboxgl.accessToken = mapAccessToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 9,
  center: [71.6911, 29.3544], // longitude, latitude
});
