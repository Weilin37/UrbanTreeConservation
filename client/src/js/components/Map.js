import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getCities, getTrees, setEndpoint } from "../features/markerSlice";
import { setLatBnd, setLngBnd, setZoom, setLat, setLng } from "../features/mapSlice";

export const LeafMap = () => {
    const dispatch = useDispatch();

    function calculate_distance(pointx1, pointy1, pointx2, pointy2) {
        return Math.sqrt(Math.pow((pointx1-pointx2),2)+Math.pow((pointy1-pointy2),2));
    }

    //marker state
    const stateMarker = useSelector(state => state.marker);
    // map state
    const stateMap = useSelector(state => state.map);

    // Effects
    useEffect(() => {
        dispatch(getCities("/api/get/cities"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(getTrees(stateMarker.endpoint));
    }, [stateMarker.endpoint]);



    // Custom map components
    const GetMarkers = () => {
        const markerType = stateMarker.markerType;

        if (markerType === "cities"){
            return stateMarker.cities.map((el, i) => (
              <Marker
                key={i}
                position={[el.latitude, el.longitude]}
              >
                <Popup>
                    <p>City: {el.city}</p>
                    <p>State: {el.state}</p>
                    <p>Number of Trees: {el.num_trees}</p>
                </Popup>
              </Marker>
            ));
        } else if (markerType === "trees") {
            return stateMarker.trees.map((el, i) => (
              <Marker
                key={i}
                position={[el.latitude, el.longitude]}
              >
                <Popup>
                    <p>City: {el.city}</p>
                    <p>State: {el.state}</p>
                    <p>Scientific Name: {el.scientific_name}</p>
                    <p>Native: {el.native}</p>
                    <p>Condition: {el.condition}</p>
                    <p>Diameter Breast Height (CM): {el.diameter_breast_height_cm}</p>
                </Popup>
              </Marker>
            ));
        }
    };

    // get map properties
    function GetMapProperties() {
        const map = useMap();

        useMapEvents({
            dragend: () => {

                const radius = calculate_distance(stateMap.lat, stateMap.lng, stateMap.latBnd, stateMap.lngBnd)
                const distance_change = calculate_distance(stateMap.lat, stateMap.lng, stateMap.previous_lat, stateMap.previous_lng)

                const bounds = map.getBounds();
                const latBnd = bounds['_northEast'].lat
                const lngBnd = bounds['_northEast'].lng
                const zoom = map.getZoom();
                const lat = map.getCenter().lat;
                const lng = map.getCenter().lng;
                batch(() => {
                    dispatch(setLat(map.getCenter().lat))
                    dispatch(setLng(map.getCenter().lng))
                    dispatch(setLatBnd(latBnd));
                    dispatch(setLngBnd(lngBnd));
                    dispatch(setZoom(stateMap.zoom))
                    if (zoom >= 10 && (Math.abs(distance_change) / radius) > 0.5) {
                        dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBnd, lngbnd:lngBnd, limit:500}))
                    }
                });
            },
            zoomend: () => {
                {
                    const bounds = map.getBounds();
                    const latBnd = bounds['_northEast'].lat
                    const lngBnd = bounds['_northEast'].lng
                    const zoom = map.getZoom();
                    const lat = map.getCenter().lat;
                    const lng = map.getCenter().lng;
                    batch(() => {
                        dispatch(setZoom(zoom));
                        dispatch(setLat(lat));
                        dispatch(setLng(lng));
                        dispatch(setLatBnd(latBnd));
                        dispatch(setLngBnd(lngBnd));
                        if (zoom < 10) {
                            dispatch(setEndpoint({type:"cities"}))
                        } else if (zoom < 16 && zoom >= 10) {
                            dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBnd, lngbnd:lngBnd, limit:500}))
                        } else {
                            dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBnd, lngbnd:lngBnd, limit:500}))
                        }

                    });
                }
            }
        });

        useEffect(() => {
            map.setView([stateMap.lat, stateMap.lng], stateMap.zoom);
        }, [stateMap.lat, stateMap.lng, stateMap.zoom]);
      return null
    }

    // render component
    if (stateMarker.cities.length > 0) {
        return (
            <MapContainer preferCanvas={true} center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <GetMapProperties />
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GetMarkers />
            </MapContainer>
        );
    } else {
        return (
            <MapContainer center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
        );
    }

}