import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, MenuItem, Select, TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';

import AnimateButton from 'components/@extended/AnimateButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import { useIntl, FormattedMessage } from 'react-intl';

import { API_URL } from 'config';
// import StationRegister from 'pages/auth/auth1/station-register';

const StationAuthRegister = () => {
  const { stationRegister } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const [stationTypes, setStationTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const intl = useIntl();

  const validationSchema = Yup.object().shape({
    stationName: Yup.string()
      .max(255, intl.formatMessage({ id: 'stationNameMaxLength' }))
      .required(intl.formatMessage({ id: 'stationNameRequired' })),
    stationOwner: Yup.string()
      .max(255, intl.formatMessage({ id: 'stationOwnerMaxLength' }))
      .required(intl.formatMessage({ id: 'stationOwnerRequired' })),
    email: Yup.string()
      .email(intl.formatMessage({ id: 'invalidEmail' }))
      .max(150, intl.formatMessage({ id: 'emailMaxLength' }))
      .required(intl.formatMessage({ id: 'emailRequired' })),
    foundationDate: Yup.date().required(intl.formatMessage({ id: 'foundationDateRequired' })),
    phoneNumber: Yup.string()
      .matches(/^\+?\d+$/, intl.formatMessage({ id: 'phoneNumberInvalid' }))
      .required(intl.formatMessage({ id: 'phoneNumberRequired' })),
    countryId: Yup.string().required(intl.formatMessage({ id: 'countryRequired' })),
    cityId: Yup.string().required(intl.formatMessage({ id: 'cityRequired' }))
  });
  const makePassword = (value) => {
    return 'Station.' + value + '123@';
  };

  useEffect(() => {
    const fetchStationTypes = async () => {
      try {
        const response = await axios.get(`${API_URL}/StationTypes`);
        setStationTypes(response.data.$values);
      } catch (error) {
        console.error('Error fetching station types:', error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_URL}/countries`);
        setCountries(response.data.$values);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchStationTypes();
    fetchCountries();
  }, []);

  const fetchCities = async (countryId) => {
    try {
      const response = await axios.get(`${API_URL}/cities/country/${countryId}`);
      const uniqueCities = Array.from(new Set(response.data.$values.map((city) => city.name))).map((name) => {
        return response.data.$values.find((city) => city.name === name);
      });
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCountryChange = async (event, handleChange) => {
    const countryId = event.target.value;
    await fetchCities(countryId);
    handleChange(event);
  };

  const handleCityChange = (event, value, handleChange) => {
    handleChange({ target: { name: 'cityId', value: value ? value.id : '' } });
  };
  return (
    <>
      <Formik
        initialValues={{
          stationName: '',
          email: '',
          password: '',
          phoneNumber: '',
          frequency: '',
          webSite: '',
          stationOwner: '',
          foundationDate: '',
          countryId: '',
          cityId: '',
          stationTypeId: '',
          submit: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log('Form is being submitter', values);
          console.log('Submitting form with values:', values);
          try {
            console.log('Calling stationRegister');
            await stationRegister(
              values.email,
              makePassword(values.stationName),
              values.stationName,
              values.stationOwner,
              values.stationTypeId,
              values.cityId,
              values.foundationDate,
              values.frequency,
              values.webSite,
              values.phoneNumber
            );
            console.log('station registration successful');
            if (scriptedRef.current) {
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
            console.error('Error during registration:', err);
            if (scriptedRef.current) {
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
                  <InputLabel htmlFor="stationName-signup">
                    <FormattedMessage id="stationName" /> *
                  </InputLabel>
                  <OutlinedInput
                    id="stationName-login"
                    type="stationName"
                    value={values.stationName}
                    name="stationName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="name"
                    fullWidth
                    error={Boolean(touched.stationName && errors.stationName)}
                  />
                  {touched.stationName && errors.stationName && (
                    <FormHelperText error id="helper-text-stationName-signup">
                      {errors.stationName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="stationOwner-signup">
                    <FormattedMessage id="stationOwner" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.stationOwner && errors.stationOwner)}
                    id="stationOwner-signup"
                    type="stationOwner"
                    value={values.stationOwner}
                    name="stationOwner"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="owner"
                    inputProps={{}}
                  />
                  {touched.stationOwner && errors.stationOwner && (
                    <FormHelperText error id="helper-text-stationOwner-signup">
                      {errors.stationOwner}
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
                    placeholder="phoneNumber"
                    inputProps={{}}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <FormHelperText error id="helper-text-phoneNumber">
                      {errors.phoneNumber}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="frequency">
                    <FormattedMessage id="frequency" />
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.frequency && errors.frequency)}
                    id="frequency"
                    value={values.frequency}
                    name="frequency"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="frequency"
                    inputProps={{}}
                  />
                  {touched.frequency && errors.frequency && (
                    <FormHelperText error id="helper-text-frequency">
                      {errors.frequency}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="webSite">
                    <FormattedMessage id="webSite" />
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.webSite && errors.webSite)}
                    id="webSite"
                    value={values.webSite}
                    name="webSite"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="webSite"
                    inputProps={{}}
                  />
                  {touched.webSite && errors.webSite && (
                    <FormHelperText error id="helper-text-webSite">
                      {errors.webSite}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="foundationDate">
                    <FormattedMessage id="foundationDate" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.foundationDate && errors.foundationDate)}
                    id="foundationDate"
                    type="date"
                    value={values.foundationDate}
                    name="foundationDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="foundationDate"
                    inputProps={{}}
                  />
                  {touched.foundationDate && errors.foundationDate && (
                    <FormHelperText error id="helper-text-foundationDate">
                      {errors.foundationDate}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="stationTypeId">
                    <FormattedMessage id="stationType" /> *
                  </InputLabel>
                  <Select
                    fullWidth
                    error={Boolean(touched.stationTypeId && errors.stationTypeId)}
                    id="stationTypeId"
                    value={values.stationTypeId}
                    name="stationTypeId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="stationTypeId"
                    inputProps={{}}
                  >
                    {stationTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.stationTypeId && errors.stationTypeId && (
                    <FormHelperText error id="helper-text-stationTypeId">
                      {errors.stationTypeId}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="country">
                    <FormattedMessage id="country" /> *
                  </InputLabel>
                  <Select
                    fullWidth
                    error={Boolean(touched.countryId && errors.countryId)}
                    id="countryId"
                    value={values.countryId}
                    name="countryId"
                    onBlur={handleBlur}
                    onChange={(event) => handleCountryChange(event, handleChange)}
                    placeholder="countryId"
                    inputProps={{}}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.countryId && errors.countryId && (
                    <FormHelperText error id="helper-text-countryId">
                      {errors.countryId}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="city">
                    <FormattedMessage id="city" /> *
                  </InputLabel>
                  <Autocomplete
                    id="city"
                    options={cities}
                    getOptionLabel={(option) => option.name}
                    onBlur={handleBlur}
                    onChange={(event, value) => handleCityChange(event, value, handleChange)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="cityId"
                        error={Boolean(touched.cityId && errors.cityId)}
                        helperText={touched.cityId && errors.cityId}
                      />
                    )}
                  />
                  {touched.cityId && errors.cityId && (
                    <FormHelperText error id="helper-text-cityId">
                      {errors.cityId}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">
                    <FormattedMessage id="emailAddress" /> *
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
                    placeholder="demo@station.com"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {/* <Grid item xs={12} md={6}>
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
                          size="large"
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
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
              </Grid>*/}

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    <FormattedMessage id="signUp" />
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

export default StationAuthRegister;
