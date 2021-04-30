import React, { useEffect } from "react";
import FreeDrawCustom from "./FreeDrawCustom";
import DrawAnalysisNative from "./DrawAnalysisNative";
import DrawSimilarityButtons from "./DrawSimilarityButtons";
import GetMarkers from "./GetMarkers";
import Loading from "./Loading";
import DataViewButtons from "./DataViewButtons";
import { Map, TileLayer } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { getGlobal } from "../features/markerSlice";

import Filters from "./Filters";

export const LeafMap = () => {
    const dispatch = useDispatch();

    // state
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);

    // Effects
    useEffect(() => {
        dispatch(getGlobal(stateMarker.endpoint));
    }, [dispatch]);

    // render component
    if (stateMarker.global.length > 0) {
        return (
            <Map doubleClickZoom={false} preferCanvas={false} center={[stateMap.lat, stateMap.lng]}
            zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              <Loading />
              <GetMarkers />
              <FreeDrawCustom />
              <DataViewButtons />
              <DrawAnalysisNative />
              <Filters />
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