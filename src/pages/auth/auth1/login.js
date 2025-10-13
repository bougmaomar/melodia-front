import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project-imports
// import Logo from 'components/logo';
import Melodia from './../../../assets/images/logo-melodia.jpeg';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import { FormattedMessage } from 'react-intl';
// ================================|| LOGIN ||================================ //

const Login = () => {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <img src={Melodia} alt="Melodia" width={150} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              <FormattedMessage id="login" />
            </Typography>
            <Typography component={Link} to="/registration" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              <FormattedMessage id="dont_have_account" />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
