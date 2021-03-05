import React, {useRef, useState} from "react";
import Freedraw from 'react-leaflet-freedraw';
import "../../css/freedraw.css";
import { useSelector, useDispatch } from "react-redux";
import { clearFreeDraw, setScanStatus, getFreeDraw } from "../features/markerSlice";
import { useLeaflet } from "react-leaflet";

import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { ALL, DELETE, NONE } from 'react-leaflet-freedraw';

const useStyles = makeStyles((theme) => ({
  freeDrawMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(16),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  },
  selectMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(22),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  },
  deleteMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(28),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));

// Custom map components
const FreeDrawCustom = () => {
    const [drawMode, setDrawMode] = useState(NONE);
    const [endpoint, setEndpoint] = useState();

    const classes = useStyles();
    const dispatch = useDispatch();
    const { map } = useLeaflet();

    const freeDrawRef = useRef(null);

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
            //dispatch(setEndpoint({type:"freedraw", polygons:polygonString, lat:lat, lng:lng, radius:radius}));
            setEndpoint("/api/get/freedraw?lat="+lat+"&lng="+lng+"&radius="+radius+"&polygons="+polygonString);
        }
        else if (e.latLngs.length === 0) {
            console.log("clearing free draw");
            dispatch(clearFreeDraw());
        }
    };

    function handleModeChange(e) {
        console.log('mode changed', e.mode);
        if (e.mode === 10 && drawMode !== 10) {
            setDrawMode(10);
        }
    };

    function handleSwitchClick(e) {
        setDrawMode(ALL ^ DELETE);
    }

    function getMarkers(e) {
        if (endpoint.length > 0) {
            //dispatch(setScanStatus("freedraw scanning"));
            dispatch(getFreeDraw(endpoint));
            setDrawMode(NONE);
        }
    }

    function handleDeleteClick(e) {
        setDrawMode(DELETE);
    }

    return (
        <div>
            <Fab onClick={handleSwitchClick} className={classes.freeDrawMargin} size="small" color="primary" aria-label="add">
                <BorderColorIcon />
            </Fab>
            <Fab onClick={getMarkers} className={classes.selectMargin} size="small" color="primary" aria-label="add">
                <FilterCenterFocusIcon />
            </Fab>
            <Fab onClick={handleDeleteClick} className={classes.deleteMargin} size="small" color="secondary" aria-label="add">
                <DeleteIcon />
            </Fab>
            <Freedraw
              mode={drawMode}
              onMarkers={handleOnMarkers}
              onModeChange={handleModeChange}
              simplifyFactor={2}
              ref={freeDrawRef}
              leaveModeAfterCreate={true}
              maximumPolygons={1}
            />
        </div>
    )

}

export default FreeDrawCustom;