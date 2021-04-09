import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, batch } from "react-redux";
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import DrawAnalysisSimilarity from "./DrawAnalysisSimilarity";
import { getSimilarity, getSimilarityHistogram, setSimilarityGreaterMetro1, setSimilarityGreaterMetro2 } from "../features/analysisSlice";
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

    function handleDelete(e) {
        if (e === 1) {
            dispatch(setSimilarityGreaterMetro1(""));
        } else if (e === 2) {
            dispatch(setSimilarityGreaterMetro2(""));
        }
    }

    function handleSimilarityClick() {
        if (stateAnalysis.similarityGreaterMetro1 !== "" && stateAnalysis.similarityGreaterMetro2 !== "") {
            let endpoint = '/api/get/citysimilarity?greater_metro1='+stateAnalysis.similarityGreaterMetro1+'&greater_metro2='+stateAnalysis.similarityGreaterMetro2;
            batch(() => {
                dispatch(getSimilarity(endpoint));
                dispatch(getSimilarityHistogram());
            });
        }
    }

    if (stateMarker.view_status === "global" && (stateAnalysis.similarityGreaterMetro1 !== "" || stateAnalysis.similarityGreaterMetro2 !== "")) {

        if (stateAnalysis.similarityGreaterMetro1 !== "" && stateAnalysis.similarityGreaterMetro2 === "") {
            return (
                <Paper className={classes.chipMargin}>
                    <DrawAnalysisSimilarity />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityGreaterMetro1}
                      onDelete={() => handleDelete(1)}
                    />
                    <Button size="small" variant="outlined" onClick={handleSimilarityClick} color="primary">calculate</Button>
                </Paper>
            );
        } else if (stateAnalysis.similarityGreaterMetro2 !== "" && stateAnalysis.similarityGreaterMetro1 === "") {
            return (
                <Paper className={classes.chipMargin}>
                    <DrawAnalysisSimilarity />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityGreaterMetro2}
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
                      label={stateAnalysis.similarityGreaterMetro1}
                      onDelete={() => handleDelete(1)}
                    />
                    <Chip
                      size="small"
                      label={stateAnalysis.similarityGreaterMetro2}
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