import React, {useRef, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, batch } from "react-redux";
import { Circle } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { renderToString } from 'react-dom/server';
import PixiOverlay from 'react-leaflet-pixi-overlay';
import Slider from '@material-ui/core/Slider';
import { setSimilarityCity1, setSimilarityCity2, setSimilarityState1, setSimilarityState2 } from "../features/analysisSlice";

import { useLeaflet } from "react-leaflet";
import Fab from '@material-ui/core/Fab';
import AdjustIcon from '@material-ui/icons/Adjust';
import { setEndpoint, getCity, clearCity, setScanStatus, setScanRadius, setScanCenter, setScanZoom, setViewStatus } from "../features/markerSlice";
import { setDrawMode, setSearch } from "../features/mapSlice";

const useStyles = makeStyles((theme) => ({
  scanMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(34),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));

const GetMarkers = () => {
    const stateMarker = useSelector(state => state.marker);
    const stateAnalysis = useSelector(state => state.analysis);
    const dispatch = useDispatch();
    const classes = useStyles();
    const { map } = useLeaflet();

    const [endpoint, setEndpoint] = useState();
    const [scan_lat, setScanLat] = useState();
    const [scan_lng, setScanLng] = useState();
    const [scan_radius, setScanRadius] = useState();

    function handleSimilarityClick(city, state) {
        if (stateAnalysis.similarityCity1 === "") {
            batch(() => {
                dispatch(setSimilarityCity1(city));
                dispatch(setSimilarityState1(state));
            });
        } else if (stateAnalysis.similarityCity2 === "") {
            batch(() => {
                dispatch(setSimilarityCity2(city));
                dispatch(setSimilarityState2(state));
            });
        }
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
            const zoom = map.getZoom();
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

            dispatch(getCity("/api/get/city?lat="+lat+"&lng="+lng+"&radius="+radius));
        }

    }

    if (stateMarker.view_status === "global"){
        console.log("Draw global");

        return stateMarker.global.map((el, i) => (
          <Marker
            key={i}
            position={[el.latitude, el.longitude]}
          >
            <Popup>
                <p>{el.city}, {el.state}</p>
                <p>Number of Trees: {el.total_species}</p>
                <p>Number of Species: {el.total_unique_species}</p>
                <Box pb={4} />
                <Slider
                    defaultValue={el.count_native}
                    step={null}
                    min={0}
                    max={el.total_species}
                    valueLabelDisplay="on"
                    marks={
                        [
                          {value: el.count_native,label: 'Native'},
                          {value: el.total_species, label: (el.total_species/1000).toFixed()+"K"}
                        ]
                    }
                />
                <Button onClick={() => handleSimilarityClick(el.city, el.state)} value={el.city} variant="outlined" size="small" color="primary">
                  Compare
                </Button>
            </Popup>
          </Marker>
        ));
    } else if (stateMarker.view_status === "city" && stateMarker.city.length == 0 )  {
        console.log("Draw PixiOverlay");
        return (
            <Fab onClick={handleclick} size="small" color="primary" aria-label="add" className={classes.scanMargin}>
                <AdjustIcon />
            </Fab>
        )
    } else if (stateMarker.view_status === "city" && stateMarker.city.length > 0) {
        return (
            <div>
                <PixiOverlay markers={stateMarker.city} />
                <Circle
                    weight={1}
                    opacity={0.5}
                    fill={false}
                    center={[scan_lat, scan_lng]}
                    radius={1.5*scan_radius} />
                <Fab onClick={handleclick} size="small" color="primary" aria-label="add" className={classes.scanMargin}>
                    <AdjustIcon />
                </Fab>
            </div>
        )
    } else {
        return null
    }
};

export default GetMarkers;