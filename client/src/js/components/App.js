import React, {useState} from "react";
import NavBar from "./NavBar";
import { LeafMap } from "./Map";
import { Upload } from "./Upload";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const App = () => {

  const [appState, setAppState] = useState('landing');

  if (appState === 'landing') {
    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <NavBar />
        <Grid item align="center" xs={6} ><Button variant="contained" color="primary" onClick={() => { setAppState("map") }}>Choose Map</Button></Grid>
        <Grid item align="center" xs={6} ><Button variant="contained" color="primary" onClick={() => { setAppState("upload") }}>Submit Data</Button></Grid>
      </Grid>
    );
  } else if (appState === 'map') {
    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <NavBar />
        <Grid item align="center" xs={12} ><LeafMap /></Grid>
      </Grid>
    );
  } else if (appState === 'upload') {
    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <NavBar />
        <Grid item align="center" xs={12} ><Upload /></Grid>
      </Grid>
    );
  }
}

export default App;