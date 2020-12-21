import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, batch } from "react-redux";
import { setViewStatus } from "../features/markerSlice";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import { useLeaflet } from "react-leaflet";
import { setDrawMode } from "../features/mapSlice";
import { NONE } from 'react-leaflet-freedraw';

const useStyles = makeStyles((theme) => ({
  dataViewMargin: {
    margin: theme.spacing(1),
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const DataViewButtons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stateMarker = useSelector(state => state.marker);
    const { map } = useLeaflet();

    function setGlobal() {
        if (map.getZoom() >= stateMarker.cityZoom) {
            map.setZoom(3);
        }
        batch(() => {
            dispatch(setViewStatus("global"));
            dispatch(setDrawMode(NONE));
        });
    }

    function setCity() {
        if (map.getZoom() < stateMarker.cityZoom) {
            map.setZoom(stateMarker.cityZoom);
        }
        batch(() => {
            dispatch(setViewStatus("city"));
            dispatch(setDrawMode(NONE));
        })
    }

    function setFreeDraw() {
        if (map.getZoom() < stateMarker.cityZoom) {
            map.setZoom(stateMarker.cityZoom);
        }
        dispatch(setViewStatus("freedraw"));
    }

    return (
        <Paper className={classes.dataViewMargin} elevation={3}>
        <RadioGroup row aria-label="position" name="position" defaultValue="top">
            <FormControlLabel
              value="top"
              control={<Radio color="primary" />}
              label="Global"
              checked={stateMarker.view_status === "global"}
              labelPlacement="top"
              onClick={setGlobal}
            />
            <FormControlLabel
              value="start"
              control={<Radio color="primary" />}
              label="City"
              checked={stateMarker.view_status === "city"}
              labelPlacement="top"
              onClick={setCity}
            />
            <FormControlLabel
              value="bottom"
              control={<Radio color="primary" />}
              label="Free Draw"
              checked={stateMarker.view_status === "freedraw"}
              labelPlacement="top"
              onClick={setFreeDraw}
            />
        </RadioGroup>
        </Paper>
    );
}

export default DataViewButtons;