import React, { useEffect } from "react";
import RescanMarkers from "./RescanMarkers";
import DrawBounds from "./DrawBounds";
import GetMarkers from "./GetMarkers";
import { Map, TileLayer } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getCities, getTrees, setEndpoint, setViewStatus, clearTrees, setScan, setScanRadius, setScanCenter } from "../features/markerSlice";
import { setZoom, setCenter } from "../features/mapSlice";

export const LeafMap = () => {
    const dispatch = useDispatch();

    // state
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);

    const clusterZoom = stateMarker.clusterZoom;
    const treeZoom = stateMarker.treeZoom;

    // Effects
    useEffect(() => {
        dispatch(getCities("/api/get/cities"));
    }, [dispatch]);

    useEffect(() => {
        if (stateMarker.scan_status === "scanning") {
            console.log("api")
           dispatch(getTrees(stateMarker.endpoint));
        }
    }, [stateMarker.endpoint]);

    function createEndpoint(lat, lng, radius, limit) {
        return "/api/get/trees?lat="+lat+"&lng="+lng+"&radius="+radius+"&limit="+limit
    }

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
        const radius = Math.round(0.5*getDistance([latNE, lngNE],[lat, lng]));
        const distance_from_center = getDistance([lat, lng],[stateMarker.scan_lat,stateMarker.scan_lng]);
        const outOfBounds = (distance_from_center > stateMarker.scan_radius);

        if (zoom < clusterZoom) {
            batch(() => {
               dispatch(setViewStatus("cities"));
            });
        }
        else {
            console.log("cluster trigger")
            dispatch(setViewStatus("cluster"));
            if (outOfBounds) {
                console.log("outofbounds")
                batch(() => {
                    dispatch(clearTrees());
                    dispatch(setScanRadius(radius));
                    dispatch(setScanCenter({lat:lat, lng:lng}));
                    dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, radius:radius, limit:1000}));
                    dispatch(setScan("scanning"));
                });
            }
        }

    }

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