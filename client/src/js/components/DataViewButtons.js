import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, batch } from "react-redux";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { setViewStatus } from "../features/markerSlice";

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

    function setGlobal() {
        dispatch(setViewStatus("global"));
    }

    function setCity() {
        dispatch(setViewStatus("city"));
    }

    function setFreeDraw() {
        dispatch(setViewStatus("freedraw"));
    }

    return (
        <ButtonGroup className={classes.dataViewMargin} variant="contained" color="primary" aria-label="contained primary button group">
            <Button onClick={setGlobal}>Global</Button>
            <Button onClick={setCity}>City</Button>
            <Button onClick={setFreeDraw}>FreeDraw</Button>
        </ButtonGroup>
    );
}

export default DataViewButtons;