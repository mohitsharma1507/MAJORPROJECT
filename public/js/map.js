// mapboxgl.accessToken ="pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
// const map = new mapboxgl.Map({
//     container: 'map',
//     center: listing.geometry.coordinates,
//     zoom: 9
// });

// const marker =new mapboxgl.Marker({color:"black"})
// .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
// .setPopup(new mapboxgl.Popup({offset:25})//popupOffsets,className:"my-class"}//

// .setHTML("<h3>Exact location provided after listing</h3>"))

// .addTo(map);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [77.2090,28.6139],
    zoom: 9
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML("<h2>Hello World!</h2>"))
    .addTo(map);