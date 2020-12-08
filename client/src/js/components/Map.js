import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getMarkers, setEndpoint } from "../features/markerSlice";
import { setLatNE, setLngNE, setLatSW, setLngSW, setZoom, setLat, setLng } from "../features/mapSlice";

export const LeafMap = () => {
    const dispatch = useDispatch();

    //marker state
    const stateMarker = useSelector(state => state.marker);
    useEffect(() => {
        dispatch(getMarkers(stateMarker.endpoint));
    }, [stateMarker.endpoint]);

    // map state
    const stateMap = useSelector(state => state.map);


    // Custom map components
    const GetMarkers = () => {
        const markerType = stateMarker.markerType;

        if (markerType === "cities"){
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
        } else if (markerType === "trees") {
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

    // get map properties
    function GetMapProperties() {
        const map = useMap();

        useMapEvents({
            dragend: () => {
                const bounds = map.getBounds();
                const latNE = bounds['_northEast'].lat
                const lngNE = bounds['_northEast'].lng
                const latSW = bounds['_southWest'].lat
                const lngSW = bounds['_southWest'].lng
                batch(() => {
                    dispatch(setLat(map.getCenter().lat))
                    dispatch(setLng(map.getCenter().lng))
                    dispatch(setLatNE(latNE));
                    dispatch(setLngNE(lngNE));
                    dispatch(setLatSW(latSW));
                    dispatch(setLngSW(lngSW));
                });
            },
            zoomend: () => {
                {
                    const zoom = map.getZoom();
                    batch(() => {
                        dispatch(setZoom(zoom));
                        dispatch(setLat(map.getCenter().lat));
                        dispatch(setLng(map.getCenter().lng));
                        if (zoom < 10) {
                            dispatch(setEndpoint("cities"))
                        } else {
                            dispatch(setEndpoint("trees"))
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
    if (stateMarker.markers.length > 0) {
        return (
            <MapContainer center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
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