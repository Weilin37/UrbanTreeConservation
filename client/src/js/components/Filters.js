import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";
import { setGlobalFilter, setCityFilter } from "../features/markerSlice";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    filter: {
        margin: theme.spacing(1),
        bottom: theme.spacing(7),
        left: theme.spacing(1),
        position: 'fixed',
        backgroundColor: 'white',
        zIndex: 1000,
        minWidth:150
    }
}));


const Filters = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stateMarker = useSelector(state => state.marker);

    function handleGlobalChange(event) {
        dispatch(setGlobalFilter(event.target.value));
    }

    function handleCityChange(event) {
        dispatch(setCityFilter(event.target.value));
    }

    if (stateMarker.view_status === "global")  {
        return (
            <FormControl variant="outlined" className={classes.filter}>
                <InputLabel id="filter-label">Select Filter Type</InputLabel>
                <Select
                    labelId="filter-label"
                    id="filter"
                    value={stateMarker.globalfilter}
                    onChange={handleGlobalChange}
                    label="Select Filter Type"
                >
                    <MenuItem value="Native Trees">Native Trees</MenuItem>
                    <MenuItem value="Unique Species">Unique Species</MenuItem>
                    <MenuItem value="Number Trees">Number Trees</MenuItem>
                </Select>
            </FormControl>
        );
    } else if (stateMarker.view_status === "city") {
        return (
            <FormControl variant="outlined" className={classes.filter}>
                <InputLabel id="filter-label">Select Filter Type</InputLabel>
                <Select
                    labelId="filter-label"
                    id="filter"
                    value={stateMarker.cityfilter}
                    onChange={handleCityChange}
                    label="Select Filter Type"
                >
                    <MenuItem value="Native Trees">Native Trees</MenuItem>
                    <MenuItem value="Top Species">Top Species</MenuItem>
                </Select>
            </FormControl>
        );
    }
}

export default Filters;