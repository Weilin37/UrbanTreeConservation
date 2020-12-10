import React, { useEffect } from "react";
import { Map, Marker, Popup, TileLayer, Circle, Rectangle } from "react-leaflet";
import "../../css/app.css";
import { useSelector, useDispatch, batch } from "react-redux";
import { getCities, getTrees, setEndpoint } from "../features/markerSlice";
import {setLatBndNE,
        setLngBndNE,
        setLatBndSW,
        setLngBndSW,
        setSearchLatNE,
        setSearchLngNE,
        setSearchLatSW,
        setSearchLngSW,
        setZoom,
        setLat,
        setLng
        } from "../features/mapSlice";
import MarkerClusterGroup from "react-leaflet-markercluster";

export const LeafMap = () => {
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
        if (stateMarker.markerType === "trees") {
           dispatch(getTrees(stateMarker.endpoint));
        }
    }, [stateMarker.endpoint]);

    function handleMoveend(e) {
        const map = e.target;
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        const latBndNE = bounds['_northEast'].lat
        const lngBndNE = bounds['_northEast'].lng
        const latBndSW = bounds['_southWest'].lat
        const lngBndSW = bounds['_southWest'].lng
        const lat = map.getCenter().lat;
        const lng = map.getCenter().lng;

        batch(() => {
            dispatch(setZoom(zoom));
            dispatch(setLat(lat))
            dispatch(setLng(lng))
            dispatch(setLatBndNE(latBndNE));
            dispatch(setLngBndNE(lngBndNE));
            dispatch(setLatBndSW(latBndSW));
            dispatch(setLngBndSW(lngBndSW));
            if (zoom < 11) {
                dispatch(setEndpoint({type:"cities"}));
                dispatch(setSearchLatNE(null));
                dispatch(setSearchLngNE(null));
                dispatch(setSearchLatSW(null));
                dispatch(setSearchLngSW(null));
            }
        });

        if (zoom < 11) {
            return;
        }

        //console.log(stateMap.searchLatNE)
        if (stateMap.searchLatNE !== null) {
            if (lat > stateMap.searchLatNE || lat < stateMap.searchLatSW || lng > stateMap.searchLngNE || lng < stateMap.searchLngSW) {
                if (zoom < 16) {
                    dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBndNE, lngbnd:lngBndNE, limit:1000}))
                } else {
                    dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBndNE, lngbnd:lngBndNE, limit:100000}))
                }
            } else {
                return;
            }
        } else {
            if (zoom < 16 && zoom >= 11) {
                dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBndNE, lngbnd:lngBndNE, limit:1000}))
            } else {
                dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, latbnd:latBndNE, lngbnd:lngBndNE, limit:100000}))
            }
        }
        batch(() => {
            dispatch(setSearchLatNE(latBndNE));
            dispatch(setSearchLngNE(lngBndNE));
            dispatch(setSearchLatSW(latBndSW));
            dispatch(setSearchLngSW(lngBndSW));
        });

    }

    // Custom map components
    const DrawBounds = () => {
        //const fillGreen = { color: 'green', fillColor: null, fillOpacity: 0 }
        if (stateMarker.markerType === "trees") {
            return <Rectangle attributes={{ stroke: 'red' }} bounds={[[stateMap.searchLatNE, stateMap.searchLngNE],[stateMap.searchLatSW, stateMap.searchLngSW]]} />
        } else {
            return null
        }

    }
    const GetMarkers = () => {
        const markerType = stateMarker.markerType;

        if (markerType === "cities"){
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
        } else if (markerType === "trees") {
            const zoom = stateMap.zoom;
            if (zoom <= 16 && zoom >= 11) {
                return (
                <MarkerClusterGroup>
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
            } else if (zoom > 16) {
                return stateMarker.trees.map((el, i) => (
                  <Circle center={[el.latitude, el.longitude]} radius={5} color={"green"}>
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
        }
    };

    // render component
    if (stateMarker.cities.length > 0) {
        return (
            <Map onMoveend={handleMoveend} preferCanvas={true} center={[stateMap.lat, stateMap.lng]} zoom={stateMap.zoom} scrollWheelZoom={true}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              <GetMarkers />
              <DrawBounds />
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