import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import * as yup from 'yup';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormLabel,
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material';

// third-party
import PhoneInput from 'react-phone-input-2';

// project-imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { facebookColor, instagramColor, spotifyColor, youtubeColor } from 'config';
import { ThemeMode } from 'config';
import useArtist from 'hooks/useArtist';
import useAdmin from 'hooks/useAdmin';

// assets
import { Youtube, Instagram, Spotify, Camera, Facebook, Google } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);
// ======================|| SOCIAL MEDIA ||==========================//

const SocialLinkInput = ({ network, placeholder, color, formData, handleInputChange }) => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [connect, setConnect] = useState('connect');

  const handleIsInputOpen = () => {
    setIsInputOpen(!isInputOpen);
    setConnect(isInputOpen ? 'connect' : 'close');
  };

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          size="small"
          startIcon={<network.icon variant="Bold" style={{ color }} />}
          sx={{ color, '&:hover': { bgcolor: 'transparent' } }}
        >
          {network.name}
        </Button>
        <Button color="error" onClick={handleIsInputOpen}>
          <FormattedMessage id={connect} />
        </Button>
      </Stack>
      {isInputOpen && (
        <TextField
          fullWidth
          value={formData && formData[network.key]}
          onChange={(e) => handleInputChange(e, network.key)}
          id={`personal-${network.key}`}
          placeholder={placeholder}
        />
      )}
    </Stack>
  );
};

SocialLinkInput.propTypes = {
  network: PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired
  }).isRequired,
  placeholder: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup
    .string()
    // .trim()
    // .matches(/^\+1\(\d{3}\)\d{3}-\d{4}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  careerStartDate: yup
    .date('Invalid Date')
    .required('Career start date is required')
    .max(new Date(), "Release date must be before or equal to today's date"),
  cityId: yup.string().required('City is required')
});

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const UpdateProfile = () => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState(avatarImage(`./default.jpeg`));
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    careerStartDate: '',
    cityId: '',
    bio: '',
    google: '',
    facebook: '',
    instagram: '',
    spotify: '',
    youtube: '',
    photoProfile: '',
    name: ''
  });
  const [artist, setArtist] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  // const [selectedCity, setSelectedCity] = useState(null);
  const { getArtistByEmail, updateArtist } = useArtist();
  const { getCountries, getCities } = useAdmin();

  console.log('user', user);
  console.log('formData', formData);
  console.log('artist', artist);
  console.log('countries', countries);
  console.log('cities', cities);
  console.log('selectedCountry', selectedCountry);
  console.log('selectedCity', formData.cityId);
  console.log('selectedImage', selectedImage);

  const socialNetworks = [
    { name: 'Google', key: 'google', icon: Google, color: theme.palette.error.main, placeholder: 'https://' },
    { name: 'YouTube', key: 'youtube', icon: Youtube, color: youtubeColor, placeholder: 'https://youtube.com/' },
    { name: 'Instagram', key: 'instagram', icon: Instagram, color: instagramColor, placeholder: 'https://instagram.com/' },
    { name: 'Spotify', key: 'spotify', icon: Spotify, color: spotifyColor, placeholder: 'https://spotify.com/' },
    { name: 'Facebook', key: 'facebook', icon: Facebook, color: facebookColor, placeholder: 'https://facebook.com/' }
  ];

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artist, countries] = await Promise.all([getArtistByEmail(user.email), getCountries()]);
        setArtist(artist);
        setCountries(countries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user.email]);

  useEffect(() => {
    if (artist) {
      setFormData({
        accountId: artist.id,
        email: artist.email,
        phoneNumber: artist.phoneNumber,
        artistId: artist.artistId,
        cityId: artist.cityId,
        bio: artist.bio,
        google: artist.google || '',
        facebook: artist.facebook || '',
        instagram: artist.instagram || '',
        spotify: artist.spotify || '',
        youtube: artist.youtube || '',
        photoProfile: artist.photoProfile,
        name: artist.name,
        firstName: artist.artistRealName.split(' ')[0],
        lastName: artist.artistRealName.split(' ')[1],
        careerStartDate: format(new Date(artist.careerStartDate), 'yyyy-MM-dd')
      });
    }
  }, [artist]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });

    validateField(fieldName, e.target.value);
  };

  const handlePhoneChange = (value, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });

    validateField(fieldName, value);
  };

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(validationSchema, fieldName).validate(value);
      setErrors({ ...errors, [fieldName]: null });
    } catch (error) {
      setErrors({ ...errors, [fieldName]: error.message });
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleCountryChange = async (event) => {
    const id = event.target.value;
    setSelectedCountry(id);
    const response = await getCities(id);
    setCities(response);
  };

  const handleCoverImageChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFormData({ ...formData, photoProfile: selectedFile });
    setSelectedImage(event.target.files?.[0]);
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const response = await updateArtist(formData);
      if (response) {
        window.location.href = '/artist/profile/basic';
      } else console.log(response);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title={<FormattedMessage id="personalInformations" />}>
          <Grid container spacing={3}>
            {/* photo */}
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
                        <FormattedMessage id="upload" />
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
              </Stack>
            </Grid>
            {/* first name */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-first-name">
                  <FormattedMessage id="firstName" />
                </InputLabel>
                <TextField
                  fullWidth
                  value={formData && formData.firstName}
                  onChange={(e) => handleInputChange(e, 'firstName')}
                  id="personal-first-name"
                  placeholder="First Name"
                  autoFocus
                />
                <FormHelperText style={{ color: 'red' }}>{errors['firstName']}</FormHelperText>
              </Stack>
            </Grid>
            {/* last name */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-first-name">
                  <FormattedMessage id="lastName" />
                </InputLabel>
                <TextField
                  fullWidth
                  value={formData && formData.lastName}
                  onChange={(e) => handleInputChange(e, 'lastName')}
                  id="personal-first-name"
                  placeholder="Last Name"
                />
                <FormHelperText style={{ color: 'red' }}>{errors['lastName']}</FormHelperText>
              </Stack>
            </Grid>
            {/* user name */}
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-username">
                  <FormattedMessage id="userName" />
                </InputLabel>
                <TextField
                  fullWidth
                  value={formData && formData.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  id="personal-username"
                  placeholder="Username"
                />
              </Stack>
            </Grid>
            {/* country */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="country-select">
                  <FormattedMessage id="country" />
                </InputLabel>
                <FormControl fullWidth>
                  <Select
                    value={selectedCountry || ''}
                    onChange={handleCountryChange}
                    inputProps={{ name: 'country', id: 'country-select' }}
                  >
                    <MenuItem value="" disabled>
                      Select Country
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            {/* city */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="city-autocomplete">
                  <FormattedMessage id="city" />
                </InputLabel>
                <Autocomplete
                  id="city-autocomplete"
                  options={cities}
                  getOptionLabel={(option) => option.name}
                  value={cities.find((city) => city.id === formData.cityId) || null}
                  onChange={(event, newValue) => handleInputChange({ target: { value: newValue?.id || '' } }, 'cityId')}
                  renderInput={(params) => <TextField {...params} placeholder="Select City" fullWidth />}
                  disabled={!selectedCountry}
                />
                <FormHelperText style={{ color: 'red' }}>{errors['cityId']}</FormHelperText>
              </Stack>
            </Grid>
            {/* bio */}
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-bio">
                  <FormattedMessage id="bio" />
                </InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={formData.bio ? formData.bio : ''}
                  onChange={(e) => handleInputChange(e, 'bio')}
                  id="personal-bio"
                  placeholder="Bio"
                />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title={<FormattedMessage id="socialNetwork" />}>
              <Stack spacing={1}>
                {socialNetworks.map((network) => (
                  <SocialLinkInput
                    key={network.key}
                    placeholder={network.name}
                    network={network}
                    color={network.color}
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                ))}
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title={<FormattedMessage id="contactInformations" />}>
              <Grid container spacing={3}>
                {/* phone number */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.25}>
                    <PhoneInput
                      fullWidth
                      id="phone-number"
                      name="phonenumber"
                      country={'ca'}
                      value={formData && formData.phoneNumber}
                      onChange={(value) => {
                        handlePhoneChange(value, 'phoneNumber');
                      }}
                      enableSearch={true}
                      autoFormat={true}
                      inputStyle={{ width: '100%', padding: '15px', borderRadius: '10px', marginTop: 6 }}
                      onBlur={() => {}}
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['phoneNumber']}</FormHelperText>
                  </Stack>
                </Grid>
                {/* email */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-email">
                      <FormattedMessage id="email" />
                    </InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={formData && formData.email}
                      onChange={(e) => handleInputChange(e, 'email')}
                      id="personal-email"
                      placeholder="Email Address"
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['email']}</FormHelperText>
                  </Stack>
                </Grid>
                {/* date */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>
                      <FormattedMessage id="Career_Start_Date" />
                    </InputLabel>
                    <TextField
                      type="date"
                      fullWidth
                      value={formData && formData.careerStartDate}
                      onChange={(e) => handleInputChange(e, 'careerStartDate')}
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['careerStartDate']}</FormHelperText>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            <FormattedMessage id="cancel" />
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            <FormattedMessage id="updateProfile" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default UpdateProfile;
