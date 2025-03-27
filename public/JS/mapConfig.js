

mapboxgl.accessToken = mapAccessToken;


const coordinates = listingData.geometry.coordinates;
const lctn = listingData.location;


// const popupOffsets = {
//   'top': [0, 0],
//   'top-left': [0, 0],
//   'top-right': [0, 0],
//   'bottom': [0, -markerHeight],
//   'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
//   'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
//   'left': [markerRadius, (markerHeight - markerRadius) * -1],
//   'right': [-markerRadius, (markerHeight - markerRadius) * -1]
// };
// console.log(coordinates);
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  // projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 9,
  // center: [71.6911, 29.3544], // longitude, latitude
  center: coordinates, // longitude, latitude
});


 // Create a default Marker and add it to the map. it will mark the location according to coordinates generated using our location
 const marker1 = new mapboxgl.Marker({color:'red'})
 .setLngLat(coordinates)
 .setPopup(
  new mapboxgl.Popup({ offset: 15, closeButton: false, className: "custom-popup" })
    .setHTML(`
      <div class="popup-container">
        <h3 class="popup-title">${lctn}</h3>
        <p class="popup-text">📍 Exact location provided after booking</p>
       
      </div>
    `)
)
 .addTo(map);





//  .setLngLat([12.554729, 55.70651])



