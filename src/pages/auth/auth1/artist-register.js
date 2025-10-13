import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project-imports
import Logo from 'assets/images/logo-melodia.jpeg';
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import ArtistAuthRegister from 'sections/auth/auth-forms/ArtistAuthRegister';

import { FormattedMessage } from 'react-intl';

const ArtistRegister = () => {
  const { isLoggedIn } = useAuth();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <img src={Logo} alt="melodia" width={150} />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              {' '}
              <FormattedMessage id="signUpAsArtist" />
            </Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              <FormattedMessage id="alreadyHaveAccount" />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ArtistAuthRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default ArtistRegister;
