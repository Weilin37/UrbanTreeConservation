import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchBar from "./SearchBar";
import Box from '@material-ui/core/Box';

const NavBar = props => {
    return (
      <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Urban Tree Conservation
            </Typography>
            <Box display="flex" justify="flex-end"><SearchBar /></Box>
          </Toolbar>
      </AppBar>
    );
}

export default NavBar;