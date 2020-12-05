import React from "react";
import List from "./List";
import Form from "./Form";
import Post from "./Posts";
import NavBar from "./NavBar";
import Map from "./Map";
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const App = () => (
  <Grid container
  justify="center"
  alignItems="center"
  spacing={3}>
    <NavBar />
    <Grid
    align="center"
    item xs={8}>
        <Map />
    </Grid>
  </Grid>
);

export default App;