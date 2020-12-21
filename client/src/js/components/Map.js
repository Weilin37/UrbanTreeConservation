import React, { useEffect } from "react";
import RescanMarkers from "./RescanMarkers";
import DrawBounds from "./DrawBounds";
import FreeDrawCustom from "./FreeDrawCustom";
import FreeDrawButtons from "./FreeDrawButtons";
import GetMarkers from "./GetMarkers";
import DataViewButtons from "./DataViewButtons";
import { Map, TileLayer } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getGlobal, getCity, getFreeDraw, setEndpoint, setViewStatus, clearCity, setScanStatus, setScanRadius, setScanCenter, setScanZoom } from "../features/markerSlice";
import { setSearch } from "../features/mapSlice";

export const LeafMap = () => {
    const dispatch = useDispatch();

    // state
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);

    const cityZoom = stateMarker.cityZoom;

    // Effects
    useEffect(() => {
        dispatch(getGlobal(stateMarker.endpoint));
    }, [dispatch]);

    useEffect(() => {
        if (stateMarker.scan_status === "scanning" && stateMarker.view_status === "city") {
           dispatch(getCity(stateMarker.endpoint));
        }
        else if (stateMarker.scan_status === "scanning" && stateMarker.view_status === "freedraw") {
            console.log("api")
           dispatch(getFreeDraw(stateMarker.endpoint));
        }
    }, [stateMarker.scan_status]);

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

    function handlezoomend(e) {
        const map = e.target;
        const zoom = map.getZoom();

        if (zoom < cityZoom) {
            if (stateMarker.view_status !== "global") {
                dispatch(setViewStatus("global"));
            }
        } else {
            if (stateMarker.view_status === "global" && stateMarker.previous_view_status === "global") {
                dispatch(setViewStatus("city"));
            } else if (stateMarker.view_status === "global" && stateMarker.previous_view_status !== "global") {
                dispatch(setViewStatus(stateMarker.previous_view_status));
            }
        }
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
        if (zoom >= cityZoom) {
            if (stateMap.search === "searching") {
                batch(() => {
                    dispatch(clearCity());
                    dispatch(setScanRadius(radius));
                    dispatch(setScanCenter({lat:lat, lng:lng}));
                    dispatch(setScanZoom(zoom));
                    dispatch(setSearch("waiting"));
                    dispatch(setEndpoint({type:"city", lat:lat, lng:lng, radius:radius, limit:1000}));
                    dispatch(setScanStatus("scanning"));
                });
            }
        }

    }

    // render component
    if (stateMarker.global.length > 0) {
        return (
            <Map onmoveend={handlemoveend} onzoomend={handlezoomend} doubleClickZoom={false} preferCanvas={true} center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              <DrawBounds />
              <GetMarkers />
              <RescanMarkers />
              <FreeDrawButtons />
              <FreeDrawCustom />
              <DataViewButtons />
            </Map>
        );
    } else {
        return (
            <Map center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
            </Map>
        );
    }

}