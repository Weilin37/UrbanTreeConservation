import { useSelector } from "react-redux";
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
    let freedata;
    let freetotal;
    let countFreeNonNative;
    let countFreeNative;
    let freespeciescount = [];

    let citydata;
    let citytotal;
    let countCityNonNative;
    let countCityNative;
    let cityspeciescount = [];

    let citymarks;
    let freemarks;

    if ((stateMarker.freedraw.length > 0) || (stateMarker.view_status === "city" && stateMarker.city.length > 0)) {

        //get native data
        if (stateMarker.freedraw.length > 0) {
            freedata = stateMarker.freedraw;
            freetotal = freedata.length;
            let tmpfreespeciescount = freedata.reduce((p,c) => {
                var species = c.scientific_name;
                if (!p.hasOwnProperty(species)) {
                    p[species] = 0;
                }
                p[species]++;
                return p;
            }, {});

            for (var species in tmpfreespeciescount) {
                freespeciescount.push([species, tmpfreespeciescount[species]])
            }

            freespeciescount.sort(function(a,b) {
                return b[1] - a[1];
            });

            freespeciescount = freespeciescount.slice(0,5);


            countFreeNonNative = freedata.reduce((cnt, row) => {
                if (row.native === "FALSE") {
                    return cnt = cnt+1;
                } else {
                    return cnt;
                }
            }, 0);

            countFreeNative = freedata.reduce((cnt, row) => {
                if (row.native === "TRUE") {
                    return cnt = cnt+1;
                } else {
                    return cnt;
                }
            }, 0);
        }

        if (stateMarker.city.length > 0) {
            citydata = stateMarker.global.filter(function (el) {
              return el.city === stateMarker.city[0].city && el.state === stateMarker.city[0].state
            });

            let tmpcityspeciescount = stateMarker.city.reduce((p,c) => {
                var species = c.scientific_name;
                if (!p.hasOwnProperty(species)) {
                    p[species] = 0;
                }
                p[species]++;
                return p;
            }, {});

            for (var species in tmpcityspeciescount) {
                cityspeciescount.push([species, tmpcityspeciescount[species]])
            }

            cityspeciescount.sort(function(a,b) {
                return b[1] - a[1];
            });

            cityspeciescount = cityspeciescount.slice(0,5);

            citytotal = citydata[0].total_species;
            countCityNonNative = citydata[0].count_non_native;
            countCityNative = citydata[0].count_native;
        }

        citymarks = [
          {value: countCityNative,label: 'Native'},
          {value: citytotal,label: (citytotal/1000).toFixed()+"K"},
        ];

        freemarks = [
          {value: countFreeNative,label: 'Native'},
          {value: freetotal,label: freetotal},
        ];

    }

    if (stateMarker.freedraw.length > 0 && stateMarker.city.length > 0) {
         return(
            <Paper className={classes.analysisMargin}>
                <Grid container justify="center" alignItems="center" spacing={2}>
                    <Grid item align="center" xs={10} >
                        <Typography gutterBottom>City Native Distribution</Typography>
                        <Box pb={5} />
                        <Slider
                            defaultValue={countCityNative}
                            valueLabelDisplay="on"
                            step={null}
                            min={0}
                            max={citytotal}
                            marks={citymarks}
                        />
                        <ul>
                            {cityspeciescount.map(function(name, index) {
                                return <li key={index}>{name[0]}: {name[1]}</li>
                            })}
                        </ul>
                    </Grid>
                    <Grid item align="center" xs={10} >
                        <Typography gutterBottom>Freedraw Native Distribution</Typography>
                        <Box pb={5} />
                        <Slider
                            defaultValue={countFreeNative}
                            valueLabelDisplay="on"
                            step={null}
                            min={0}
                            max={freetotal}
                            marks={freemarks}
                        />
                        <ul>
                            {freespeciescount.map(function(name, index) {
                                return <li key={index}>{name[0]}: {name[1]}</li>
                            })}
                        </ul>
                    </Grid>
                </Grid>
            </Paper>
         )
    } else if (stateMarker.freedraw.length == 0 && stateMarker.city.length > 0) {
        return(
            <Paper className={classes.analysisMargin}>
                <Grid container justify="center" alignItems="center" spacing={2}>
                    <Grid item align="center" xs={10} >
                        <Typography gutterBottom>City Native Distribution</Typography>
                        <Box pb={5} />
                        <Slider
                            defaultValue={countCityNative}
                            valueLabelDisplay="on"
                            step={null}
                            min={0}
                            max={citytotal}
                            marks={citymarks}
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