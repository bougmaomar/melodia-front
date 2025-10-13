import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import * as yup from 'yup';
// material-ui
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Select,
  OutlinedInput,
  Box,
  Chip,
  Button,
  Typography,
  FormLabel,
  Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Camera } from 'iconsax-react';
import { ThemeMode, API_MEDIA_URL } from 'config';
import MainCard from 'components/MainCard';
import useAdmin from 'hooks/useAdmin';
import useAlbums from 'hooks/useAlbums';
import useSongs from 'hooks/useSongs';
import { FormattedMessage, useIntl } from 'react-intl';
import AudioUploadPlayer from 'sections/apps/songs/AudioPlayer';
import useArtist from 'hooks/useArtist';
import { formatDate1 } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);
const today = new Date();

function ModifySong() {
  //   const filter = createFilterOptions();
  const { id } = useParams();
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const intl = useIntl();
  const theme = useTheme();
  const [avatar, setAvatar] = useState(avatarImage(`./default_music.jpeg`));
  const [showingCover, setShowingCover] = useState();
  const { getLanguages, getGenreMusics } = useAdmin();
  const { getAlbums } = useAlbums();
  const { getArtistsByAgent } = useArtist();
  const [errors, setErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  const [isPlayingMp3, setIsPlayingMp3] = useState(false);
  const [isPlayingOgg, setIsPlayingOgg] = useState(false);
  const audioRefMp3 = useRef(null);
  const audioRefOgg = useRef(null);
  const { getOneSong, getWriters, getCROwners, getComposers, addComposer, addWriter, addCROwner, updateSong } = useSongs();
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [composers, setComposers] = useState([]);
  const [writers, setWriters] = useState([]);
  const [cROwners, setCROwners] = useState([]);

  const validationSchema = yup.object().shape({
    Title: yup.string().required('Title is required'),
    CodeISRC: yup.string().required('CodeISRC is required'),
    LanguageIds: yup.array().of(yup.string()).min(1, 'At least you have to choose one language').required('Language is required'),
    GenreMusicId: yup.number().required('Genre Music is required'),
    ArtistIds: yup
      .array()
      .of(yup.string())
      .min(1, 'At least you have to choose one artist')
      .required('At least you have to choose one artist'),
    ComposerIds: yup
      .array()
      .of(yup.string())
      .min(1, 'At least you have to choose one composer')
      .required('At least you have to choose one composer'),
    WriterIds: yup
      .array()
      .of(yup.string())
      .min(1, 'At least you have to choose one writer')
      .required('At least you have to choose one writer'),
    CopyrightOwnerIds: yup
      .array()
      .of(yup.string())
      .min(1, 'At least you have to choose one copy right owner')
      .required('At least you have to choose one copy right owner'),
    CoverImage: yup.string().required('Cover Image is required'),
    WavFile: yup.mixed().required('WAV Audio file is required'),
    AudioFile: yup.mixed().required('MP3 Audio file is required'),
    ReleaseDate: yup
      .date()
      .required('Release date is required')
      .typeError('Invalid Date')
      .max(today, "Release date must be before or equal to today's date"),

    PlatformReleaseDate: yup
      .date()
      .required('Platform Release date is required')
      .typeError('Invalid Date')
      .max(today, "Release date must be before or equal to today's date"),
    YouTube: yup.string().url(intl.formatMessage({ id: 'invalidUrl' })),
    Spotify: yup.string().url(intl.formatMessage({ id: 'invalidUrl' }))
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [song, languages, genres, albums, artists, composers, cROwners, writers] = await Promise.all([
          getOneSong(id),
          getLanguages(),
          getGenreMusics(),
          getAlbums(),
          getArtistsByAgent(user.userId),
          getComposers(),
          getCROwners(),
          getWriters()
        ]);
        setLanguages(languages);
        setGenres(genres);
        setAlbums(albums);
        const artistsArray = artists?.$values || [];
        setArtists(artistsArray);
        setComposers(composers);
        setCROwners(cROwners);
        setWriters(writers);

        if (song) {
          const formattedLyrics = song.lyrics.replace(/<br \/>/g, '\n');
          setFormData((prevFormData) => ({
            ...prevFormData,
            Title: song.title || '',
            CodeISRC: song ? song.codeISRC || '' : '',
            ReleaseDate: song ? formatDate1(song.releaseDate) || '' : '',
            PlatformReleaseDate: song ? formatDate1(song.platformReleaseDate) || '' : '',
            Lyrics: song ? formattedLyrics || '' : '',
            IsMapleMusic: song ? song.isMapleMusic || false : false,
            IsMapleArtist: song ? song.isMapleArtist || false : false,
            IsMapleLyrics: song ? song.isMapleLyrics || false : false,
            IsMaplePerformance: song ? song.isMaplePerformance || false : false,
            LanguageIds: song ? song.languageIds.$values || [] : [],
            GenreMusicId: song ? song.genreMusicId || '' : '',
            AlbumId: song ? song.albumId || '' : '',
            ArtistIds: song ? song.artistIds.$values || [] : [],
            ComposerIds: song ? song.composersIds.$values || [] : [],
            WriterIds: song ? song.writersIds.$values || [] : [],
            CopyrightOwnerIds: song ? song.crOwnersIds.$values || [] : [],
            CoverImage: song ? song.coverImagePath || null : null,
            WavFile: song ? song.wavFilePath || null : null,
            AudioFile: song ? song.mp3FilePath || null : null,
            Facebook: song ? song.facebook || '' : '',
            Twitter: song ? song.twitter || '' : '',
            Instagram: song ? song.instagram || '' : '',
            YouTube: song ? song.youtube || '' : '',
            Spotify: song ? song.spotify || '' : ''
          }));
          setShowingCover(song.coverImagePath);
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

  const [formData, setFormData] = useState({
    Title: '',
    CodeISRC: '',
    ReleaseDate: '',
    PlatformReleaseDate: '',
    Lyrics: '',
    IsMapleMusic: false,
    IsMapleArtist: false,
    IsMapleLyrics: false,
    IsMaplePerformance: false,
    LanguageIds: [],
    GenreMusicId: '',
    AlbumId: '',
    ArtistIds: [],
    ComposerIds: [],
    WriterIds: [],
    CopyrightOwnerIds: [],
    CoverImage: null,
    WavFile: null,
    AudioFile: null,
    Facebook: '',
    Twitter: '',
    Instagram: '',
    YouTube: '',
    Spotify: ''
  });

  const handleInputChange = (event, fieldName) => {
    setFormData({ ...formData, [fieldName]: event.target.value });
    validateField(fieldName, event.target.value);
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

  const handleCheckboxChange = (event, fieldName) => {
    setFormData({ ...formData, [fieldName]: event.target.checked });
  };

  const handleCoverImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFormData({ ...formData, CoverImage: selectedFile });
    validateField('CoverImage', selectedFile);
    setCoverFile(selectedFile);
  };

  const handleFileChange = (event, fieldName) => {
    const selectedFile = event.target.files[0];
    setFormData((prevData) => ({ ...prevData, [fieldName]: selectedFile }));
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null }));
    validateField(fieldName, selectedFile);
  };

  const handlePlayPause = (audioRef, isPlaying, setIsPlaying) => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      const response = await updateSong(id, formData);
      if (response) {
        window.location.href = `/agent/songs-details/${id}`;
      } else {
        console.log('failed');
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<FormattedMessage id="Modify_Song" />}>
            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <TextField
                    fullWidth
                    placeholder={<FormattedMessage id="enterTitle" />}
                    value={formData.Title}
                    onChange={(e) => handleInputChange(e, 'Title')}
                  />
                  <FormHelperText style={{ color: 'red' }}>{errors['Title']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Code CSRE */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField
                    fullWidth
                    placeholder={<FormattedMessage id="enterCode" />}
                    value={formData.CodeISRC}
                    onChange={(e) => handleInputChange(e, 'CodeISRC')}
                  />
                  <FormHelperText style={{ color: 'red' }}>{errors['CodeISRC']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Album */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="album-label">Album</InputLabel>
                    <Select labelId="album-label" value={formData.AlbumId} onChange={(e) => handleInputChange(e, 'AlbumId')}>
                      {albums.map((album) => (
                        <MenuItem key={album.id} value={album.id}>
                          {album.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              {/* Release Date */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>
                    <FormattedMessage id="release_date" />
                  </InputLabel>
                  <TextField type="date" fullWidth value={formData.ReleaseDate} onChange={(e) => handleInputChange(e, 'ReleaseDate')} />
                  <FormHelperText style={{ color: 'red' }}>{errors['ReleaseDate']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Platform Release Date */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel>
                    <FormattedMessage id="platform_release_date" />
                  </InputLabel>
                  <TextField
                    type="date"
                    fullWidth
                    value={formData.PlatformReleaseDate}
                    onChange={(e) => handleInputChange(e, 'PlatformReleaseDate')}
                  />
                  <FormHelperText style={{ color: 'red' }}>{errors['PlatformReleaseDate']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Genre music */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="genre-label">
                      <FormattedMessage id="musicGenre" />
                    </InputLabel>
                    <Select labelId="genre-label" value={formData.GenreMusicId} onChange={(e) => handleInputChange(e, 'GenreMusicId')}>
                      {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText style={{ color: 'red' }}>{errors['GenreMusicId']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Language */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-chip-label">
                      <FormattedMessage id="languages" />
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={formData.LanguageIds}
                      onChange={(e) => handleInputChange(e, 'LanguageIds')}
                      input={<OutlinedInput id="select-multiple-chip" placeholder="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((languageId) => {
                            const language = languages.find((a) => a.id === languageId);
                            return (
                              <Chip
                                key={languageId}
                                label={language ? language.label : 'Unknown'}
                                variant="light"
                                color="primary"
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {languages.map((language) => (
                        <MenuItem key={language.id} value={language.id}>
                          {language.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText style={{ color: 'red' }}>{errors['LanguageIds']}</FormHelperText>
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
                      value={formData.ArtistIds}
                      onChange={(e) => handleInputChange(e, 'ArtistIds')}
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
              {/* Composers */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      id="demo-multiple-chip-composers"
                      options={composers}
                      value={formData.ComposerIds.map((id) => composers.find((c) => c.id === id))}
                      onChange={(e, newValue) => {
                        newValue.forEach((option) => {
                          if (option && option.name && !option.id) {
                            const newComposer = { name: option.name };
                            addComposer(newComposer).then((res) => {
                              if (res.id) {
                                getComposers().then((updatedComposers) => {
                                  setComposers(updatedComposers);
                                });
                                const updatedComposerIds = [...formData.ComposerIds, res.id];
                                handleInputChange({ target: { value: updatedComposerIds } }, 'ComposerIds');
                              } else {
                                console.error('Failed to add composer:', res.error);
                              }
                            });
                          }
                        });
                        handleInputChange({ target: { value: newValue.map((option) => option.id) } }, 'ComposerIds');
                      }}
                      filterOptions={(options, params) => {
                        const filtered = options.filter((option) => {
                          return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                        });

                        if (
                          params.inputValue !== '' &&
                          !filtered.some((option) => option.name.toLowerCase() === params.inputValue.toLowerCase())
                        ) {
                          filtered.push({ name: params.inputValue });
                        }
                        return filtered;
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Composers" />}
                      getOptionLabel={(option) => (option && option.name ? option.name : '')}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          if (option && typeof option === 'object' && 'name' in option) {
                            return <Chip key={option.id} label={option.name} {...getTagProps({ index })} />;
                          } else {
                            return <Chip key={option} label={option} {...getTagProps({ index })} />;
                          }
                        })
                      }
                    />
                  </FormControl>
                  <FormHelperText style={{ color: 'red' }}>{errors['ComposerIds']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Writers */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      id="demo-multiple-chip-writers"
                      options={writers}
                      value={formData.WriterIds.map((id) => writers.find((c) => c.id === id))}
                      onChange={(e, newValue) => {
                        newValue.forEach((option) => {
                          if (option && option.name && !option.id) {
                            const newWriter = { name: option.name };
                            addWriter(newWriter).then((res) => {
                              if (res.id) {
                                getWriters().then((updatedWriters) => {
                                  setWriters(updatedWriters);
                                });
                                const updatedWriterIds = [...formData.WriterIds, res.id];
                                handleInputChange({ target: { value: updatedWriterIds } }, 'WriterIds');
                              } else {
                                console.error('Failed to add writer:', res.error);
                              }
                            });
                          }
                        });
                        handleInputChange({ target: { value: newValue.map((option) => option.id) } }, 'WriterIds');
                      }}
                      filterOptions={(options, params) => {
                        const filtered = options.filter((option) => {
                          return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                        });

                        if (
                          params.inputValue !== '' &&
                          !filtered.some((option) => option.name.toLowerCase() === params.inputValue.toLowerCase())
                        ) {
                          filtered.push({ name: params.inputValue });
                        }
                        return filtered;
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Writers" />}
                      getOptionLabel={(option) => (option && option.name ? option.name : '')}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          if (option && typeof option === 'object' && 'name' in option) {
                            return <Chip key={option.id} label={option.name} {...getTagProps({ index })} />;
                          } else {
                            return <Chip key={option} label={option} {...getTagProps({ index })} />;
                          }
                        })
                      }
                    />
                  </FormControl>
                  <FormHelperText style={{ color: 'red' }}>{errors['WriterIds']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Copyright Owners */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      id="demo-multiple-chip-copyright-owner"
                      options={cROwners}
                      value={formData.CopyrightOwnerIds.map((id) => cROwners.find((c) => c.id === id))}
                      onChange={(e, newValue) => {
                        newValue.forEach((option) => {
                          if (option && option.name && !option.id) {
                            const newCROwner = { name: option.name };
                            addCROwner(newCROwner).then((res) => {
                              if (res.id) {
                                getCROwners().then((updatedCROwers) => {
                                  setCROwners(updatedCROwers);
                                });
                                const updatedCROwnerIds = [...formData.CopyrightOwnerIds, res.id];
                                handleInputChange({ target: { value: updatedCROwnerIds } }, 'CopyrightOwnerIds');
                              } else {
                                console.error('Failed to add copyright Owner:', res.error);
                              }
                            });
                          }
                        });
                        handleInputChange({ target: { value: newValue.map((option) => option.id) } }, 'CopyrightOwnerIds');
                      }}
                      filterOptions={(options, params) => {
                        const filtered = options.filter((option) => {
                          return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                        });

                        if (
                          params.inputValue !== '' &&
                          !filtered.some((option) => option.name.toLowerCase() === params.inputValue.toLowerCase())
                        ) {
                          filtered.push({ name: params.inputValue });
                        }
                        return filtered;
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Copyright Owner" />}
                      getOptionLabel={(option) => (option && option.name ? option.name : '')}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          if (option && typeof option === 'object' && 'name' in option) {
                            return <Chip key={option.id} label={option.name} {...getTagProps({ index })} />;
                          } else {
                            return <Chip key={option} label={option} {...getTagProps({ index })} />;
                          }
                        })
                      }
                    />
                  </FormControl>
                  <FormHelperText style={{ color: 'red' }}>{errors['CopyrightOwnerIds']}</FormHelperText>
                </Stack>
              </Grid>
              {/* Youtube */}
              {/* <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField fullWidth placeholder={'YouTube'} value={formData.YouTube} onChange={(e) => handleInputChange(e, 'YouTube')} />
                  <FormHelperText style={{ color: 'red' }}>{errors['YouTube']}</FormHelperText>
                </Stack>
              </Grid> */}
              {/* Spotify */}
              {/* <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField fullWidth placeholder={'Spotify'} value={formData.Spotify} onChange={(e) => handleInputChange(e, 'Spotify')} />
                  <FormHelperText style={{ color: 'red' }}>{errors['Spotify']}</FormHelperText>
                </Stack>
              </Grid> */}
              {/* Is Maple Music Checkbox */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={<Checkbox checked={formData.IsMapleMusic} onChange={(e) => handleCheckboxChange(e, 'IsMapleMusic')} />}
                    label="Is Maple Music (la musique doit être composée entièrement par un Canadien)"
                  />
                </Stack>
              </Grid>
              {/* Is Maple lyrics Checkbox */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={<Checkbox checked={formData.IsMapleLyrics} onChange={(e) => handleCheckboxChange(e, 'IsMapleLyrics')} />}
                    label="Is Maple Lyrics (les paroles sont écrites entièrement par un Canadien)"
                  />
                </Stack>
              </Grid>
              {/* Is Maple artist Checkbox */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={<Checkbox checked={formData.IsMapleArtist} onChange={(e) => handleCheckboxChange(e, 'IsMapleArtist')} />}
                    label="Is Maple Artist (la musique ou les paroles sont interprétées principalement par un Canadien)"
                  />
                </Stack>
              </Grid>
              {/* Is Maple performanse Checkbox */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={formData.IsMaplePerformance} onChange={(e) => handleCheckboxChange(e, 'IsMaplePerformance')} />
                    }
                    label="Is Maple Performance (la pièce est enregistrée en entier au Canada)"
                  />
                </Stack>
              </Grid>
              {/* Lyrics */}
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel>
                    <FormattedMessage id="lyrics" />
                  </InputLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Enter lyrics"
                    value={formData.Lyrics}
                    onChange={(e) => handleInputChange(e, 'Lyrics')}
                  />
                </Stack>
              </Grid>
              {/* Cover Image Upload */}
              <Grid item xs={12} md={4}>
                <Typography color="error.main">
                  *{' '}
                  <Typography component="span" color="textSecondary">
                    <FormattedMessage id="Cover_Image" />
                  </Typography>
                </Typography>
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
                <FormHelperText style={{ color: 'red' }}>{errors['CoverImage']}</FormHelperText>
              </Grid>

              {/* MP3 Upload */}
              <AudioUploadPlayer
                label="Audio_Path"
                file={formData.AudioFile}
                onFileChange={(event) => handleFileChange(event, 'AudioFile')}
                error={errors.AudioFile}
                isPlaying={isPlayingMp3}
                onPlayPause={() => handlePlayPause(audioRefMp3, isPlayingMp3, setIsPlayingMp3)}
                audioRef={audioRefMp3}
              />
              {/* OGG Upload */}
              <AudioUploadPlayer
                label="Audio_Path_(OGG)"
                file={formData.WavFile}
                onFileChange={(event) => handleFileChange(event, 'WavFile')}
                error={errors.WavFile}
                isPlaying={isPlayingOgg}
                onPlayPause={() => handlePlayPause(audioRefOgg, isPlayingOgg, setIsPlayingOgg)}
                audioRef={audioRefOgg}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Button type="submit" variant="contained" color="primary">
                <FormattedMessage id="Modify_Song" />
              </Button>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </form>
  );
}

export default ModifySong;
