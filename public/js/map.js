/*
console.log('map.js loaded');

console.log('listing from EJS:', listing);

if (!listing || !listing.geometry) {
  console.error('❌ geometry missing');
} else {
  console.log('✅ geometry found', listing.geometry);

  const lat = listing.geometry.coordinates[1];
  const lng = listing.geometry.coordinates[0];

  const map = L.map('map').setView([lat, lng], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${listing.title}</b><br>₹ ${listing.price}/night`)
    .openPopup();
} */
/*
if (listing.geometry && listing.geometry.coordinates) {
  const lat = listing.geometry.coordinates[1];
  const lng = listing.geometry.coordinates[0];

  const map = L.map('map').setView([lat, lng], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${listing.title}</b><br>₹ ${listing.price}/night`)
    .openPopup();
}
    */
if (listing.geometry && listing.geometry.coordinates) {
  const lat = listing.geometry.coordinates[1];
  const lng = listing.geometry.coordinates[0];

  const map = L.map('map').setView([lat, lng], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // RED MARKER ICON
  const redIcon = L.icon({
    iconUrl: '/images/marker-icon-red.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // RED MARKER
  L.marker([lat, lng], { icon: redIcon })
    .addTo(map)
    .bindPopup(`<b>${listing.title}</b><br>₹ ${listing.price}/night`)
    .openPopup();
}
