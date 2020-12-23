import { useSelector } from "react-redux";
import { Circle } from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  analysisMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    right: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
    width: 150,
    height:150
  }
}));

// Custom map components
const DrawAnalysisNative = () => {
    const stateMarker = useSelector(state => state.marker);
    const classes = useStyles();

    /*
    city: "Seattle"
    condition: " "
    diameter_breast_height_cm: "71.12"
    geom: "0101000020E610000018A1E93672945EC09E2B63A661CF4740"
    latitude: 47.62016754
    longitude: -122.31947109999999
    native: "FALSE"
    scientific_name: "Tilia cordata"
    state: "Washington"
    */



    if (stateMarker.view_status === "freedraw" && stateMarker.freedraw.length > 0) {
        const total = stateMarker.freedraw.length;

        const countNonNative = stateMarker.freedraw.reduce((cnt, row) => {
            if (row.native === "FALSE") {
                return cnt = cnt+1;
            } else {
                return cnt;
            }
        }, 0);

        const countNative = stateMarker.freedraw.reduce((cnt, row) => {
            if (row.native === "TRUE") {
                return cnt = cnt+1;
            } else {
                return cnt;
            }
        }, 0);

        console.log(total);
        console.log(countNonNative);
        console.log(countNative);

        return(
            <Box className={classes.analysisMargin}>
            <Paper>
                <h5>Total: {total}</h5>
                <h5>Native: {countNative}</h5>
                <h5>Non-Native: {countNonNative}</h5>
            </Paper>
            </Box>
        )
    } else {
        return null
    }
}

export default DrawAnalysisNative;