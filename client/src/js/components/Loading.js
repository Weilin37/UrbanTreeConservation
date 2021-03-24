import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex:1000
  }
}));

const Loading = () => {
    // classes
    const classes = useStyles();
    const stateMarker = useSelector(state => state.marker);

    return (
        <Backdrop open={stateMarker.loading} className={classes.backdrop}>
            <CircularProgress color="inherit" size={120} />
        </Backdrop>
    );
}

export default Loading;