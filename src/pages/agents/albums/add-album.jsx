// material-ui
import {
  Grid,
  TextField,
  InputLabel,
  FormControl,
  Typography,
  FormHelperText,
  Select,
  MenuItem,
  Button,
  Stack,
  Chip,
  Box,
  OutlinedInput,
  FormLabel,
  CircularProgress,
  Fab,
  Tooltip,
  Backdrop
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { Camera, AddCircle } from 'iconsax-react';
import AlbumImage from './../../../assets/images/e-commerce/album.jpg';
import * as yup from 'yup';
import { ThemeMode } from 'config';
import useAlbums from 'hooks/useAlbums';
import useArtist from 'hooks/useArtist';
import { useParams, useNavigate } from 'react-router';
import { FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);
const today = new Date();

const validationSchema = yup.object().shape({
  Title: yup.string().required('Title is required'),
  Description: yup.string().required('Write some description first'),
  AlbumTypeId: yup.number().required('Album Type is required'),
  ArtistIds: yup
    .array()
    .of(yup.string())
    .min(1, 'At least you have to choose one artist')
    .required('At least you have to choose one artist'),
  CoverImage: yup.string().required('Cover Image is required'),
  ReleaseDate: yup
    .date()
    .required('Release date is required')
    .typeError('Invalid Date')
    .max(today, "Release date must be before or equal to today's date")
});

function AddNewAlbum() {
  const theme = useTheme();
  const history = useNavigate();
  const [albumTypes, setAlbumTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [errors, setErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  const [avatar, setAvatar] = useState(avatarImage(`./default_music.jpeg`));
  const { addAlbum, getAlbumTypes } = useAlbums();
  const { getArtistsByAgent } = useArtist();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = useParams();
  const [loading, setLoading] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    Title: '',
    Description: '',
    AlbumTypeId: '',
    ReleaseDate: '',
    CoverImage: null,
    ArtistIds: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumTypes, artists] = await Promise.all([getAlbumTypes(), getArtistsByAgent(user.userId)]);
        setAlbumTypes(albumTypes);
        artists ? setArtists(artists.$values) : setArtists([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      if (id && id.id != 0) {
        setNewAlbum((prevNewAlbum) => ({
          ...prevNewAlbum,
          ArtistIds: id ? [parseInt(id.id, 10)] || [] : []
        }));
      }
    };
    fetchData();
  }, []);

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
      await validationSchema.validate(newAlbum, { abortEarly: false });
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

  const handleAddClick = () => {
    history('/agent/artists');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAlbum((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  const handleInputArtist = (event, fieldName) => {
    setNewAlbum((prev) => ({ ...prev, [fieldName]: event.target.value }));
    validateField('ArtistIds', event.target.value);
  };
  const handleCoverImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setNewAlbum((prev) => ({ ...prev, CoverImage: selectedFile }));
    setCoverFile(selectedFile);
    validateField('CoverImage', selectedFile);
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const isValid = await validateForm();
    if (isValid) {
      const response = await addAlbum(newAlbum);
      setLoading(false);
      if (response === true) {
        window.location.href = '/agent/albums';
      } else {
        setErrors({ ...errors, ['Album']: response });
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coverFile) {
      setAvatar(URL.createObjectURL(coverFile));
    }
  }, [coverFile]);

  return (
    <>
      <MainCard>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <img src={AlbumImage} alt="add-album" style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Grid container spacing={1}>
                  {/* Cover Image */}
                  <Grid item xs={12}>
                    <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                      <FormLabel
                        htmlFor="change-avtar"
                        sx={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          '&:hover .MuiBox-root': { opacity: 1 },
                          cursor: 'pointer'
                        }}
                      >
                        <Avatar
                          alt="Avatar 1"
                          src={coverFile ? URL.createObjectURL(coverFile) : avatar}
                          sx={{
                            width: 200,
                            height: 100,
                            borderRadius: '8px'
                          }}
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
                    <FormHelperText style={{ color: 'red' }}>{errors['CoverImage']}</FormHelperText>
                  </Grid>
                  {/* Title */}
                  <Grid item xs={12}>
                    <InputLabel sx={{ mb: 1 }}>
                      <FormattedMessage id="Album_Title" />
                    </InputLabel>
                    <TextField name="Title" placeholder="Enter album title" fullWidth value={newAlbum.Title} onChange={handleInputChange} />
                    <FormHelperText style={{ color: 'red' }}>{errors['Title']}</FormHelperText>
                  </Grid>
                  {/* Description */}
                  <Grid item xs={12}>
                    <InputLabel sx={{ mb: 1 }}>
                      <FormattedMessage id="Album_Description" />
                    </InputLabel>
                    <TextField
                      name="Description"
                      placeholder="Enter description"
                      fullWidth
                      value={newAlbum.Description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                    />
                    <FormHelperText style={{ color: 'red' }}>{errors['Description']}</FormHelperText>
                  </Grid>
                  {/* Album Type */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="album-type" sx={{ mb: 1 }}>
                        <FormattedMessage id="Album_Type" />
                      </InputLabel>
                      <Select labelId="album-type" name="AlbumTypeId" value={newAlbum.AlbumTypeId} onChange={handleInputChange}>
                        {Array.isArray(albumTypes) && albumTypes.length > 0 ? (
                          albumTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            <FormattedMessage id="No_Album_Types_Available" />
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    <FormHelperText style={{ color: 'red' }}>{errors['AlbumTypeId']}</FormHelperText>
                  </Grid>
                  {/* Release Date */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>
                        {' '}
                        <FormattedMessage id="release_date" />
                      </InputLabel>
                      <TextField name="ReleaseDate" type="date" fullWidth value={newAlbum.ReleaseDate} onChange={handleInputChange} />
                      <FormHelperText style={{ color: 'red' }}>{errors['ReleaseDate']}</FormHelperText>
                    </Stack>
                  </Grid>
                  {/* Artists */}
                  <Grid item xs={11}>
                    <Stack spacing={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-multiple-chip-label">Artists</InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={newAlbum.ArtistIds}
                          onChange={(e) => handleInputArtist(e, 'ArtistIds')}
                          input={<OutlinedInput id="select-multiple-chip" placeholder="Chip" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((artistId) => {
                                const artist = artists.find((a) => a.artistId === artistId);
                                return (
                                  <Chip
                                    key={artistId}
                                    label={artist ? artist.artistRealName : 'Unknown'}
                                    variant="light"
                                    color="primary"
                                    size="small"
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {artists.map((artist) => (
                            <MenuItem key={artist.artistId} value={artist.artistId}>
                              {artist.artistRealName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormHelperText style={{ color: 'red' }}>{errors['ArtistIds']}</FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid item xs={1}>
                    <Tooltip title={<FormattedMessage id="addNewArtist" />} aria-label="add">
                      <Fab
                        color="primary"
                        onClick={handleAddClick}
                        aria-label="add"
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: '#007BFF'
                        }}
                      >
                        <AddCircle />
                      </Fab>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                      <FormattedMessage id="Create_Album" />
                    </Button>
                  </Grid>
                  <FormHelperText style={{ color: 'red' }}>{errors['Album']}</FormHelperText>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </form>
      </MainCard>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        open={loading}
      >
        <CircularProgress size={80} thickness={5} color="inherit" />
      </Backdrop>
    </>
  );
}

export default AddNewAlbum;
