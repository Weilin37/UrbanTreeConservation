import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const NavBar = props => {

    return (
      <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              Urban Tree Conservation
            </Typography>
          </Toolbar>
      </AppBar>
    );
}

export default NavBar;