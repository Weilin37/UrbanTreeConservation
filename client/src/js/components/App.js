import React from "react";
import NavBar from "./NavBar";
import { LeafMap } from "./Map";
import Grid from '@material-ui/core/Grid';

const App = () => (
  <Grid container justify="center" alignItems="center" spacing={2}>
    <NavBar />
    <Grid item align="center" xs={12} ><LeafMap /></Grid>
  </Grid>
);

export default App;