import React, {useRef} from "react";
import Freedraw from 'react-leaflet-freedraw';
import "../../css/freedraw.css";
import { useSelector, useDispatch } from "react-redux";
import { setEndpoint } from "../features/markerSlice";
import { setDrawMode } from "../features/mapSlice";
import { useLeaflet } from "react-leaflet";

// Custom map components
const FreeDrawCustom = () => {
    const stateMap = useSelector(state => state.map);
    const dispatch = useDispatch();
    const freeDrawRef = useRef(null);

    const { map } = useLeaflet();
    const zoom = map.getZoom();
    const center = map.getCenter();
    const lat = center.lat;
    const lng = center.lng;
    const bounds = map.getBounds();
    const latNE = bounds['_northEast'].lat
    const lngNE = bounds['_northEast'].lng
    const radius = Math.round(getDistance([latNE, lngNE],[lat, lng]));

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

    // Listen for any markers added, removed or edited, and then output the lat lng boundaries.
    function handleOnMarkers(e) {
        if (e.latLngs.length > 0){
            const coordinates = e.latLngs[0];
            console.log(coordinates);
            let polygonArray = [];
            for (var i = 0; i<coordinates.length; i++) {
                let lng = coordinates[i].lng;
                let lat = coordinates[i].lat;
                let string = lng+' '+lat;
                polygonArray.push(string);
            }
            polygonArray.push(coordinates[0].lng+' '+coordinates[0].lat);

            let polygonString = polygonArray.join(',');
            dispatch(setEndpoint({type:"freedraw", polygons:polygonString, lat:lat, lng:lng, radius:radius}));
        }
    };

    function handleModeChange(e) {
        console.log('mode changed', e.mode);
        if (e.mode === 10 && stateMap.draw_mode !== 10) {
            dispatch(setDrawMode(10));
        }
    };

    return (
        <Freedraw
          mode={stateMap.draw_mode}
          onMarkers={handleOnMarkers}
          onModeChange={handleModeChange}
          simplifyFactor={2}
          ref={freeDrawRef}
          leaveModeAfterCreate={true}
        />
    )

}

export default FreeDrawCustom;