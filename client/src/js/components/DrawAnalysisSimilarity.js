import { useSelector } from "react-redux";
import { Circle } from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { setSimilarityCity1, setSimilarityCity2, getSimilarity } from "../features/analysisSlice";

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
const DrawAnalysisSimilarity = () => {
    const stateMarker = useSelector(state => state.marker);
    const stateAnalysis = useSelector(state => state.analysis);
    const classes = useStyles();


    if (stateMarker.view_status === "global" && stateAnalysis.similarityData.length > 0) {

        return(
            <Box className={classes.analysisMargin}>
            <Paper>
                <h5>Total: </h5>
                <h5>Native: </h5>
                <h5>Non-Native: </h5>
            </Paper>
            </Box>
        )
    } else {
        return null
    }
}

export default DrawAnalysisSimilarity;