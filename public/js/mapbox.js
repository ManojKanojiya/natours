export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFub2otMTk5OCIsImEiOiJja2JuN2xvamEwdHh2MnVxdGZzMG1lamQzIn0.xQpR0dd0AYB65Q9V06Il2w';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/manoj-1998/ckbn9re8q26fg1iobtrxwejj6',
        scrollZoom: false
        // center: [-118.11349134, 34.111745],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'marker'

        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);


        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        bounds.extend(loc.coordinates);
    })

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}


