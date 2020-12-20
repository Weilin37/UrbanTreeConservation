import { makeStyles } from '@material-ui/core/styles';
import { setDrawMode } from "../features/mapSlice";
import { useDispatch, batch } from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { ALL, DELETE } from 'react-leaflet-freedraw';
import { setViewStatus } from "../features/markerSlice";

const useStyles = makeStyles((theme) => ({
  freeDrawMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(16),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  },
  deleteMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(22),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const FreeDrawButtons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    function handleSwitchClick(e) {
        dispatch(setDrawMode((ALL)));
        batch(() => {
            dispatch(setViewStatus("freedraw"));
            dispatch(setDrawMode((ALL ^ DELETE)));
        });
    }

    function handleDeleteClick(e) {
        dispatch(setDrawMode(DELETE));
    }

    return (
        <div>
            <Fab onClick={handleSwitchClick} className={classes.freeDrawMargin} size="small" color="primary" aria-label="add">
                <BorderColorIcon />
            </Fab>
            <Fab onClick={handleDeleteClick} className={classes.deleteMargin} size="small" color="secondary" aria-label="add">
                <DeleteIcon />
            </Fab>
        </div>
    );
}

export default FreeDrawButtons;