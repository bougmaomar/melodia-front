import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project-imports
import {
  APP_DEFAULT_PATH,
  APP_DEFAULT_ADMIN_PATH,
  APP_DEFAULT_ARTIST_PATH,
  APP_DEFAULT_AGENT_PATH,
  APP_DEFAULT_STATION_PATH
} from 'config';

// assets
import error401 from 'assets/images/maintenance/img-error-401.svg';
import { FormattedMessage } from 'react-intl';

const NotAuthorized = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Determine the path based on the user's role
  const getHomePath = () => {
    if (user?.role === 'Admin') return APP_DEFAULT_ADMIN_PATH;
    else if (user?.role === 'Artist') return APP_DEFAULT_ARTIST_PATH;
    else if (user?.role === 'Agent') return APP_DEFAULT_AGENT_PATH;
    else if (user?.role === 'Station') return APP_DEFAULT_STATION_PATH;
    else return APP_DEFAULT_PATH; // Fallback if role is undefined or not recognized
  };

  return (
    <>
      <Grid
        container
        spacing={10}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', pt: 2, pb: 1, overflow: 'hidden' }}
      >
        <Grid item xs={12}>
          <Stack direction="row">
            <Grid item>
              <Box sx={{ width: { xs: 250, sm: 590 }, height: { xs: 130, sm: 300 } }}>
                <img src={error401} alt="error 401" style={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1">
              <FormattedMessage id="error-401-title" />
            </Typography>
            <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
              <FormattedMessage id="error-401-message" />
            </Typography>
            <Button component={Link} to={getHomePath()} variant="contained">
              <FormattedMessage id="error-back" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default NotAuthorized;
