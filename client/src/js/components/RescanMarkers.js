import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    top: theme.spacing(16),
    left: theme.spacing(1),
    position: 'fixed',
    zIndex: 1000,
  }
}));


const RescanMarkers = () => {
    // classes
    const classes = useStyles();

    return (
        <div>
            <Fab size="small" color="secondary" aria-label="add" className={classes.margin}>
                <AddIcon />
            </Fab>
        </div>
    );
}

export default RescanMarkers;