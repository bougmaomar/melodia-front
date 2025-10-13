import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import * as yup from 'yup';

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
// import { facebookColor, instagramColor, spotifyColor, youtubeColor } from 'config';
import { ThemeMode } from 'config';
import useAgent from 'hooks/useAgent';
import useAdmin from 'hooks/useAdmin';

// assets
import { Camera } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';
import { useIntl, FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);

const validationSchema = yup.object().shape({
  firstName: yup.string().required(<FormattedMessage id="firstNameRequired" />),
  lastName: yup.string().required(<FormattedMessage id="lastNameRequired" />),
  email: yup
    .string()
    .email(<FormattedMessage id="invalidEmail" />)
    .required(<FormattedMessage id="emailRequired" />),
  phoneNumber: yup
    .string()
    // .matches(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number')
    .required(<FormattedMessage id="phoneNumberRequired" />),
  careerStartDate: yup
    .date(<FormattedMessage id="invalidDate" />)
    .required(<FormattedMessage id="startDateRequired" />)
    .max(new Date(), <FormattedMessage id="startDateBeforeToday" />),
  webSite: yup
    .string()
    .nullable()
    .notRequired()
    .test('is-url-or-empty', <FormattedMessage id="invalidUrl" />, (value) => {
      return !value || yup.string().url().isValidSync(value);
    })
});

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const TabPersonal = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
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
    webSite: '',
    careerStartDate: '',
    cityId: '',
    bio: '',
    photoProfile: ''
  });
  const [agent, setAgent] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const { getAgentByEmail, updateAgent } = useAgent();
  const { getCountries, getCities } = useAdmin();
  const { getCityById } = useAdmin();

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agent, countries] = await Promise.all([getAgentByEmail(user.email), getCountries()]);
        setAgent(agent);
        setCountries(countries);
        if (agent && agent.cityId) {
          const cityResponse = await getCityById(agent.cityId);
          setSelectedCity(cityResponse.id);
          setSelectedCountry(cityResponse.country.id);
          const response = await getCities(cityResponse.country.id);
          setCities(response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user.email]);

  useEffect(() => {
    if (agent) {
      setFormData({
        accountId: agent.id,
        email: agent.email,
        phoneNumber: agent.phoneNumber,
        // artistsNum: agent.artistsNum,
        webSite: agent.webSite,
        agentId: agent.agentId,
        cityId: agent.cityId,
        bio: agent.bio,
        photoProfile: agent.photoProfile,
        firstName: agent.agentRealName.split(' ')[0],
        lastName: agent.agentRealName.split(' ')[1],
        careerStartDate: format(new Date(agent.careerStartDate), 'yyyy-MM-dd')
      });
    }
  }, [agent]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });

    validateField(fieldName, e.target.value);
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

  const handlePhoneChange = (value, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });

    validateField(fieldName, value);
  };

  const handleCountryChange = async (event) => {
    const id = event.target.value;
    setSelectedCountry(id);
    console.log(id);
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
      const response = await updateAgent(formData);
      if (response) {
        window.location.href = '/agent/profile/basic';
      } else console.log(response);
    }
  };
  console.log('cities', cities);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title={formatMessage({ id: 'personalInformations' })}>
          <Grid container spacing={3}>
            {/* Profile photo */}
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
              </Stack>
            </Grid>
            {/* First Name */}
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
            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-last-name">
                  <FormattedMessage id="lastName" />
                </InputLabel>
                <TextField
                  fullWidth
                  value={formData && formData.lastName}
                  onChange={(e) => handleInputChange(e, 'lastName')}
                  id="personal-last-name"
                  placeholder="Last Name"
                />
                <FormHelperText style={{ color: 'red' }}>{errors['lastName']}</FormHelperText>
              </Stack>
            </Grid>
            {/* Country */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="country-select">
                  <FormattedMessage id="country" />
                </InputLabel>
                <FormControl fullWidth>
                  <Select
                    value={selectedCountry || ''}
                    placeholder="Country"
                    onChange={handleCountryChange}
                    inputProps={{ name: 'country', id: 'country-select' }}
                  >
                    <MenuItem value="" disabled>
                      <FormattedMessage id="selectCountry" />
                    </MenuItem>
                    {countries &&
                      countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                          {country.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            {/* City */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="city-autocomplete">
                  <FormattedMessage id="city" />
                </InputLabel>
                <Autocomplete
                  id="city-autocomplete"
                  options={cities}
                  getOptionLabel={(option) => option.name}
                  value={cities.find((city) => city.id === selectedCity) || null}
                  onChange={(event, newValue) => handleInputChange({ target: { value: newValue?.id || '' } }, 'cityId')}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={formatMessage({ id: 'selectCity' })} fullWidth disabled={!selectedCountry} />
                  )}
                  disabled={!selectedCountry}
                />
              </Stack>
            </Grid>
            {/* Bio */}
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-bio">
                  <FormattedMessage id="bio" />
                </InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
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
            <MainCard title={formatMessage({ id: 'contactInformations' })}>
              <Grid container spacing={3}>
                {/* Phone Number */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.25}>
                    {/* <InputLabel htmlFor="phone-number">
                        <FormattedMessage id="phoneNumber" /> *
                      </InputLabel> */}
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
                {/* Email */}
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
                      placeholder="Email"
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['email']}</FormHelperText>
                  </Stack>
                </Grid>
                {/* SiteWeb */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="web-site">
                      <FormattedMessage id="webSite" />
                    </InputLabel>
                    <TextField
                      type="text"
                      fullWidth
                      value={formData && formData.webSite}
                      onChange={(e) => handleInputChange(e, 'webSite')}
                      id="web-site"
                      placeholder={formatMessage({ id: 'webSite' })}
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['webSite']}</FormHelperText>
                  </Stack>
                </Grid>
                {/* Start Date */}
                <Grid item xs={12} md={12}>
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

export default TabPersonal;
