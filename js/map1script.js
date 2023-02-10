mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 6.5, 
            minZoom: 4, 
            center: [-120.5, 47.5] 
        });

        async function geojsonFetch() {
            let response = await fetch('assets/us-covid-2020-rates.json');
            let rate_data = await response.json();

            map.on('load', function loadingData() {
                map.addSource('rate_data', {
                    type: 'geojson',
                    data: rate_data
                });

                map.addLayer({
                    'id': 'rate_data_layer',
                    'type': 'fill',
                    'source': 'rate_data',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'density'],
                            '#FFEDA0',   
                            10,          
                            '#FED976',   
                            20,          
                            '#FEB24C',   
                            30,          
                            '#FD8D3C',   
                            40,         
                            '#FC4E2A',   
                            50,         
                            '#E31A1C',   
                            70,         
                            '#BD0026',   
                            90,        
                            "#800026"
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });

                const layers = [
                    '0-9',
                    '10-19',
                    '20-29',
                    '30-39',
                    '40-49',
                    '50-69',
                    '70-89',
                    '90 and more'
                ];
                const colors = [
                    '#FFEDA070',
                    '#FED97670',
                    '#FEB24C70',
                    '#FD8D3C70',
                    '#FC4E2A70',
                    '#E31A1C70',
                    '#BD002670',
                    '#80002670'
                ];

                const legend = document.getElementById('legend');
                legend.innerHTML = "<b>Covid-19 Rates Per Thousand People</b><br><br>";


                layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
            });

            map.on('mousemove', ({point}) => {
                const rate = map.queryRenderedFeatures(point, {
                    layers: ['rate_data_layer']
                });
                document.getElementById('text-description').innerHTML = rate.length ?
                    `<h3>${rate[0].properties.name}</h3><p><strong><em>${rate[0].properties.density}</strong> cases per 1000 people</em></p>` :
                    `<p>Hover over a county!</p>`;
            });
        }

        geojsonFetch();