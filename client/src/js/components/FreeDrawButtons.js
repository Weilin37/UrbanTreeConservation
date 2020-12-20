import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { setDrawModeButton, setDrawMode } from "../features/mapSlice";
import { useDispatch, useSelector, batch } from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Freedraw, { ALL, EDIT, CREATE, DELETE, NONE } from 'react-leaflet-freedraw';

const useStyles = makeStyles((theme) => ({
  freedrawmargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    right: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const FreeDrawButtons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stateMap = useSelector(state => state.map);

    function handleSwitchClick(e) {
        batch(() => {
            dispatch(setDrawModeButton(!stateMap.draw_mode_button));
            if (stateMap.draw_mode_button == false) {
                dispatch(setDrawMode(CREATE));
            } else {
                dispatch(setDrawMode(EDIT));
            }
        });
    }

    function handleDeleteClick(e) {
        batch(() => {
            dispatch(setDrawModeButton(false));
            dispatch(setDrawMode(DELETE));
        });
    }

    return (
        <div>
            <Paper elevation={3} className={classes.freedrawmargin} >
                <Grid container>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                            <Switch checked={stateMap.draw_mode_button} onClick={handleSwitchClick} color="primary"/>
                        }
                        label="Free Draw"
                      />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleDeleteClick} variant="contained" color="secondary" startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />}>
                            Request
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default FreeDrawButtons;