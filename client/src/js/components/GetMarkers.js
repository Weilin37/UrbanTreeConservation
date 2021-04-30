import React, { useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, batch } from "react-redux";
import { CircleMarker } from "react-leaflet";
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


    var percentColors = [
    { pct: 0.0, color: { r: 128, g: 128, b: 128 } },
    { pct: 1.0, color: { r: 0, g: 200, b: 0 } } ];

    var max_num_trees;
    var min_num_trees;

    for (var row of stateMarker.global) {
        var num_trees = parseInt(row.total_species)
        if (!max_num_trees || num_trees > max_num_trees) {max_num_trees = num_trees}
        if (!min_num_trees || num_trees < min_num_trees) {min_num_trees = num_trees}
    }

    var getColorForPercentage = function(pct) {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    }

    function handleSimilarityClick(greater_metro) {
        if (stateAnalysis.similarityGreaterMetro1 === "") {
            dispatch(setSimilarityGreaterMetro1(greater_metro));
        } else if (stateAnalysis.similarityGreaterMetro2 === "") {
            dispatch(setSimilarityGreaterMetro2(greater_metro));
        }
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

            batch(() => {
                dispatch(getCity("/api/get/city?lat="+lat+"&lng="+lng+"&radius="+radius));
                //dispatch(setLoading(true));
            });
        }
    }

    if (stateMarker.view_status === "global"){

        if (stateMarker.globalfilter === 'Native Trees') {
            return stateMarker.global.map((el, i) => (
              <CircleMarker
                key={i}
                center={[el.latitude, el.longitude]}
                radius={Math.log(parseInt(el.total_species))}
                fillColor={getColorForPercentage(parseInt(el.count_native)/parseInt(el.total_species))}
                fillOpacity={1}
                stroke={true}
                color={'black'}
                weight={1}
              >
                <Popup>
                    <p>{el.greater_metro}</p>
                    <p>Number of Trees: {el.total_species}</p>
                    <p>Number of Native Trees: {el.count_native}</p>
                    <p>Number of Species: {el.total_unique_species}</p>
                    <p>Percent Native: {100*(parseInt(el.count_native)/parseInt(el.total_species)).toFixed(3)+"%"}</p>
                    <Button onClick={() => handleSimilarityClick(el.greater_metro)} value={el.greater_metro} variant="outlined" size="small" color="primary">
                      Compare
                    </Button>
                </Popup>
              </CircleMarker>
            ));
        } else if (stateMarker.globalfilter === 'Unique Species') {
            return stateMarker.global.map((el, i) => (
              <CircleMarker
                key={i}
                center={[el.latitude, el.longitude]}
                radius={Math.log(parseInt(el.total_species))}
                fillColor={getColorForPercentage(parseInt(el.total_unique_species)/parseInt(el.total_species))}
                fillOpacity={1}
                stroke={true}
                color={'black'}
                weight={1}
              >
                <Popup>
                    <p>{el.greater_metro}</p>
                    <p>Number of Trees: {el.total_species}</p>
                    <p>Number of Native Trees: {el.count_native}</p>
                    <p>Number of Species: {el.total_unique_species}</p>
                    <p>Percent Native: {100*(parseInt(el.count_native)/parseInt(el.total_species)).toFixed(3)+"%"}</p>
                    <Button onClick={() => handleSimilarityClick(el.greater_metro)} value={el.greater_metro} variant="outlined" size="small" color="primary">
                      Compare
                    </Button>
                </Popup>
              </CircleMarker>
            ));
        }

    } else if (stateMarker.view_status === "city" && stateMarker.city.length === 0)  {
        return (
            <div>
                <Fab variant="extended" onClick={handleclick} size="small" color="primary" aria-label="add" className={classes.scanMargin}>
                    Scan Area for Trees
                </Fab>
            </div>
        )
    } else if (stateMarker.view_status === "city" && stateMarker.city.length > 0) {
        return (
            <div>
                <PixiOverlay markers={stateMarker.city} />
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