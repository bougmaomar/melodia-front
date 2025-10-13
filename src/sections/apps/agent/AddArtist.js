import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  FormHelperText,
  FormLabel,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { AddCircle, CloseCircle, LockSlash, Camera, Lock } from 'iconsax-react';

import { format } from 'date-fns';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { dispatch } from 'store';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';

import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'store/reducers/snackbar';
import Avatar from 'components/@extended/Avatar';
import { useIntl, FormattedMessage } from 'react-intl';

import useArtist from 'hooks/useArtist';
import useAdmin from 'hooks/useAdmin';
import { useTheme } from '@mui/material/styles';
import { ThemeMode, API_MEDIA_URL } from 'config';
import { formatDateToInput } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);

const AddArtist = ({ onClose, artistId }) => {
  AddArtist.propTypes = {
    onClose: PropTypes.func,
    artistId: PropTypes.number
  };

  const theme = useTheme();
  const [avatar, setAvatar] = useState(avatarImage(`./default.jpeg`));
  const [artist, setArtist] = useState(null);
  const { desactivateArtist, activateArtist } = useAdmin();
  const { getArtistById, updateArtistByAgent, addArtistByAgent } = useArtist();
  const intl = useIntl();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const today = new Date();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    userName: '',
    phoneNumber: '',
    careerStartDate: formatDateToInput(today),
    email: '',
    spotify: '',
    instagram: '',
    facebook: '',
    youtube: '',
    google: '',
    photoProfile: null,
    bio: ''
  });

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
    careerStartDate: Yup.date()
      .required(intl.formatMessage({ id: 'startDateRequired' }))
      .max(today, "Release date must be before or equal to today's date"),
    phoneNumber: Yup.string()
      .matches(/^\+?\d+$/, intl.formatMessage({ id: 'phoneNumberInvalid' }))
      .required(intl.formatMessage({ id: 'phoneNumberRequired' })),
    spotify: Yup.string().url(intl.formatMessage({ id: 'invalidUrl' })),
    instagram: Yup.string().url(intl.formatMessage({ id: 'invalidUrl' })),
    facebook: Yup.string().url(intl.formatMessage({ id: 'invalidUrl' })),
    youtube: Yup.string().url(intl.formatMessage({ id: 'invalidUrl' })),
    google: Yup.string().url(intl.formatMessage({ id: 'invalidUrl' }))
  });

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleClose = () => {
    setArtist(null);
    onClose();
  };

  useEffect(() => {
    const fetchArtist = async () => {
      if (artistId) {
        try {
          const artistData = await getArtistById(artistId);
          setArtist(artistData);
        } catch (error) {
          console.error('Error fetching artist details:', error);
        }
      } else {
        setArtist(null);
      }
    };

    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    if (artist) {
      setFormData({
        email: artist.email || '',
        phoneNumber: artist.phoneNumber || '',
        bio: artist.bio || '',
        google: artist.google || '',
        facebook: artist.facebook || '',
        instagram: artist.instagram || '',
        spotify: artist.spotify || '',
        youtube: artist.youtube || '',
        photoProfile: artist.photoProfile || '',
        userName: artist.name || '',
        firstname: artist.artistRealName ? artist.artistRealName.split(' ')[0] : '',
        lastname: artist.artistRealName ? artist.artistRealName.split(' ')[1] : '',
        cityId: artist.cityId || '',
        careerStartDate: artist.careerStartDate ? format(new Date(artist.careerStartDate), 'yyyy-MM-dd') : ''
      });
    } else {
      setFormData({
        email: '',
        phoneNumber: '',
        bio: '',
        google: '',
        facebook: '',
        instagram: '',
        spotify: '',
        youtube: '',
        photoProfile: '',
        userName: '',
        firstname: '',
        lastname: '',
        careerStartDate: formatDateToInput(today),
        cityId: 1
      });
    }
  }, [artist]);

  const handleCoverImageChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFormData({ ...formData, photoProfile: selectedFile });
    setSelectedImage(event.target.files?.[0]);
  };

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });
  };

  const handlePhoneChange = (value, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleActivate = async (id) => {
    try {
      await activateArtist(id);
    } catch (error) {
      console.error('Error activating artist:', error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await desactivateArtist(id);
      await fetchArtists();
    } catch (error) {
      console.error('Error deactivating artist:', error);
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
      }
      return validationErrors;
    }
  };

  const handleSubmit = async (formData, { setErrors, setSubmitting }) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        if (artist) {
          await updateArtistByAgent({
            artistId: artist.artistId,
            agentId: user.userId,
            firstname: formData.firstname,
            lastname: formData.lastname,
            userName: formData.userName,
            phoneNumber: formData.phoneNumber,
            photoProfile: formData.photoProfile,
            careerStartDate: formData.careerStartDate,
            email: formData.email,
            spotify: formData.spotify,
            instagram: formData.instagram,
            facebook: formData.facebook,
            youtube: formData.youtube,
            google: formData.google,
            cityId: 1,
            bio: formData.bio
          });

          dispatch(
            openSnackbar({
              open: true,
              message: 'Artist updated successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          onClose();
        } else {
          await addArtistByAgent({
            agentId: user.userId,
            firstname: formData.firstname,
            lastname: formData.lastname,
            userName: formData.userName,
            phoneNumber: formData.phoneNumber,
            careerStartDate: formData.careerStartDate,
            email: formData.email,
            spotify: formData.spotify,
            instagram: formData.instagram,
            facebook: formData.facebook,
            youtube: formData.youtube,
            google: formData.google,
            cityId: formData.cityId,
            bio: formData.bio
          });

          dispatch(
            openSnackbar({
              open: true,
              message: 'Artist registered successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );

          onClose();
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;

          dispatch(
            openSnackbar({
              open: true,
              message: errorMessage,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Artist already registered.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
        onClose();
        setFormData({
          email: '',
          phoneNumber: '',
          bio: '',
          google: '',
          facebook: '',
          instagram: '',
          spotify: '',
          youtube: '',
          photoProfile: '',
          userName: '',
          firstname: '',
          lastname: '',
          careerStartDate: formatDateToInput(today),
          cityId: 1
        });
      }
    } else {
      setErrors(errors);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10} mt={4} mb={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography variant="h4" component="h1" gutterBottom mb={0}>
              <FormattedMessage id={artist ? 'editArtist' : 'addArtist'} defaultMessage={artist ? 'Edit Artist' : 'Add Artist'} />
            </Typography>
            <Typography variant="body1" component="div">
              {artist && (
                <>
                  <Tooltip title="Activate">
                    <IconButton
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivate(artist.id);
                        handleClose();
                      }}
                      sx={{ fontSize: 24 }}
                    >
                      <LockSlash size={24} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deactivate">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeactivate(artist.id);
                        handleClose();
                      }}
                      sx={{ fontSize: '24rem' }}
                    >
                      <Lock />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Typography>
          </Grid>
          <Formik enableReinitialize initialValues={formData} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {artist && (
                    <Grid item xs={12}>
                      <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                        <FormLabel
                          htmlFor="change-avtar"
                          sx={{
                            position: 'relative',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            '&:hover .MuiBox-root': { opacity: 1 },
                            cursor: 'pointer'
                          }}
                        >
                          <Avatar
                            alt="Avatar 1"
                            src={
                              selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : formData.photoProfile
                                ? `${API_MEDIA_URL}${formData.photoProfile}`
                                : avatar
                            }
                            sx={{ width: 76, height: 76 }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                              width: '100%',
                              height: '100%',
                              opacity: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Stack spacing={0.5} alignItems="center">
                              <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                              <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                                Upload
                              </Typography>
                            </Stack>
                          </Box>
                        </FormLabel>
                        <TextField
                          type="file"
                          id="change-avtar"
                          placeholder="Outlined"
                          variant="outlined"
                          sx={{ display: 'none' }}
                          onChange={(event) => handleCoverImageChange(event)}
                        />
                        <Typography variant="h5" sx={{ color: 'grey' }}>
                          Profile Picture
                        </Typography>
                      </Stack>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="firstname-signup">
                        <FormattedMessage id="firstName" /> *
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.firstname && errors.firstname)}
                        id="firstname-login"
                        type="text"
                        value={formData.firstname}
                        name="firstname"
                        onBlur={handleBlur}
                        onChange={(e) => handleInputChange(e, 'firstname')}
                        placeholder="John"
                        inputProps={{}}
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
                        value={formData.lastname}
                        name="lastname"
                        onBlur={handleBlur}
                        onChange={(e) => handleInputChange(e, 'lastname')}
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
                        <FormattedMessage id="userName" /> *
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.userName && errors.userName)}
                        id="user-name"
                        value={formData.userName}
                        name="userName"
                        onBlur={handleBlur}
                        onChange={(e) => handleInputChange(e, 'userName')}
                        placeholder="johndoe"
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
                      {/* <InputLabel htmlFor="phone-number">
                        <FormattedMessage id="phoneNumber" /> *
                      </InputLabel> */}
                      <PhoneInput
                        fullWidth
                        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                        id="phone-number"
                        name="phonenumber"
                        country={'ca'}
                        value={formData.phoneNumber}
                        onBlur={handleBlur}
                        onChange={(value) => {
                          handlePhoneChange(value, 'phoneNumber');
                        }}
                        enableSearch={true}
                        autoFormat={true}
                        inputStyle={{ width: '100%', padding: '15px', borderRadius: '10px', marginTop: 6 }}
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
                        error={Boolean(touched.careerStartDate && errors.careerStartDate)}
                        id="start-date"
                        type="date"
                        value={formData.careerStartDate}
                        name="careerStartDate"
                        onBlur={handleBlur}
                        onChange={(e) => handleInputChange(e, 'careerStartDate')}
                        placeholder="2024-01-01"
                        inputProps={{}}
                      />
                      {touched.careerStartDate && errors.careerStartDate && (
                        <FormHelperText error id="helper-text-start-date">
                          {errors.careerStartDate}
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
                        value={formData.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={(e) => handleInputChange(e, 'email')}
                        placeholder="demo@sample.com"
                        inputProps={{}}
                      />
                      {touched.email && errors.email && (
                        <FormHelperText error id="helper-text-email-signup">
                          {errors.email}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  {artist && (
                    <Grid item xs={12} container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="spotify-signup">Spotify</InputLabel>
                          <OutlinedInput
                            id="spotify-login"
                            type="text"
                            value={formData.spotify}
                            name="spotify"
                            onBlur={handleBlur}
                            onChange={(e) => handleInputChange(e, 'spotify')}
                            placeholder="Spotify Profile Link"
                            fullWidth
                            error={Boolean(touched.spotify && errors.spotify)}
                          />
                          {touched.spotify && errors.spotify && (
                            <FormHelperText error id="helper-text-spotify-signup">
                              {errors.spotify}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="instagram-signup">Instagram</InputLabel>
                          <OutlinedInput
                            id="instagram-login"
                            type="text"
                            value={formData.instagram}
                            name="instagram"
                            onBlur={handleBlur}
                            onChange={(e) => handleInputChange(e, 'instagram')}
                            placeholder="Instagram Profile Link"
                            fullWidth
                            error={Boolean(touched.instagram && errors.instagram)}
                          />
                          {touched.instagram && errors.instagram && (
                            <FormHelperText error id="helper-text-instagram-signup">
                              {errors.instagram}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="facebook-signup">Facebook</InputLabel>
                          <OutlinedInput
                            id="facebook-login"
                            type="text"
                            value={formData.facebook}
                            name="facebook"
                            onBlur={handleBlur}
                            onChange={(e) => handleInputChange(e, 'facebook')}
                            placeholder="Facebook Profile Link"
                            fullWidth
                            error={Boolean(touched.facebook && errors.facebook)}
                          />
                          {touched.facebook && errors.facebook && (
                            <FormHelperText error id="helper-text-facebook-signup">
                              {errors.facebook}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="youtube-signup">YouTube</InputLabel>
                          <OutlinedInput
                            id="youtube-login"
                            type="text"
                            value={formData.youtube}
                            name="youtube"
                            onBlur={handleBlur}
                            onChange={(e) => handleInputChange(e, 'youtube')}
                            placeholder="Youtube Profile Link"
                            fullWidth
                            error={Boolean(touched.youtube && errors.youtube)}
                          />
                          {touched.youtube && errors.youtube && (
                            <FormHelperText error id="helper-text-youtube-signup">
                              {errors.youtube}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="google-signup">Google</InputLabel>
                          <OutlinedInput
                            id="google-login"
                            type="text"
                            value={formData.google}
                            name="google"
                            onBlur={handleBlur}
                            onChange={(e) => handleInputChange(e, 'google')}
                            placeholder="Google Profile Link"
                            fullWidth
                            error={Boolean(touched.google && errors.google)}
                          />
                          {touched.google && errors.google && (
                            <FormHelperText error id="helper-text-google-signup">
                              {errors.google}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  )}
                  {/* {!artist && (
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
                          onChange={handleChange}
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
                        />
                        {touched.password && errors.password && (
                          <FormHelperText error id="helper-text-password-signup">
                            {errors.password}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  )} */}
                </Grid>
                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}
                <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Grid item>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircle />}
                      >
                        {artist ? <FormattedMessage id="update" /> : <FormattedMessage id="submit" />}
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item>
                    <AnimateButton>
                      <Button
                        disableElevation
                        fullWidth
                        size="large"
                        variant="outlined"
                        color="secondary"
                        startIcon={<CloseCircle />}
                        onClick={handleClose}
                      >
                        <FormattedMessage id="cancel" />
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  );
};

export default AddArtist;
