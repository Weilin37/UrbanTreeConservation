import { makeStyles } from '@material-ui/core/styles';
import { setDrawMode } from "../features/mapSlice";
import { useDispatch, useSelector, batch } from "react-redux";
import Fab from '@material-ui/core/Fab';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { setViewStatus } from "../features/markerSlice";
import { useLeaflet } from "react-leaflet";
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import DrawAnalysisSimilarity from "./DrawAnalysisSimilarity";
import { getSimilarity, getSimilarityHistogram, setSimilarityCity1, setSimilarityCity2, setSimilarityState1, setSimilarityState2 } from "../features/analysisSlice";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  chipMargin: {
    margin: theme.spacing(1),
    top: theme.spacing(7),
    right: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const DrawSimilarityButtons = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stateMarker = useSelector(state => state.marker);
    const stateAnalysis = useSelector(state => state.analysis);
    const { map } = useLeaflet();

    function handleDelete(e) {
        if (e === 1) {
            batch(() => {
                dispatch(setSimilarityCity1(""));
                dispatch(setSimilarityState1(""));
            });
        } else if (e === 2) {
            batch(() => {
                dispatch(setSimilarityCity2(""));
                dispatch(setSimilarityState2(""));
            });
        }
    }

    function handleSimilarityClick() {
        if (stateAnalysis.similarityCity1 !== "" && stateAnalysis.similarityCity2 !== "") {
            let endpoint = '/api/get/citysimilarity?city1='+stateAnalysis.similarityCity1+'&city2='+stateAnalysis.similarityCity2+
            '&state1='+stateAnalysis.similarityState1+'&state2='+stateAnalysis.similarityState2;
            batch(() => {
                dispatch(getSimilarity(endpoint));
                dispatch(getSimilarityHistogram());
            });
        }
    }

    if (stateMarker.view_status === "global" && (stateAnalysis.similarityCity1 !== "" || stateAnalysis.similarityCity2 !== "")) {

        if (stateAnalysis.similarityCity1 !== "" && stateAnalysis.similarityCity2 === "") {
            return (
                <Paper className={classes.chipMargin}>
                    <DrawAnalysisSimilarity />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityCity1+", "+stateAnalysis.similarityState1}
                      onDelete={() => handleDelete(1)}
                    />
                    <Button size="small" variant="outlined" onClick={handleSimilarityClick} color="primary">calculate</Button>
                </Paper>
            );
        } else if (stateAnalysis.similarityCity2 !== "" && stateAnalysis.similarityCity1 === "") {
            return (
                <Paper className={classes.chipMargin}>
                    <DrawAnalysisSimilarity />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityCity2+", "+stateAnalysis.similarityState2}
                      onDelete={() => handleDelete(2)}
                    />
                    <Button size="small" variant="outlined" onClick={handleSimilarityClick} color="primary">calculate</Button>
                </Paper>
            );
        } else {
            return (
                <Paper className={classes.chipMargin}>
                    <DrawAnalysisSimilarity />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityCity1+", "+stateAnalysis.similarityState1}
                      onDelete={() => handleDelete(1)}
                    />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityCity2+", "+stateAnalysis.similarityState2}
                      onDelete={() => handleDelete(2)}
                    />
                    <Button size="small" variant="outlined" onClick={handleSimilarityClick} color="primary">calculate</Button>
                </Paper>
            );
        }

    } else {
        return null
    }
}

export default DrawSimilarityButtons;