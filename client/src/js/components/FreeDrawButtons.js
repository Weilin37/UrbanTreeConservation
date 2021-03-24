import { makeStyles } from '@material-ui/core/styles';
import { setDrawMode } from "../features/mapSlice";
import { useDispatch, useSelector, batch } from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { ALL, DELETE, NONE } from 'react-leaflet-freedraw';
import { useLeaflet } from "react-leaflet";
import { setScanStatus } from "../features/markerSlice";

const useStyles = makeStyles((theme) => ({
  freeDrawMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(16),
    left: theme.spacing(7),
    position: 'fixed',
    zIndex: 1000,
  },
  selectMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(22),
    left: theme.spacing(7),
    position: 'fixed',
    zIndex: 1000,
  },
  deleteMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(28),
    left: theme.spacing(7),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const FreeDrawButtons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stateMarker = useSelector(state => state.marker);
    const { map } = useLeaflet();

    function handleSwitchClick(e) {
        if (map.getZoom() < stateMarker.cityZoom) {
            map.setZoom(stateMarker.cityZoom);
        }
        dispatch(setDrawMode((ALL)));
        batch(() => {
            //dispatch(setViewStatus("freedraw"));
            dispatch(setDrawMode((ALL ^ DELETE)));
        });
    }

    function getMarkers(e) {
        if (stateMarker.endpoint.length > 0) {
            batch(() => {
                dispatch(setScanStatus("freedraw scanning"));
                dispatch(setDrawMode(NONE));
            });
        }
    }

    function handleDeleteClick(e) {
        dispatch(setDrawMode(DELETE));
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
        </div>
    );

}

export default FreeDrawButtons;