import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';

import Tab from '@mui/material/Tab';


function Header(props) {


  return (
    <React.Fragment>
      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={11}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Sign-in method" /></Link>
            <Link to="/sign-up" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Sign-In/Sign-Up" /></Link>
            <Link to="/Hotel" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Search Rooms" /></Link>
            {localStorage.getItem('email') === 'admin@gmail.com' ?
              <>
                <Link to="/ViewReports" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="View Reports" />
                </Link>
                <Link to="/ViewVisualizations" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="View Trends" />
                </Link>
                <Link to="/ViewIncomeCharts" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="View Income Charts" />
                </Link>
              </> : localStorage.getItem('email')!==null ? 
              <>
                <Link to="/OrderFood" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Order Food" /></Link>
                <Link to='/bookTour' style={{ textDecoration: 'none', color: 'white' }} ><Tab label='Book Tour'></Tab></Link>
                <Link to='/Invoice' style={{ textDecoration: 'none', color: 'white' }} ><Tab label='Order Invoice'></Tab></Link>
                <Link to="/ViewVisualizations" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="View Trends" />
                </Link>
              </>:<></>}
            <Link to="/Feedback" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Feedback" /></Link>
          </Grid>
        </Grid>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;