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
  InputLabel,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  Chip,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material';

// third-party
import PhoneInput from 'react-phone-input-2';

// project-imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import useStation from 'hooks/useSation';
import useAdmin from 'hooks/useAdmin';

// assets
import { Camera } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage, useIntl } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);
// ======================|| SOCIAL MEDIA ||==========================//

const validationSchema = yup.object().shape({
  stationName: yup.string().required('Station name is required'),
  stationOwner: yup.string().required('Station Owner is required'),
  stationTypeId: yup.string().required('Station Type Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup
    .string()
    // .matches(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  foundationDate: yup
    .date('Invalid Date')
    .required('Career start date is required')
    .max(new Date(), "Release date must be before or equal to today's date")
});

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const UpdateProfile = () => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState('');
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState(avatarImage(`./default.jpeg`));
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    description: '',
    cityId: '',
    logo: '',
    stationName: '',
    frequency: '',
    webSite: '',
    stationOwner: '',
    stationTypeId: 0,
    foundationDate: ''
  });
  const [station, setStation] = useState('');
  const [countries, setCountries] = useState([]);
  const [sTypes, setSTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const { getStationByEmail, updateStation } = useStation();
  const { getCountries, getCities, getStationType } = useAdmin();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [station, countries, sTypes] = await Promise.all([getStationByEmail(user.email), getCountries(), getStationType()]);
        setStation(station);
        setCountries(countries);
        setSTypes(sTypes.$values);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user.userId]);

  useEffect(() => {
    if (station) {
      const formattedDescription = station?.description?.replace(/<br \/>/g, '\n');
      setFormData({
        ...formData,
        accountId: station.id,
        email: station.email,
        phoneNumber: station.phoneNumber || '',
        description: formattedDescription || '',
        stationId: station.stationId,
        cityId: station.cityId,
        logo: station.logo || '',
        stationName: station.stationName || '',
        frequency: station.frequency || '',
        webSite: station.webSite || '',
        stationOwner: station.stationOwner || '',
        stationTypeId: station.stationTypeId || 0,
        foundationDate: format(new Date(station.foundationDate), 'yyyy-MM-dd')
      });
    }
  }, [station]);

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
    setFormData({ ...formData, logo: selectedFile });
    setSelectedImage(event.target.files?.[0]);
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const response = await updateStation(formData);
      if (response) {
        window.location.href = '/radio-station/profile/basic';
      } else console.log(response);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title={<FormattedMessage id="personalInformations" />}>
          <Grid container spacing={2}>
            {/* Logo */}
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
                    src={selectedImage ? URL.createObjectURL(selectedImage) : formData.logo ? `${API_MEDIA_URL}${formData.logo}` : avatar}
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
            {/* station Name */}
            <Grid item xs={12} sm={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-first-name">
                  <FormattedMessage id="stationName" /> :{' '}
                </InputLabel>
                <TextField
                  fullWidth
                  value={formData && formData.stationName}
                  onChange={(e) => handleInputChange(e, 'stationName')}
                  id="personal-first-name"
                  placeholder="First Name"
                  autoFocus
                />
                <FormHelperText style={{ color: 'red' }}>{errors['stationName']}</FormHelperText>
              </Stack>
            </Grid>
            {/* Station Owner */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-first-name">
                  <FormattedMessage id="stationOwner" /> :{' '}
                </InputLabel>
                <TextField
                  fullWidth
                  value={formData && formData.stationOwner}
                  onChange={(e) => handleInputChange(e, 'stationOwner')}
                  id="personal-first-name"
                  placeholder="Last Name"
                />
                <FormHelperText style={{ color: 'red' }}>{errors['stationOwner']}</FormHelperText>
              </Stack>
            </Grid>
            {/* Station Type */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="type-label">
                  <FormattedMessage id="type" /> :{' '}
                </InputLabel>
                <Select
                  id="type-label"
                  value={formData.stationTypeId || ''}
                  onChange={(e) => handleInputChange(e, 'stationTypeId')}
                  renderValue={() => {
                    const selectedType = sTypes.find((type) => type.id.toString() === formData.stationTypeId?.toString());
                    return (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {selectedType ? <Chip label={selectedType.name} variant="light" color="primary" size="small" /> : 'Unknown'}
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="" disabled>
                    <FormattedMessage id="selectType" />
                  </MenuItem>
                  {sTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            {/* Country */}
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="country-select">
                  <FormattedMessage id="country" />
                </InputLabel>
                <Select
                  id="country-select"
                  value={selectedCountry || ''}
                  onChange={handleCountryChange}
                  inputProps={{ name: 'country', id: 'country-select' }}
                >
                  <MenuItem value="" disabled>
                    <FormattedMessage id="selectCountry" />
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
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
                  value={cities.find((city) => city.id === formData.cityId) || null}
                  onChange={(event, newValue) => handleInputChange({ target: { value: newValue?.id || '' } }, 'cityId')}
                  renderInput={(params) => <TextField {...params} placeholder="Select City" fullWidth />}
                  disabled={!selectedCountry}
                />
              </Stack>
            </Grid>
            {/* Description */}
            <Grid item xs={12} sm={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="description">
                  <FormattedMessage id="about_station" /> :{' '}
                </InputLabel>
                <TextField
                  id="description"
                  fullWidth
                  multiline
                  minRows={3}
                  value={formData && formData.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  placeholder={formatMessage({ id: 'about_station' })}
                />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title={<FormattedMessage id="contactInformations" />}>
              <Grid container spacing={3}>
                {/* Phone number */}
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
                      placeholder="Email Address"
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['email']}</FormHelperText>
                  </Stack>
                </Grid>
                {/* Start career */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>
                      <FormattedMessage id="Career_Start_Date" />
                    </InputLabel>
                    <TextField
                      type="date"
                      fullWidth
                      value={formData && formData.foundationDate}
                      onChange={(e) => handleInputChange(e, 'foundationDate')}
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['foundationDate']}</FormHelperText>
                  </Stack>
                </Grid>
                {/* WebSite */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="webSite">
                      <FormattedMessage id="webSite" /> :{' '}
                    </InputLabel>
                    <TextField
                      type="text"
                      fullWidth
                      value={formData && formData.webSite}
                      onChange={(e) => handleInputChange(e, 'webSite')}
                      id="webSite"
                      placeholder="radio.com"
                    />
                    {/* <FormHelperText style={} */}
                  </Stack>
                </Grid>
                {/* Frequency */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="frequency">
                      <FormattedMessage id="frequency" /> :{' '}
                    </InputLabel>
                    <TextField
                      type="text"
                      fullWidth
                      value={formData && formData.frequency}
                      onChange={(e) => handleInputChange(e, 'frequency')}
                      id="frequency"
                      placeholder="101 FM"
                    />
                    {/* <FormHelperText style={} */}
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
