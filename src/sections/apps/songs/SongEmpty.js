import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, CardMedia, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { ArrowRight2 } from 'iconsax-react';

import imageEmpty from 'assets/images/e-commerce/empty-song.jpg';
import { FormattedMessage } from 'react-intl';

// ==============================|| PRODUCT - EMPTY ||============================== //

const SongEmpty = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);

  const handelAdd = () => {
    if (user.role === 'Agent'){
       window.location.href = '/agent/add-song';
    }else if (user.role === 'Artist'){
    window.location.href = '/artist/add-song';
  }
  };

  return (
    <MainCard content={false}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={3}
        sx={{ my: 3, height: { xs: 'auto', md: 'calc(100vh - 240px)' }, p: { xs: 2.5, md: 'auto' } }}
      >
        <Grid item>
          <CardMedia component="img" image={imageEmpty} title="Cart Empty" sx={{ width: { xs: 240, md: 320, lg: 440 } }} />
        </Grid>
        <Grid item>
          <Stack spacing={0.5}>
            <Typography variant={matchDownMD ? 'h3' : 'h1'} color="inherit">
              <FormattedMessage id="noSongs" />
            </Typography>
            <Typography variant="h5" color="textSecondary">
              <FormattedMessage id="tryAddSongs" />
            </Typography>
            <Box sx={{ pt: 3 }}>
              <Button variant="contained" size="large" color="error" endIcon={<ArrowRight2 />} onClick={() => handelAdd()}>
                <FormattedMessage id="addSong" />
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

SongEmpty.propTypes = {
  handelFilter: PropTypes.func
};

export default SongEmpty;
