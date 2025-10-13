import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useIntl, FormattedMessage } from 'react-intl';
import { AddCircle } from 'iconsax-react';

const AgentAuthRegister = () => {
  const { agentRegister } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const intl = useIntl();

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .max(255, intl.formatMessage({ id: 'firstNameMaxLength' }))
      .required(intl.formatMessage({ id: 'firstNameRequired' })),
    lastname: Yup.string()
      .max(255, intl.formatMessage({ id: 'lastNameMaxLength' }))
      .required(intl.formatMessage({ id: 'lastNameRequired' })),
    userName: Yup.string()
      .max(255, intl.formatMessage({ id: 'userNameMaxLength' }))
      .required(intl.formatMessage({ id: 'userNameRequired' })),
    email: Yup.string()
      .email(intl.formatMessage({ id: 'invalidEmail' }))
      .max(150, intl.formatMessage({ id: 'emailMaxLength' }))
      .required(intl.formatMessage({ id: 'emailRequired' })),
    startDate: Yup.date().required(intl.formatMessage({ id: 'startDateRequired' })),
    phoneNumber: Yup.string()
      .matches(/^\+?\d+$/, intl.formatMessage({ id: 'phoneNumberInvalid' }))
      .required(intl.formatMessage({ id: 'phoneNumberRequired' })),
    artistsNum: Yup.number().required(intl.formatMessage({ id: 'artistsNumRequired' })),
    webSite: Yup.string()
      .url(intl.formatMessage({ id: 'invalidWebSite' }))
      .required(intl.formatMessage({ id: 'webSiteRequired' }))
  });

  const makePassword = (value) => {
    return 'Agent.' + value + '123@';
  };

  // useEffect(() => {
  //   const testAgentRegistration = async () => {
  //     try {
  //       const firstName = 'John';
  //       const lastName = 'Doe';
  //       const userName = 'john.doe';
  //       const artistsNum = 5;
  //       const webSite = 'https://www.johndoe.com';
  //       const careerStartDate = '2020-01-01';
  //       const phoneNumber = '+1234567890';
  //       const email = 'john.doe@example.com';
  //       const password = 'Agent.John123@';

  //       const response = await agentRegister(
  //         firstName,
  //         lastName,
  //         userName,
  //         artistsNum,
  //         webSite,
  //         careerStartDate,
  //         phoneNumber,
  //         email,
  //         password
  //       );

  //       console.log('Registration successful:', response);
  //     } catch (error) {
  //       console.error('Error during registration:', error);
  //     }
  //   };

  //   testAgentRegistration();
  // }, [agentRegister]);

  return (
    <>
      <Formik
        initialValues={{
          userName: '',
          startDate: '',
          phoneNumber: '',
          artistsNum: 0,
          webSite: '',
          firstname: '',
          lastname: '',
          email: '',
          submit: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log('Submitting form with values:', values);
          try {
            console.log('Calling agentRegister');
            await agentRegister(
              values.firstname,
              values.lastname,
              values.userName,
              values.artistsNum,
              values.webSite,
              values.startDate,
              values.phoneNumber,
              values.email,
              makePassword(values.firstname)
            );
            console.log('agent registration successful');
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
                  <InputLabel htmlFor="firstname-signup">
                    <FormattedMessage id="firstName" /> *
                  </InputLabel>
                  <OutlinedInput
                    id="firstname-login"
                    type="text"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Lio"
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
                    type="text"
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
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="user-name">
                    <FormattedMessage id="userName" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.userName && errors.userName)}
                    id="user-name"
                    value={values.userName}
                    name="userName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="lio.doe"
                    inputProps={{}}
                  />
                  {touched.userName && errors.userName && (
                    <FormHelperText error id="helper-text-user-name">
                      {errors.userName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="nbr-artist">
                    <FormattedMessage id="nbrArtist" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.artistsNum && errors.artistsNum)}
                    id="nbr-artist"
                    type="number"
                    value={values.artistsNum}
                    name="artistsNum"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="0"
                    inputProps={{}}
                  />
                  {touched.artistsNum && errors.artistsNum && (
                    <FormHelperText error id="helper-text-artistsNum">
                      {errors.artistsNum}
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
                  <InputLabel htmlFor="web-site">
                    <FormattedMessage id="webSite" /> *
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.webSite && errors.webSite)}
                    id="web-site"
                    type="text"
                    value={values.webSite}
                    name="webSite"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="https://www.agent.com"
                    inputProps={{}}
                  />
                  {touched.webSite && errors.webSite && (
                    <FormHelperText error id="helper-text-web-site">
                      {errors.webSite}
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
                    placeholder="agent@gmail.com"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
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
                    <FormattedMessage id="askForAccount" />
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

export default AgentAuthRegister;
