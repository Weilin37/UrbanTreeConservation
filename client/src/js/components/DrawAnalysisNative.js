import { useSelector } from "react-redux";
import { Circle } from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  analysisMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    right: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
    width: 250,
    padding: theme.spacing(1),
  }
}));

// Custom map components
const DrawAnalysisNative = () => {
    const stateMarker = useSelector(state => state.marker);
    const classes = useStyles();

    if ((stateMarker.view_status === "freedraw" && stateMarker.freedraw.length > 0) || (stateMarker.view_status === "city" && stateMarker.city.length > 0)) {
        let data;
        if (stateMarker.view_status === "freedraw" && stateMarker.freedraw.length > 0) {
            data = stateMarker.freedraw;
        } else if (stateMarker.view_status === "city" && stateMarker.city.length > 0) {
            data = stateMarker.city;
        }
        const total = data.length;

        const countNonNative = data.reduce((cnt, row) => {
            if (row.native === "FALSE") {
                return cnt = cnt+1;
            } else {
                return cnt;
            }
        }, 0);

        const countNative = data.reduce((cnt, row) => {
            if (row.native === "TRUE") {
                return cnt = cnt+1;
            } else {
                return cnt;
            }
        }, 0);

        const marks = [
          {value: countNative,label: 'Native'}
        ];

        return(
            <Paper className={classes.analysisMargin}>
                <Grid container justify="center" alignItems="center" spacing={2}>
                    <Grid item align="center" xs={10} >
                        <Typography gutterBottom>Native Distribution</Typography>
                        <Box pb={5} />
                        <Slider
                            defaultValue={countNative}
                            valueLabelDisplay="on"
                            step={null}
                            min={0}
                            max={total}
                            marks={marks}
                        />
                    </Grid>
                </Grid>
            </Paper>
        )
    } else {
        return null
    }
}

export default DrawAnalysisNative;