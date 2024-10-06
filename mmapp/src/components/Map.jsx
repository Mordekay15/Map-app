import React, {useEffect, useRef, useState} from 'react';
import SearchAndFilters from "./SearchAndFilters.jsx";
import Header from "./Header.jsx";
import mapboxgl from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css';

import {supabase} from "./SupabaseClient.jsx";

mapboxgl.accessToken = 'YOUR MAPBOX API KEY'

function MainMap() {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const [dataDB, setData] = useState([]);

    const myLoc = [28.09190, 61.06495];

    const removeMarkersAndRoute = () => {
        if (mapRef.current.getLayer('points')) {
            mapRef.current.removeLayer('points');
        }
        if (mapRef.current.getSource('points')) {
            mapRef.current.removeSource('points');
        }
        if (mapRef.current.getLayer('route')) {
            mapRef.current.removeLayer('route');
        }
        if (mapRef.current.getSource('route')) {
            mapRef.current.removeSource('route');
        }
    };

    const showThePlaceOnMap = (placeLoc) => {
        console.log(placeLoc);

        const features = [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [placeLoc.geometry.coordinates[0], placeLoc.geometry.coordinates[1]], // Координаты метки
                },
                properties: {
                    title: placeLoc.properties.title || 'Name',
                }
            },
            {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [myLoc[0], myLoc[1]], // Координаты метки
            },
            properties: {
                title: 'My location',
            },
        }];

        const addMarkerToMap = () => {
            if (mapRef.current.hasImage('custom-marker')) {
                mapRef.current.removeImage('custom-marker');
            }

            mapRef.current.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                (error, image) => {
                    if (error) throw error;

                    mapRef.current.addImage('custom-marker', image);

                    if (mapRef.current.getSource('points')) {
                        mapRef.current.getSource('points').setData({
                            type: 'FeatureCollection',
                        });
                    } else {
                        mapRef.current.addSource('points', {
                            type: 'geojson',
                            data: {
                                type: 'FeatureCollection',
                                features: features,
                            },
                        });

                        mapRef.current.addLayer({
                            id: 'points',
                            type: 'symbol',
                            source: 'points',
                            layout: {
                                'icon-image': 'custom-marker',
                                'text-field': ['get', 'title'],
                                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top',
                            },
                        });
                    }
                }
            );
        };

        const drawRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${myLoc[0]},${myLoc[1]};${placeLoc.geometry.coordinates[0]},${placeLoc.geometry.coordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                const route = data.routes[0].geometry;

                if (mapRef.current.getSource('route')) {
                    mapRef.current.getSource('route').setData({
                        type: 'Feature',
                        geometry: route,
                    });
                } else {
                    mapRef.current.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: route,
                        },
                    });

                    mapRef.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': '#3887be',
                            'line-width': 5,
                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        };

        if (mapRef.current.loaded()) {
            addMarkerToMap();
            drawRoute();
        } else {
            mapRef.current.on('load', () => {
                addMarkerToMap();
                drawRoute();
            });
        }
    };

    const fetchData = async () => {
        let { data:Venue, error } = await supabase
            .from('Venue')
            .select('location');

        if (error) {
            console.error('Ошибка при получении данных:', error);
        }
        else {
            setData(Venue);
        }
    };

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [28.14926, 61.05659],
            zoom: 12,
        });

        fetchData();
    }, []);

    return (
        <>
            <Header />
            <div id="map-container" ref={mapContainerRef} />
            <SearchAndFilters handleVenueClick={showThePlaceOnMap} deletePath={removeMarkersAndRoute}/>
        </>
    );
}

export default MainMap;