import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { setDrawModeButton } from "../features/mapSlice";
import { useDispatch, useSelector, batch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  margin: {
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

    function handleChange(e) {
        dispatch(setDrawModeButton(!stateMap.draw_mode_button));
    }

    return (
        <div>
            <Paper elevation={3} className={classes.margin} >
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={stateMap.draw_mode_button}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Free Draw"
                  />
                </FormGroup>
            </Paper>
        </div>
    );
}

export default FreeDrawButtons;