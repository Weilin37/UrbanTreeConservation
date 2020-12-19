import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AdjustIcon from '@material-ui/icons/Adjust';
import { useDispatch, batch } from "react-redux";
import { useLeaflet } from "react-leaflet";
import { setSearch } from "../features/mapSlice";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { setEndpoint, clearTrees, setScanStatus, setScanRadius, setScanCenter, setScanZoom } from "../features/markerSlice";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    top: theme.spacing(16),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#11cb5f',
    }
  }
});


const RescanMarkers = () => {
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
        const center = map.getCenter();
        const zoom = map.getZoom();
        const lat = center.lat;
        const lng = center.lng;
        const bounds = map.getBounds();
        const latNE = bounds['_northEast'].lat
        const lngNE = bounds['_northEast'].lng
        const radius = Math.round(0.5*getDistance([latNE, lngNE],[lat, lng]));

        batch(() => {
            dispatch(clearTrees());
            dispatch(setScanRadius(radius));
            dispatch(setScanCenter({lat:lat, lng:lng}));
            dispatch(setScanZoom(zoom));
            dispatch(setSearch("waiting"));
            dispatch(setEndpoint({type:"trees", lat:lat, lng:lng, radius:radius, limit:1000}));
            dispatch(setScanStatus("scanning"));
        });
    }

    return (
        <ThemeProvider theme={theme}>
            <Fab onClick={handleclick} size="small" color="secondary" aria-label="add" className={classes.margin}>
                <AdjustIcon />
            </Fab>
        </ThemeProvider>
    );
}

export default RescanMarkers;