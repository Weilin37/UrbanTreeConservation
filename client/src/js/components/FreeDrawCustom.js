import React, {useRef, useState} from "react";
import Freedraw from 'react-leaflet-freedraw';
import "../../css/freedraw.css";
import { useSelector, useDispatch } from "react-redux";
import { clearFreeDraw, getFreeDraw } from "../features/markerSlice";
import { useLeaflet } from "react-leaflet";

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { ALL, DELETE, NONE } from 'react-leaflet-freedraw';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  freeDrawMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    left: theme.spacing(31),
    position: 'fixed',
    zIndex: 1000,
  },
  selectMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    left: theme.spacing(45),
    position: 'fixed',
    zIndex: 1000,
  },
  deleteMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    left: theme.spacing(68),
    position: 'fixed',
    zIndex: 1000,
  },
  backdrop: {
    zIndex:1000
  }
}));

// Custom map components
const FreeDrawCustom = () => {
    const [drawMode, setDrawMode] = useState(NONE);
    const [endpoint, setEndpoint] = useState('');
    const [analyzeClicked, setAnalyzeClicked] = useState(false);
    const [deleteClicked, setDeleteClicked] = useState(false);

    const classes = useStyles();
    const dispatch = useDispatch();
    const { map } = useLeaflet();

    const freeDrawRef = useRef(null);
    const stateMarker = useSelector(state => state.marker);

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
        try {
            if (e.latLngs.length > 0){
                const coordinates = e.latLngs[0];
                let polygonArray = [];
                for (var i = 0; i<coordinates.length; i++) {
                    let lng = coordinates[i].lng;
                    let lat = coordinates[i].lat;
                    let string = lng+' '+lat;
                    polygonArray.push(string);
                }
                polygonArray.push(coordinates[0].lng+' '+coordinates[0].lat);

                let polygonString = polygonArray.join(',');
                setEndpoint("/api/get/freedraw?lat="+lat+"&lng="+lng+"&radius="+radius+"&polygons="+polygonString);
            }
            else if (e.latLngs.length === 0) {
                console.log("clearing free draw");
                dispatch(clearFreeDraw());
            }
        } catch {
            return
        }
    };

    function handleModeChange(e) {
        console.log('mode changed', e.mode);
        if (e.mode === 10 && drawMode !== 10) {
            setDrawMode(10);
        }
    };

    function handleSwitchClick(e) {
        console.log(freeDrawRef);
        map.eachLayer(function(layer) {
            console.log(layer.options.maximumPolygons);
            console.log(layer.options.icon);
        });
        setDrawMode(ALL ^ DELETE);
    }

    function getMarkers(e) {
        console.log(endpoint.length)
        if (endpoint.length > 0) {
            dispatch(getFreeDraw(endpoint));
            setDrawMode(NONE);
        } else {
            setAnalyzeClicked(true);
        }
    }

    function handleDeleteClick(e) {
        var polygon = document.getElementsByClassName('leaflet-polygon');
        setDeleteClicked(true);
        for (var i = 0; i < polygon.length; i++) {
            polygon[i].setAttribute('style','pointer-events: auto !important');
        }
        setDrawMode(DELETE);
    }

    const handleAnalyzeClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAnalyzeClicked(false);
    };

    const handleDeleteClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setDeleteClicked(false);
    };

    if (stateMarker.view_status === "city")  {
        return (
            <div>
                <Fab variant="extended" onClick={handleSwitchClick} className={classes.freeDrawMargin} size="small" color="primary" aria-label="add">
                    Draw Area
                </Fab>
                <Fab variant="extended" onClick={getMarkers} className={classes.selectMargin} size="small" color="primary" aria-label="add">
                    Analyze Draw Area
                </Fab>
                <Fab variant="extended" onClick={handleDeleteClick} className={classes.deleteMargin} size="small" color="secondary" aria-label="add">
                    Delete Draw Area
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
                <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    onClose={handleAnalyzeClose}
                    open={analyzeClicked}
                    autoHideDuration={6000}
                    message="Please Use Draw Area First"
                    action={
                      <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleAnalyzeClose}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </React.Fragment>
                    }
                />
                <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    onClose={handleDeleteClose}
                    open={deleteClicked}
                    autoHideDuration={3000}
                    message="Now Click Area to Delete it"
                    action={
                      <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleDeleteClose}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </React.Fragment>
                    }
                />
            </div>
        )
    } else {
        return null
    }

}

export default FreeDrawCustom;