import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Map, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { getMarkers, selectMarkers } from "../features/markerSlice";

export const LeafMap = () => {
    //marker state
    const stateMarker = useSelector(state => state.marker);
    const dispatch = useDispatch();
    useEffect(() => {dispatch(getMarkers());}, [dispatch]);

    // map state
    const stateMap = useSelector(state => state.map)

    if (stateMarker.markers.length > 0) {
        return (
            <MapContainer center={stateMap.center} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stateMarker.markers.map(el => (
                <Marker position={[el.latitude, el.longitude]}/>
              ))}
            </MapContainer>
        );
    } else {
        return (
            <MapContainer center={stateMap.center} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
        );
    }

}