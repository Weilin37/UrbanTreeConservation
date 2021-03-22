import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AdjustIcon from '@material-ui/icons/Adjust';
import { useDispatch, useSelector, batch } from "react-redux";
import { useLeaflet } from "react-leaflet";
import { setEndpoint, clearCity, setScanStatus, setScanRadius, setScanCenter, setScanZoom, setViewStatus } from "../features/markerSlice";
import { setSearch } from "../features/mapSlice";

const useStyles = makeStyles((theme) => ({
  scanMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(34),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const RescanMarkers = () => {
    const stateMarker = useSelector(state => state.marker);
    const dispatch = useDispatch();
    // classes
    const classes = useStyles();
    const { map } = useLeaflet();

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

            batch(() => {
                dispatch(clearCity());
                dispatch(setScanRadius(radius));
                dispatch(setScanCenter({lat:lat, lng:lng}));
                dispatch(setSearch("waiting"));
                if (zoom < stateMarker.cityZoom) {
                    dispatch(setScanZoom(stateMarker.cityZoom));
                } else {
                    dispatch(setScanZoom(zoom));
                }
                dispatch(setViewStatus("city"))
                dispatch(setEndpoint({type:"city", lat:lat, lng:lng, radius:radius, limit:1000}));
                dispatch(setScanStatus("scanning"));
            });
        }

    }

    return (
        <div>
            <Fab onClick={handleclick} size="small" color="primary" aria-label="add" className={classes.scanMargin}>
                <AdjustIcon />
            </Fab>
        </div>
    );
}

export default RescanMarkers;