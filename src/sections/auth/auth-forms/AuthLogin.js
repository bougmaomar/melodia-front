import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = () => {
  const { login } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const initialValues = {
    email: '',
    password: ''
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            const res = await login(values.email, values.password);

            if (res.status == 'ToAccept') setError("Votre compte n'est pas encore accepté!!");
            else if (res.status == 'Rejected') setError('Votre compte a été refusé par le super administrateur!!');
            else if (res.status == 404) setError('Email ou mot de passe incorrects!');
            else {
              if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                setError('');
                navigate('/');
              }
            }
            // else {
            //   console.log('here: ', res);
            //   setStatus({ success: false });
            //   setError('Email ou mot de passe incorrects!');
            //   setTimeout(() => {
            //     setSubmitting(false);
            //   }, 100);
            // }
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });

              console.log('Login error:', err);

              if (err.response && err.response.status === 400) {
                if (err.response.data && err.response.data.message) {
                  setError(err.response.data.message);
                } else {
                  setError('Email ou mot de passe incorrects!'); // Default message
                }
              } else {
                setError('Une erreur est survenue. Veuillez réessayer plus tard.');
              }
              setTimeout(() => {
                setSubmitting(false);
              }, 100);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">
                    <FormattedMessage id="address" />
                  </InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">
                    <FormattedMessage id="password" />
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {/* <Grid item xs={12} sx={{ mt: -1 }}></Grid> */}
              {/* <Grid item xs={12} sx={{ mt: -1 }}></Grid> */}
              {/* {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
              <Grid item xs={12}>
                <FormHelperText error>{error}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    <FormattedMessage id="login" />
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

AuthLogin.propTypes = {
  forgot: PropTypes.string
};

export default AuthLogin;
