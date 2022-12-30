mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12',
  center: cinema.geometry.coordinates,
  zoom: 15,
});

// create marker
const marker = new mapboxgl.Marker({ color: 'hsl(171, 100%, 41%)' })
  .setLngLat(cinema.geometry.coordinates)
  .addTo(map);
