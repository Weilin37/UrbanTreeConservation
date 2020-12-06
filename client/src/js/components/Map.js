import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Map, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { getCoordinates,selectCoordinates } from "../features/coordinateSlice";
import axios from 'axios';


export const LeafMap = () => {
    const state = useSelector(state => state.coordinate);
    const dispatch = useDispatch();
    useEffect(() => {dispatch(getCoordinates());}, [dispatch]);

    console.log(state.coordinates[0]);

    if (state.coordinates.length > 0) {
        return (
            <MapContainer center={[37.8, -96]} zoom={5} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[state.coordinates[0].latitude, state.coordinates[0].longitude]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            </MapContainer>
        );
    } else {
        return (
            <MapContainer center={[37.8, -96]} zoom={5} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
        );
    }

}