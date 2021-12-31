import React, {useState} from "react";
import NavBar from "./NavBar";
import { LeafMap } from "./Map";
import { Upload } from "./Upload";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import '@fontsource/roboto';

const App = () => {

  const [appState, setAppState] = useState('landing');

  if (appState === 'landing') {
    return (
    <>
      <NavBar />
      <Grid style={{ marginTop:100 }} container justify="center" align="center" alignItems="center" spacing={2}>
        <Grid style={{ paddingLeft:100, paddingRight:100 }} item align="center" xs={12}>
            <Typography variant="h5" gutterBottom>What can this tool do?</Typography>
            <Typography variant="subtitle1" gutterBottom>
                This tool allows you to view city tree data geospatially on an interactive map and provide tree analytics to a specific areas.
                Additionally, this tool allows users to upload their own tree data.
            </Typography>

        </Grid>
        <Grid item align="center" xs={6} ><Button variant="contained" color="primary" onClick={() => { setAppState("map") }}>Choose Map</Button></Grid>
        <Grid item align="center" xs={6} ><Button variant="contained" color="primary" onClick={() => { setAppState("upload") }}>Submit Data</Button></Grid>
      </Grid>
     </>
    );
  } else if (appState === 'map') {
    return (
    <>
      <NavBar />
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item align="center" xs={12} ><LeafMap /></Grid>
      </Grid>
    </>
    );
  } else if (appState === 'upload') {
    return (
    <>
      <NavBar />
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item align="center" xs={12} ><Upload /></Grid>
      </Grid>
    </>
    );
  }
}

export default App;