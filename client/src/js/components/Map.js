import React, { useEffect } from "react";
import RescanMarkers from "./RescanMarkers";
import DrawBounds from "./DrawBounds";
import FreeDrawCustom from "./FreeDrawCustom";
import FreeDrawButtons from "./FreeDrawButtons";
import GetMarkers from "./GetMarkers";
import { Map, TileLayer } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getCities, getTrees, setEndpoint, setViewStatus, clearTrees, setScanStatus, setScanRadius, setScanCenter, setScanZoom } from "../features/markerSlice";
import { setSearch } from "../features/mapSlice";

export const LeafMap = () => {
    const dispatch = useDispatch();

    // state
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);

    const clusterZoom = stateMarker.clusterZoom;

    // Effects
    useEffect(() => {
        dispatch(getCities("/api/get/cities"));
    }, [dispatch]);

    useEffect(() => {
        if (stateMarker.scan_status === "scanning" && stateMarker.scan_zoom >= stateMarker.clusterZoom) {
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
        const radius = Math.round(0.5*getDistance([latNE, lngNE],[lat, lng]));

        if (zoom < clusterZoom) {
           dispatch(setViewStatus("cities"));
        }
        else {
            dispatch(setViewStatus("cluster"));
            if (stateMap.search === "searching") {
                batch(() => {
                    dispatch(clearTrees());
                    dispatch(setScanRadius(radius));
                    dispatch(setScanCenter({lat:lat, lng:lng}));
                    dispatch(setScanZoom(zoom));
                    dispatch(setSearch("waiting"))
                    dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, radius:radius, limit:1000}));
                    dispatch(setScanStatus("scanning"));
                });
            }
        }

    }

    // render component
    if (stateMarker.cities.length > 0) {
        return (
            <Map onmoveend={handlemoveend} doubleClickZoom={false} preferCanvas={true} center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              <DrawBounds />
              <GetMarkers />
              <RescanMarkers />
              <FreeDrawButtons />
              <FreeDrawCustom />
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