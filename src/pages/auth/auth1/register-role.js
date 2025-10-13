// React imports
import React from 'react';
import { Grid, Typography } from '@mui/material';

// Custom component imports
import AuthCard from './../../../components/cards/skeleton/AuthCard';

const RegisterRole = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center" gutterBottom>
          Choose your role to register
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AuthCard title="Register as Artist" description="artist" onClick={null} buttonText="artist" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AuthCard title="Register as Agent" description="agent" onClick={null} buttonText="agent" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AuthCard title="Register as Station" description="station" onClick={null} buttonText="station" />
      </Grid>
    </Grid>
  );
};

export default RegisterRole;
