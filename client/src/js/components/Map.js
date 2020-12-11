import React, { useEffect } from "react";
import RescanMarkers from "./RescanMarkers";
import DrawBounds from "./DrawBounds";
import { Map, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getCities, getTrees, setEndpoint, clearTrees, setScan, setRadius } from "../features/markerSlice";
import { setSearchBounds, setZoom, setCenter } from "../features/mapSlice";
import MarkerClusterGroup from "react-leaflet-markercluster";

export const LeafMap = () => {
    // Parameters
    const clusterZoom = 10;
    const treeZoom = 16;

    const dispatch = useDispatch();

    //marker state
    const stateMarker = useSelector(state => state.marker);
    // map state
    const stateMap = useSelector(state => state.map);

    // Effects
    useEffect(() => {
        dispatch(getCities("/api/get/cities"));
    }, [dispatch]);

    useEffect(() => {
        if (stateMap.zoom >= clusterZoom && stateMarker.scan_status === "scanning") {
            console.log("api")
           dispatch(getTrees(stateMarker.endpoint));
        }
    }, [stateMarker.endpoint]);

    function toRadian(degree) {
        return degree*Math.PI/180;
    }

    function getDistance(origin, destination) {
        // return distance in meters
        var lon1 = toRadian(origin[1]),
            lat1 = toRadian(origin[0]),
            lon2 = toRadian(destination[1]),
            lat2 = toRadian(destination[0]);

        var deltaLat = lat2 - lat1;
        var deltaLon = lon2 - lon1;

        var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var EARTH_RADIUS = 6371;
        return c * EARTH_RADIUS * 1000;
    }

    function handlemoveend(e) {
        const map = e.target;
        const zoom = map.getZoom();
        const lat = map.getCenter().lat;
        const lng = map.getCenter().lng;

        const bounds = map.getBounds();
        const latNE = bounds['_northEast'].lat
        const lngNE = bounds['_northEast'].lng
        const radius = Math.round(0.5*getDistance([latNE, lngNE],[lat, lng]))
        const distance_from_center = getDistance([lat, lng],[stateMap.previous_lat,stateMap.previous_lng])
        const outOfBounds = (distance_from_center > stateMarker.radius)

        if (zoom < clusterZoom) {
            batch(() => {
               console.log("cities")
               dispatch(clearTrees());
               dispatch(setScan("waiting"));
               dispatch(setRadius(0));
               dispatch(setCenter({lat:lat, lng:lng}));
               dispatch(setZoom(zoom));
               dispatch(setSearchBounds({latNE:0, lngNE:0}));
               dispatch(setEndpoint({type:"cities"}))
            });
        }
        else {
            if (outOfBounds) {
                console.log("outofbounds")
                batch(() => {
                    dispatch(clearTrees());
                    dispatch(setRadius(radius));
                    dispatch(setScan("scanning"));
                    dispatch(setCenter({lat:lat, lng:lng}));
                    dispatch(setZoom(zoom));
                    dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, radius:radius, limit:5000}));
                    dispatch(setSearchBounds({latNE:latNE, lngNE:lngNE}));
                });
            }
        }

    }

    const GetMarkers = () => {
        const zoom = stateMap.zoom;

        if (zoom < clusterZoom){
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
        } else if (zoom < treeZoom && zoom >= clusterZoom) {
                return (
                <MarkerClusterGroup disableClusteringAtZoom={treeZoom} spiderfyOnMaxZoom={false}>
                    {stateMarker.trees.map((el, i) => (
                      <Circle key={i} center={[el.latitude, el.longitude]} radius={5} color={"green"}>
                        <Popup>
                            <p>City: {el.city}</p>
                            <p>State: {el.state}</p>
                            <p>Scientific Name: {el.scientific_name}</p>
                            <p>Native: {el.native}</p>
                            <p>Condition: {el.condition}</p>
                            <p>Diameter Breast Height (CM): {el.diameter_breast_height_cm}</p>
                        </Popup>
                      </Circle>
                    ))}
                </MarkerClusterGroup>
                )
        } else if (zoom >= treeZoom ) {
            return stateMarker.trees.map((el, i) => (
              <Circle key={i} center={[el.latitude, el.longitude]} radius={10} color={"green"}>
                <Popup>
                    <p>City: {el.city}</p>
                    <p>State: {el.state}</p>
                    <p>Scientific Name: {el.scientific_name}</p>
                    <p>Native: {el.native}</p>
                    <p>Condition: {el.condition}</p>
                    <p>Diameter Breast Height (CM): {el.diameter_breast_height_cm}</p>
                </Popup>
              </Circle>
            ))
        }
    };

    // render component
    if (stateMarker.cities.length > 0) {
        return (
            <Map onmoveend={handlemoveend} preferCanvas={true} center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              <DrawBounds />
              <GetMarkers />
              <RescanMarkers />
            </Map>
        );
    } else {
        return (
            <Map center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              <RescanMarkers />
            </Map>
        );
    }

}