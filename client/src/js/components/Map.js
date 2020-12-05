import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Map, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "../../css/app.css";

class LeafMap extends Component {
  render() {
    return (
        <MapContainer center={[37.8, -96]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
    );
  }
}

export default LeafMap;