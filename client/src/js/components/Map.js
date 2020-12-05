import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Map, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "../../css/app.css";
import { get_latlng } from "../actions/index";


export class LeafMap extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.get_latlng();
    }

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

function mapStateToProps(state) {
  return {
    latlng: state
  };
}

export default connect(mapStateToProps, {get_latlng })(LeafMap);