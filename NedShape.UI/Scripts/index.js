window.onload = function WindowLoad(event) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyc2htZWxsb3dmZWxsbyIsImEiOiJjazIzZTZyeHMwa3F6M25xbzJ2bThhNWVjIn0.v3rsG9DUrePQhJmILZa6SA';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/marshmellowfello/ck23euiyc1q0y1cmmnmjeh5kg', // stylesheet location
        center: [18.5, -33.98], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['cape-map'] // replace this with the name of the layer
        });

        if (!features.length) {
            return;
        }

        var feature = features[0];

        var popup = new mapboxgl.Popup({ offset: [0, -15] })
            .setLngLat(feature.geometry.coordinates)
            .setHTML('<h3 class="pop_up_header">' + feature.properties.title + '</h3><p class="pop_up_paragraph">' + feature.properties.description + '</p>')
            .addTo(map);
    });
    map.addControl(new mapboxgl.NavigationControl());
}