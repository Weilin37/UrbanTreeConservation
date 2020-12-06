import React from "react";
import NavBar from "./NavBar";
import { LeafMap } from "./Map";
import Grid from '@material-ui/core/Grid';

const App = () => (
  <Grid container justify="center" alignItems="center" spacing={3}>
    <NavBar />
    <Grid align="center" item xs={8}>
        <LeafMap />
    </Grid>
  </Grid>
);

export default App;