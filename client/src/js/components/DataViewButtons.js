import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, batch } from "react-redux";
import { setViewStatus } from "../features/markerSlice";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import { setDrawMode } from "../features/mapSlice";
import { NONE } from 'react-leaflet-freedraw';

const useStyles = makeStyles((theme) => ({
  dataViewMargin: {
    margin: theme.spacing(1),
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
    paddingRight: 10,
    paddingLeft: 10
  }
}));


const DataViewButtons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stateMarker = useSelector(state => state.marker);

    function setGlobal() {
        batch(() => {
            dispatch(setViewStatus("global"));
            dispatch(setDrawMode(NONE));
        });
    }

    function setCity() {
        batch(() => {
            dispatch(setViewStatus("city"));
            dispatch(setDrawMode(NONE));
        })
    }

    function handleChange(event) {
        if (!event.target.checked) {
            setCity()
            document.querySelectorAll('.leaflet-polygon').forEach(function(a){
                a.setAttribute("style","opacity:1");
            })
            document.querySelectorAll('.leaflet-marker-pane').forEach(function(a){
                a.setAttribute("style","opacity:1");
            });
        } else {
            document.querySelectorAll('.leaflet-pixi-overlay').forEach(function(a){
                a.remove()
            });
            document.querySelectorAll('.leaflet-marker-pane').forEach(function(a){
                a.setAttribute("style","opacity:0");
            });
            document.querySelectorAll('.leaflet-polygon').forEach(function(a){
                a.setAttribute("style","opacity:0");
            });
            setGlobal();
        }
    }

    return (
        <Paper className={classes.dataViewMargin} elevation={3}>
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>City</Grid>
                    <Grid item>
                        <Switch
                            checked={stateMarker.view_status === "global"}
                            onClick={handleChange}
                            color="primary"
                            name="checked"
                        />
                    </Grid>
                    <Grid item>Global</Grid>
                </Grid>
            </Typography>
        </Paper>
    );
}

export default DataViewButtons;