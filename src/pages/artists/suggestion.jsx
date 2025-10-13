import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import MainCard from 'components/MainCard';
import useSongs from 'hooks/useSongs';
import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import { useEffect, useState } from 'react';
import defaultImage from 'assets/images/regsiter/station.jpeg';
import { API_MEDIA_URL } from 'config';
import { useIntl, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { extractMinutesSeconds, formatDate1 } from 'utils/globals/functions';

const validationSchema = yup.object({
  song: yup.string().required('Song selection is required'),
  station: yup.string().required('Station selection is required'),
  description: yup.string().required('Write something here')
});

const Suggestion = () => {
  const { stationid } = useParams();
  const { getArtistSongs } = useSongs();
  const { getStations, proposeSong, proposeSongAllStations } = useStation();
  const { getAllProposalsByArtist } = useProposals();
  const [artistSongs, setArtistSongs] = useState([]);
  const [stations, setStations] = useState([]);
  const [oldProposals, setOldProposals] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const { formatMessage } = useIntl();
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songs, stats, props] = await Promise.all([getArtistSongs(user.email), getStations(), getAllProposalsByArtist(user.userId)]);

        const allStationsOption = {
          $id: '0',
          id: 'all',
          stationId: 'all',
          logo: null,
          stationName: 'Toutes les stations',
          stationTypeId: 0,
          frequency: '',
          stationOwner: '',
          email: '',
          description: ''
        };

        setArtistSongs(songs);
        setStations([allStationsOption, ...stats]);
        setOldProposals(props);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user.email]);

  const handlerCreate = async (values) => {
    if (values.station === 'all' || Number(values.station) === 0) {
      await proposeSongAllStations(values.artist, values.song, values.description);
      window.location.href = '/artist/songs';
    } else {
      const res = await proposeSong(values.artist, values.station, values.song, values.description);
      if (res === true) {
        window.location.href = '/artist/songs';
      }
    }
  };

  return (
    <MainCard>
      <Formik
        initialValues={{
          id: 120,
          artist: user.userId,
          song: '',
          station: stationid && Number(stationid) !== 0 ? String(stationid) : '',
          description: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ errors, handleSubmit, values, touched, setFieldValue }) => {
          const handleSongChange = (event) => {
            const selectedId = event.target.value;
            const selectedSong = artistSongs.find((song) => song.id === selectedId);
            setSelectedSong(selectedSong);
            setFieldValue('song', selectedId);
          };

          const handleStationChange = (event) => {
            const selectedId = String(event.target.value);
            const station = stations.find((s) => String(s.stationId) === selectedId);
            setSelectedStation(station);
            setFieldValue('station', selectedId);
          };
          const handleDescriptionChange = (event) => {
            const selected = event.target.value;
            setFieldValue('description', selected);
          };
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item sm={9} container spacing={2} justifyContent="space-between">
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={2}>
                      <InputLabel>
                        <FormattedMessage id="songs" />
                      </InputLabel>
                      <FormControl sx={{ width: '100%' }}>
                        <Select
                          value={values.song}
                          displayEmpty
                          name="song"
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <Box sx={{ color: 'secondary.400' }}>
                                  <FormattedMessage id="select" />
                                </Box>
                              );
                            }
                            const song = artistSongs.find((song) => song.id === selected);
                            return song ? song.title : selected;
                          }}
                          onChange={handleSongChange}
                          error={Boolean(errors.song && touched.song)}
                        >
                          <MenuItem disabled value="">
                            <FormattedMessage id="select" />
                          </MenuItem>
                          {artistSongs &&
                            artistSongs.map((song, index) => (
                              <MenuItem key={index} value={song.id}>
                                {song.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    {touched.song && errors.song && <FormHelperText error={true}>{errors.song}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={2}>
                      <InputLabel>Station</InputLabel>
                      <FormControl sx={{ width: '100%' }}>
                        <Select
                          value={values.station}
                          displayEmpty
                          name="station"
                          renderValue={(selected) => {
                            if (!selected) {
                              return (
                                <Box sx={{ color: 'secondary.400' }}>
                                  <FormattedMessage id="Select_station" />
                                </Box>
                              );
                            }
                            const station = stations.find((s) => String(s.stationId) === String(selected));
                            // station && setSelectedStation(station);
                            return station ? station.stationName : selected;
                          }}
                          onChange={handleStationChange}
                          error={Boolean(errors.station && touched.station)}
                        >
                          <MenuItem disabled value="">
                            <FormattedMessage id="Select_station" />
                          </MenuItem>
                          {stations &&
                            stations.map((station, index) => (
                              <MenuItem key={index} value={station.stationId}>
                                {station.stationName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    {touched.station && errors.station && <FormHelperText error={true}>{errors.station}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {false && (
                      <Stack spacing={2}>
                        <InputLabel>
                          <FormattedMessage id="artist" />
                        </InputLabel>
                        <FormControl sx={{ width: '100%' }}>
                          <TextField required disabled type="text" name="artist" id="artist" value={user.name} />
                        </FormControl>
                      </Stack>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <Stack spacing={2}>
                            <Typography variant="h5">
                              <FormattedMessage id="Send" />
                            </Typography>
                            <Stack sx={{ width: '100%' }}>
                              {selectedSong ? (
                                <>
                                  <Grid container spacing={2}>
                                    <Grid item md={6}>
                                      <Box
                                        component="img"
                                        sx={{
                                          width: '100%',
                                          height: '140px',
                                          objectFit: 'cover',
                                          borderRadius: 1
                                        }}
                                        alt="song cover"
                                        src={selectedSong.coverImagePath && `${API_MEDIA_URL}${selectedSong.coverImagePath}`}
                                      />
                                    </Grid>
                                    <Grid item md={6}>
                                      <br />
                                      <Typography variant="subtitle1">{selectedSong.title}</Typography>
                                      <Typography color="secondary">Artist: {user.name}</Typography>
                                      <Typography color="secondary">Type: {selectedSong.genreMusicName}</Typography>
                                      <Typography color="secondary">
                                        <FormattedMessage id="language" />: {selectedSong.languageLabel}
                                      </Typography>
                                      <Typography color="secondary">
                                        {' '}
                                        <FormattedMessage id="duration" />: {extractMinutesSeconds(selectedSong.duration)}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </>
                              ) : (
                                <Typography color="secondary">
                                  <FormattedMessage id="no_song_selected" />
                                </Typography>
                              )}
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <Stack spacing={2}>
                            <Typography variant="h5">
                              <FormattedMessage id="To" />
                            </Typography>
                            <Stack sx={{ width: '100%' }}>
                              {selectedStation ? (
                                <>
                                  <Grid container spacing={2}>
                                    <Grid item md={6}>
                                      <Box
                                        component="img"
                                        sx={{
                                          width: '100%',
                                          height: '140px',
                                          objectFit: 'cover',
                                          borderRadius: 1
                                        }}
                                        alt="Station Logo"
                                        src={selectedStation.logo ? `${API_MEDIA_URL}${selectedStation.logo}` : defaultImage}
                                      />
                                    </Grid>
                                    <Grid item md={6}>
                                      <br />
                                      <Typography variant="subtitle1">{selectedStation.stationName}</Typography>
                                      <Typography color="secondary">
                                        <FormattedMessage id="owner" />: {selectedStation.stationOwner}
                                      </Typography>
                                      <Typography color="secondary">Email: {selectedStation.email}</Typography>
                                      <Typography color="secondary">
                                        <FormattedMessage id="frequency" />: {selectedStation.frequency}
                                      </Typography>
                                      <Typography color="secondary">Type: {selectedStation.stationTypeName}</Typography>
                                    </Grid>
                                  </Grid>
                                </>
                              ) : (
                                <Typography color="secondary">
                                  <FormattedMessage id="No_station_selected" />
                                </Typography>
                              )}
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Stack spacing={1}>
                      <InputLabel>Description</InputLabel>
                      <TextField
                        fullWidth
                        multiline
                        minRows={8}
                        maxRows={24}
                        placeholder={formatMessage({ id: 'writeSomething' })}
                        value={values.description}
                        onChange={handleDescriptionChange}
                      />
                    </Stack>
                    {touched.description && errors.description && <FormHelperText error={true}>{errors.description}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                      <Button color="primary" variant="contained" type="submit">
                        <FormattedMessage id="suggestSong" />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item sm={3}>
                  <Typography variant="h4" gutterBottom>
                    <FormattedMessage id="previousProposals" />
                  </Typography>{' '}
                  {oldProposals &&
                    oldProposals.map((proposal, key) => (
                      <Grid key={key} container spacing={2}>
                        <Grid item md={6}>
                          <Box
                            component="img"
                            sx={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                            alt="song cover"
                            src={proposal.song.coverImagePath && `${API_MEDIA_URL}${proposal.song.coverImagePath}`}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Typography variant="subtitle1">
                            <strong>{proposal.song.title}</strong>
                          </Typography>
                          <Typography variant="subtitle2"> {proposal.stationName}</Typography>
                          <Typography variant="subtitle2"> {formatDate1(proposal.proposalDate)}</Typography>
                          {proposal.status == 0 ? (
                            <Typography variant="subtitle2" color="primary">
                              <FormattedMessage id="toAccept" />
                            </Typography>
                          ) : proposal.status == 1 ? (
                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                              <FormattedMessage id="accepted" />
                            </Typography>
                          ) : (
                            <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                              {' '}
                              <FormattedMessage id="rejected" />
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default Suggestion;
