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
  FormLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { Camera } from 'iconsax-react';
import AlbumImage from './../../../assets/images/e-commerce/album.jpg';
import * as yup from 'yup';
import { ThemeMode } from 'config';
import { API_MEDIA_URL } from 'config';
import useAlbums from 'hooks/useAlbums';
import useAdmin from 'hooks/useAdmin';
import { FormattedMessage } from 'react-intl';
import { formatDate1 } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);
const today = new Date();

const validationSchema = yup.object().shape({
  Title: yup.string().required(<FormattedMessage id="requiredTitle" />),
  Description: yup.string().required(<FormattedMessage id="requiredDescription" />),
  AlbumTypeId: yup.number().required(<FormattedMessage id="requiredAlbumType" />),
  ArtistIds: yup
    .array()
    .of(yup.string())
    .min(1, <FormattedMessage id="atLeastOneArtist" />)
    .required(<FormattedMessage id="atLeastOneArtist" />),
  // CoverImage: yup.string().required(<FormattedMessage id="requiredCoverImage" />),
  ReleaseDate: yup
    .date()
    .required(<FormattedMessage id="requiredReleaseDate" />)
    .typeError(<FormattedMessage id="invalidDate" />)
    .max(today, <FormattedMessage id="releaseDateBeforeToday" />)
});

function ModifyAlbum() {
  const { id } = useParams();
  const theme = useTheme();
  const [albumTypes, setAlbumTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [errors, setErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  const [showingCover, setShowingCover] = useState();
  const [avatar, setAvatar] = useState(avatarImage(`./default_music.jpeg`));
  const { updateAlbum, getAlbumTypes, getUpdatedAlbumById } = useAlbums();
  const { getArtists } = useAdmin();
  const [updatedAlbum, setUpdatedAlbum] = useState({
    Id: parseInt(id),
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
        const [album, albumTypes, artists] = await Promise.all([getUpdatedAlbumById(id), getAlbumTypes(), getArtists()]);

        setAlbumTypes(albumTypes);
        setArtists(artists);

        if (album) {
          setUpdatedAlbum((prevFormData) => ({
            ...prevFormData,
            Title: album ? album.title : '',
            Description: album ? album.description : '',
            AlbumTypeId: album && album.albumTypeId,
            ReleaseDate: album ? formatDate1(album.releaseDate) || '' : '',
            // CoverImage: album && album.coverImage,
            ArtistIds: album ? album.artistIds.$values || [] : []
          }));
          setShowingCover(album.coverImage);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (coverFile) {
      setAvatar(URL.createObjectURL(coverFile));
    }
  }, [coverFile]);

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(validationSchema, fieldName).validate(value);
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error.message }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(updatedAlbum, { abortEarly: false });
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedAlbum((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleInputArtist = (event, fieldName) => {
    setUpdatedAlbum((prev) => ({ ...prev, [fieldName]: event.target.value }));
    validateField('ArtistIds', event.target.value);
  };

  const handleCoverImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setUpdatedAlbum((prev) => ({ ...prev, CoverImage: selectedFile }));
      setCoverFile(selectedFile);
      // validateField('CoverImage', selectedFile);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const response = await updateAlbum(parseInt(id), updatedAlbum);
      if (response === true) {
        window.location.href = '/artist/albums';
      } else {
        setErrors((prev) => ({ ...prev, Album: response }));
      }
    }
  };

  return (
    <>
      <MainCard>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <img src={AlbumImage} alt="modify-album" style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Grid container spacing={1} direction="column">
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
                          src={coverFile ? URL.createObjectURL(coverFile) : showingCover ? `${API_MEDIA_URL}${showingCover}` : avatar}
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
                    {/* <FormHelperText style={{ color: 'red' }}>{errors['CoverImage']}</FormHelperText> */}
                  </Grid>
                  {/* Title */}
                  <Grid item xs={12}>
                    <InputLabel sx={{ mb: 1 }}>
                      <FormattedMessage id="Album_Title" />
                    </InputLabel>
                    <TextField
                      name="Title"
                      placeholder="Enter album title"
                      fullWidth
                      value={updatedAlbum.Title}
                      onChange={handleInputChange}
                    />
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
                      value={updatedAlbum.Description}
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
                      <Select labelId="album-type" name="AlbumTypeId" value={updatedAlbum.AlbumTypeId} onChange={handleInputChange}>
                        {Array.isArray(albumTypes) && albumTypes.length > 0 ? (
                          albumTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            <FormattedMessage id="No Album Types Available" />
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    <FormHelperText style={{ color: 'red' }}>{errors['AlbumTypeId']}</FormHelperText>
                  </Grid>
                  {/* Release Date */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel>
                        <FormattedMessage id="release_date" />
                      </InputLabel>
                      <TextField name="ReleaseDate" type="date" fullWidth value={updatedAlbum.ReleaseDate} onChange={handleInputChange} />
                      <FormHelperText style={{ color: 'red' }}>{errors['ReleaseDate']}</FormHelperText>
                    </Stack>
                  </Grid>
                  {/* Artists */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-multiple-chip-label">
                          <FormattedMessage id="artists" />
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={updatedAlbum.ArtistIds}
                          onChange={(e) => handleInputArtist(e, 'ArtistIds')}
                          input={<OutlinedInput id="select-multiple-chip" placeholder="Chip" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((artistId) => {
                                const artist = artists.find((a) => String(a.artistId) === String(artistId));
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
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                      <FormattedMessage id="updateAlbum" />
                    </Button>
                  </Grid>
                  <FormHelperText style={{ color: 'red' }}>{errors['Album'] && JSON.stringify(errors['Album'])}</FormHelperText>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </>
  );
}

export default ModifyAlbum;
