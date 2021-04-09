import React, { useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, batch } from "react-redux";
import { Circle } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import Button from '@material-ui/core/Button';
import PixiOverlay from 'react-leaflet-pixi-overlay';
import { setSimilarityGreaterMetro1, setSimilarityGreaterMetro2 } from "../features/analysisSlice";

import { useLeaflet } from "react-leaflet";
import Fab from '@material-ui/core/Fab';
import { getCity } from "../features/markerSlice";

const useStyles = makeStyles((theme) => ({
  scanMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    left: theme.spacing(7),
    position: 'fixed',
    zIndex: 1000,
  },
  backdrop: {
    zIndex:1000
  }
}));

const GetMarkers = () => {
    const stateMarker = useSelector(state => state.marker);
    const stateAnalysis = useSelector(state => state.analysis);
    const dispatch = useDispatch();
    const classes = useStyles();
    const { map } = useLeaflet();

    const [scan_lat, setScanLat] = useState(0);
    const [scan_lng, setScanLng] = useState(0);
    const [scan_radius, setScanRadius] = useState(0);

    function handleSimilarityClick(greater_metro) {
        /*if (stateAnalysis.similarityGreaterMetro1 === "") {
            dispatch(setSimilarityGreaterMetro1(greater_metro));
        } else if (stateAnalysis.similarityGreaterMetro2 === "") {
            dispatch(setSimilarityGreaterMetro2(greater_metro));
        }*/
        return
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

    function handleclick(e) {
        if (stateMarker.view_status === "city" || stateMarker.view_status === "global") {
            if (map.getZoom() < stateMarker.cityZoom) {
                map.setZoom(stateMarker.cityZoom);
            }
            const center = map.getCenter();
            const lat = center.lat;
            const lng = center.lng;
            const bounds = map.getBounds();
            const latNE = bounds['_northEast'].lat
            const lngNE = bounds['_northEast'].lng
            const radius = Math.round(0.5*getDistance([latNE, lngNE],[lat, lng]));
            setScanLat(lat);
            setScanLng(lng);
            setScanRadius(radius);

            batch(() => {
                dispatch(getCity("/api/get/city?lat="+lat+"&lng="+lng+"&radius="+radius));
                //dispatch(setLoading(true));
            });
        }

    }

    if (stateMarker.view_status === "global"){

        return stateMarker.global.map((el, i) => (
          <Marker
            key={i}
            position={[el.latitude, el.longitude]}
          >
            <Popup>
                <p>{el.greater_metro}</p>
                <p>Number of Trees: {el.total_species}</p>
                <p>Number of Native Trees: {el.count_native}</p>
                <p>Number of Species: {el.total_unique_species}</p>
                <p>Percent Native: {100*(el.count_native/el.total_species).toFixed()+"%"}</p>
                <Button onClick={() => handleSimilarityClick(el.greater_metro)} value={el.greater_metro} variant="outlined" size="small" color="primary">
                  Compare
                </Button>
            </Popup>
          </Marker>
        ));
    } else if (stateMarker.view_status === "city" && stateMarker.city.length === 0)  {
        return (
            <div>
                <Fab variant="extended" onClick={handleclick} size="small" color="primary" aria-label="add" className={classes.scanMargin}>
                    Scan Area for Trees
                </Fab>
            </div>
        )
    } else if (stateMarker.view_status === "city" && stateMarker.city.length > 0) {
        console.log("Draw PixiOverlay");
        return (
            <div>
                <PixiOverlay markers={stateMarker.city} />
                <Circle
                    weight={1}
                    opacity={0.5}
                    fill={false}
                    center={[scan_lat, scan_lng]}
                    radius={1.5*scan_radius} />
                <Fab variant="extended" onClick={handleclick} size="small" color="primary" aria-label="add" className={classes.scanMargin}>
                    Scan Area for Trees
                </Fab>
            </div>
        )
    } else {
        return null
    }
};

export default GetMarkers;