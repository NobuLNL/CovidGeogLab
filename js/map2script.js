mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 6.5,
            minZoom: 4,
            center: [-120.5, 47.5]
        });
        const grades = [1000, 5000, 10000, 20000, 30000, 60000],
            colors = ['rgb(32,194,255)', 'rgb(32,255,208)', 'rgb(82,255,32)', 'rgb(255,252,32)', 'rgb(227,117,50)', 'rgb(227,50,50)'],
            radii = [5, 7.5, 10, 12.5, 15, 20];
        
        map.on('load', () => { 
            map.addSource('covid', {
                type: 'geojson',
                data: 'assets/us-covid-2020-counts.json'
            });
            map.addLayer({
                'id': 'covid-point',
                'type': 'circle',
                'source': 'covid',
                'minzoom': 5,
                'paint': {
                    'circle-radius': {
                        'property': 'mag',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]],
                            [grades[3], radii[3]],
                            [grades[4], radii[4]],
                            [grades[5], radii[5]]
                        ]
                    },
                    'circle-color': {
                        'property': 'mag',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]],
                            [grades[3], colors[3]],
                            [grades[4], colors[4]],
                            [grades[5], colors[5]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            });
            map.on('click', 'covid-point', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>Magnitude:</strong> ${event.features[0].properties.mag}`)
                    .addTo(map);
            });
        });
        const legend = document.getElementById('legend');
        var labels = ['<strong>Covid-19 Cases</strong>'],
            vbreak;
        for (var i = 0; i < grades.length; i++) {
            vbreak = grades[i];
            dot_radii = 2 * radii[i];
            labels.push(
                '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
                'px; height: ' +
                dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
                '</span></p>');
        }
        const source =
            '<p style="text-align: center; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
        legend.innerHTML = labels.join('') + source;