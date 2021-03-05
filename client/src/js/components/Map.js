import React, { useEffect } from "react";
import RescanMarkers from "./RescanMarkers";
import DrawBounds from "./DrawBounds";
import FreeDrawCustom from "./FreeDrawCustom";
import FreeDrawButtons from "./FreeDrawButtons";
import DrawAnalysisNative from "./DrawAnalysisNative";
import DrawSimilarityButtons from "./DrawSimilarityButtons";
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

    // render component
    if (stateMarker.global.length > 0) {
        return (
            <Map doubleClickZoom={false} preferCanvas={true} center={[stateMap.lat, stateMap.lng]}
            zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />

              <GetMarkers />
              <FreeDrawCustom />
              <DataViewButtons />
              <DrawAnalysisNative />
              <DrawSimilarityButtons />
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