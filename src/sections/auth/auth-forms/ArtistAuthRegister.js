import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { Eye, EyeSlash, AddCircle } from 'iconsax-react';

import { useIntl, FormattedMessage } from 'react-intl';

const ArtistAuthRegister = () => {
  const { artistRegister } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const intl = useIntl();

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .max(255, intl.formatMessage({ id: 'firstNameMaxLength' }))
      .required(intl.formatMessage({ id: 'firstNameRequired' })),
    lastname: Yup.string()
      .max(255, intl.formatMessage({ id: 'lastNameMaxLength' }))
      .required(intl.formatMessage({ id: 'lastNameRequired' })),
    name: Yup.string()
      .max(255, intl.formatMessage({ id: 'userNameMaxLength' }))
      .required(intl.formatMessage({ id: 'userNameRequired' })),
    email: Yup.string()
      .email(intl.formatMessage({ id: 'invalidEmail' }))
      .max(150, intl.formatMessage({ id: 'emailMaxLength' }))
      .required(intl.formatMessage({ id: 'emailRequired' })),
    password: Yup.string()
      .required(intl.formatMessage({ id: 'passwordRequired' }))
      .min(8, intl.formatMessage({ id: 'passwordMinLength' }))
      .max(50, intl.formatMessage({ id: 'passwordMaxLength' }))
      .matches(/[A-Z]/, intl.formatMessage({ id: 'passwordUppercase' }))
      .matches(/[a-z]/, intl.formatMessage({ id: 'passwordLowercase' }))
      .matches(/[0-9]/, intl.formatMessage({ id: 'passwordDigit' }))
      .matches(/^[\S]+$/, intl.formatMessage({ id: 'passwordNoSpaces' })),
    startDate: Yup.date().required(intl.formatMessage({ id: 'startDateRequired' })),
    phoneNumber: Yup.string()
      .matches(/^\+?\d+$/, intl.formatMessage({ id: 'phoneNumberInvalid' }))
      .required(intl.formatMessage({ id: 'phoneNumberRequired' }))
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          startDate: '',
          phoneNumber: '',
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          submit: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log('Submitting form with values:', values);
          try {
            await artistRegister(
              values.email,
              values.password,
              values.firstname,
              values.lastname,
              values.name,
              values.startDate,
              values.phoneNumber
            );
            console.log('artist registration successful');
            if (scriptedRef.current) {
              console.log('scriptedRef is currently:', scriptedRef.current);
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Your registration has been successfully completed.',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: true
                })
              );
              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 1500);
            }
          } catch (err) {
            console.error(err);
            console.error('Error during registration:', err);
            if (scriptedRef.current) {
              console.log('scriptedRef is currently:', scriptedRef.current);
              console.error('Error during registration:', err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">
                    <FormattedMessage id="firstName" /> *
                  </InputLabel>
                  <OutlinedInput
                    id="firstname-login"
                    type="firstname"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="John"
                    fullWidth
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                  {touched.firstname && errors.firstname && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">
                    <FormattedMessage id="lastName" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                    id="lastname-signup"
                    type="lastname"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Doe"
                    inputProps={{}}
                  />
                  {touched.lastname && errors.lastname && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="user-name">
                    <FormattedMessage id="name" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    id="user-name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Demo Inc."
                    inputProps={{}}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-user-name">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-number">
                    <FormattedMessage id="phoneNumber" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    id="phone-number"
                    value={values.phoneNumber}
                    name="phoneNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="1234567890"
                    inputProps={{}}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <FormHelperText error id="helper-text-phone-number">
                      {errors.phoneNumber}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="start-date">
                    <FormattedMessage id="startDate" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.startDate && errors.startDate)}
                    id="start-date"
                    type="date"
                    value={values.startDate}
                    name="startDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.startDate && errors.startDate && (
                    <FormHelperText error id="helper-text-start-date">
                      {errors.startDate}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">
                    <FormattedMessage id="email" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="artist@gmail.com"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">
                    <FormattedMessage id="password" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
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
                    placeholder="******"
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    startIcon={<AddCircle />}
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="createAccount" />
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
export default ArtistAuthRegister;
