import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Map, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from "react-leaflet";
import { Icon } from "leaflet";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { getMarkers, selectMarkers, setMarkerType, setEndpoint } from "../features/markerSlice";
import { setLatNE, setLngNE, setLatSW, setLngSW, setZoom } from "../features/mapSlice";

export const LeafMap = () => {
    const dispatch = useDispatch();

    //marker state
    const stateMarker = useSelector(state => state.marker);
    useEffect(() => {dispatch(getMarkers(stateMarker.endpoint));}, [dispatch]);

    // map state
    const stateMap = useSelector(state => state.map);


    // Custom map components
    const GetMarkers = () => {
        const map = useMap();
        const markerType = stateMarker.markerType;

        if (markerType == "cities"){
            return stateMarker.markers.map((el, i) => (
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
        } else if (markerType == "trees") {
            return stateMarker.markers.map((el, i) => (
              <Marker
                key={i}
                position={[el.latitude, el.longitude]}
              >
                <Popup>
                    <p>Scientific Name: {el.scientific_name}</p>
                    <p>Native: {el.native}</p>
                    <p>Condition: {el.condition}</p>
                    <p>Diameter Breast Height (CM): {el.diameter_breast_height_cm}</p>
                </Popup>
              </Marker>
            ));
        }
    };

    // Set marker state based on map properties
    function SetMarkerState() {
        const zoom = stateMap.zoom

        if (zoom < 10) {
            {dispatch(setMarkerType("cities"))}
            {dispatch(setEndpoint("/api/get/cities"))}
        } else {
            {dispatch(setMarkerType("trees"))}
            {dispatch(setEndpoint("/api/get/markers"))}
        }
        return null
    }

    // get map properties
    function GetMapProperties() {
        const map = useMap()
        useMapEvent('moveend', () => {
            const bounds = map.getBounds();
            const latNE = bounds['_northEast'].lat
            const lngNE = bounds['_northEast'].lng
            const latSW = bounds['_southWest'].lat
            const lngSW = bounds['_southWest'].lng
            {
                dispatch(setZoom(map.getZoom()));
                dispatch(setLatNE(latNE));
                dispatch(setLngNE(lngNE));
                dispatch(setLatSW(latSW));
                dispatch(setLngSW(lngSW));
            }
        })
      return null
    }

    // render component
    if (stateMarker.markers.length > 0) {
        return (
            <MapContainer center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <GetMapProperties />
              <SetMarkerState />
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
              <SetMarkerState />
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
        );
    }

}