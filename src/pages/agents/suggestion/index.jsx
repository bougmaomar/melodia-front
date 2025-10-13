import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import MainCard from 'components/MainCard';
import useSongs from 'hooks/useSongs';
import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import useArtist from 'hooks/useArtist';
import { useEffect, useState } from 'react';
import defaultImage from 'assets/images/regsiter/station.jpeg';
import { API_MEDIA_URL } from 'config';
import { useIntl, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { formatDate1 } from 'utils/globals/functions';

const validationSchema = yup.object({
  artist: yup.string().required('Artist selection is required'),
  song: yup.string().required('Song selection is required'),
  station: yup.string().required('Station selection is required'),
  description: yup.string().required('Write something here')
});

const Suggestion = () => {
  const { stationid } = useParams();
  const { getArtistSongs } = useSongs();
  const { getArtistsByAgent } = useArtist();
  const { getStations, proposeSong, proposeSongAllStations } = useStation();
  const { getAllProposalsByArtist } = useProposals();
  const [artistSongs, setArtistSongs] = useState([]);
  const [artists, setArtists] = useState([]);
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
        const [artists, stats] = await Promise.all([getArtistsByAgent(user.userId), getStations()]);

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

        setStations([allStationsOption, ...stats]);
        setArtists(artists.$values);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user.email]);

  const handlerCreate = async (values) => {
    if (values.station === 'all' || Number(values.station) === 0) {
      await proposeSongAllStations(values.artist, values.song, values.description);
      window.location.href = '/agent/suggest/0';
    } else {
      const res = await proposeSong(values.artist, values.station, values.song, values.description);
      if (res === true) {
        window.location.href = '/agent/suggest/0';
      }
    }
  };

  return (
    <MainCard>
      <Formik
        initialValues={{
          id: 120,
          artist: '',
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

          const handleArtistChange = async (event) => {
            const selectedId = event.target.value;
            const selectedArtist = artists.find((artist) => artist.artistId === selectedId);
            const res = await getArtistSongs(selectedArtist.email);
            if (res) setArtistSongs(res);
            const result = await getAllProposalsByArtist(selectedArtist.artistId);
            if (result) setOldProposals(result);
            setFieldValue('artist', selectedId);
          };

          const handleStationChange = (event) => {
            const selectedId = String(event.target.value);
            const station = stations.find((s) => String(s.stationId) === selectedId);
            setSelectedStation(station);
            setFieldValue('station', selectedId);
          };

          const handleDescriptionChange = (event) => {
            setFieldValue('description', event.target.value);
          };

          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item sm={9} container spacing={2}>
                  {/* Select Artist */}
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={2}>
                      <InputLabel>
                        <FormattedMessage id="artist" />
                      </InputLabel>
                      <FormControl sx={{ width: '100%' }}>
                        <Select
                          value={values.artist}
                          displayEmpty
                          name="artist"
                          onChange={handleArtistChange}
                          error={Boolean(errors.artist && touched.artist)}
                          renderValue={(selected) => {
                            if (!selected)
                              return (
                                <Box sx={{ color: 'secondary.400' }}>
                                  <FormattedMessage id="select" />
                                </Box>
                              );
                            const artist = artists.find((a) => a.artistId === selected);
                            return artist ? artist.artistRealName : selected;
                          }}
                        >
                          <MenuItem disabled value="">
                            <FormattedMessage id="select" />
                          </MenuItem>
                          {artists.map((artist) => (
                            <MenuItem key={artist.artistId} value={artist.artistId}>
                              {artist.artistRealName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>

                  {/* Select Song */}
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
                          onChange={handleSongChange}
                          error={Boolean(errors.song && touched.song)}
                          renderValue={(selected) => {
                            if (!selected)
                              return (
                                <Box sx={{ color: 'secondary.400' }}>
                                  <FormattedMessage id="select" />
                                </Box>
                              );
                            const song = artistSongs.find((s) => s.id === selected);
                            return song ? song.title : selected;
                          }}
                        >
                          <MenuItem disabled value="">
                            <FormattedMessage id="select" />
                          </MenuItem>
                          {artistSongs.map((song) => (
                            <MenuItem key={song.id} value={song.id}>
                              {song.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched.song && errors.song && <FormHelperText error>{errors.song}</FormHelperText>}
                    </Stack>
                  </Grid>

                  {/* Select Station */}
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={2}>
                      <InputLabel>Station</InputLabel>
                      <FormControl sx={{ width: '100%' }}>
                        <Select
                          value={values.station}
                          displayEmpty
                          name="station"
                          onChange={handleStationChange}
                          error={Boolean(errors.station && touched.station)}
                          renderValue={(selected) => {
                            if (!selected)
                              return (
                                <Box sx={{ color: 'secondary.400' }}>
                                  <FormattedMessage id="select" />
                                </Box>
                              );
                            const station = stations.find((s) => String(s.stationId) === String(selected));
                            return station ? station.stationName : selected;
                          }}
                        >
                          <MenuItem disabled value="">
                            <FormattedMessage id="Select_station" />
                          </MenuItem>
                          {stations.map((station) => (
                            <MenuItem key={station.stationId} value={String(station.stationId)}>
                              {station.stationName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched.station && errors.station && <FormHelperText error>{errors.station}</FormHelperText>}
                    </Stack>
                  </Grid>

                  {/* Song Preview */}
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Typography variant="h5">
                        <FormattedMessage id="Send" />
                      </Typography>
                      {selectedSong ? (
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <Box
                              component="img"
                              sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1 }}
                              alt="song cover"
                              src={selectedSong.coverImagePath ? `${API_MEDIA_URL}${selectedSong.coverImagePath}` : ''}
                            />
                          </Grid>
                          <Grid item md={6}>
                            <Typography variant="subtitle1">{selectedSong.title}</Typography>
                            <Typography color="secondary">Artist: {user.name}</Typography>
                            <Typography color="secondary">Type: {selectedSong.genreMusicName}</Typography>
                            <Typography color="secondary">
                              <FormattedMessage id="language" />: {selectedSong.languageLabel}
                            </Typography>
                            <Typography color="secondary">
                              <FormattedMessage id="duration" />: {selectedSong.duration}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography color="secondary">
                          <FormattedMessage id="no_song_selected" />
                        </Typography>
                      )}
                    </MainCard>
                  </Grid>

                  {/* Station Preview */}
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Typography variant="h5">
                        <FormattedMessage id="To" />
                      </Typography>
                      {selectedStation ? (
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <Box
                              component="img"
                              sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1 }}
                              alt="Station Logo"
                              src={selectedStation.logo ? `${API_MEDIA_URL}${selectedStation.logo}` : defaultImage}
                            />
                          </Grid>
                          <Grid item md={6}>
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
                      ) : (
                        <Typography color="secondary">
                          <FormattedMessage id="No_station_selected" />
                        </Typography>
                      )}
                    </MainCard>
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
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
                    {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                      <Button color="primary" variant="contained" type="submit">
                        <FormattedMessage id="suggestSong" />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Old Proposals */}
                <Grid item sm={3}>
                  <Typography variant="h4" gutterBottom>
                    <FormattedMessage id="previousProposals" />
                  </Typography>
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
                            src={proposal.song.coverImagePath ? `${API_MEDIA_URL}${proposal.song.coverImagePath}` : ''}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Typography variant="subtitle1">
                            <strong>{proposal.song.title}</strong>
                          </Typography>
                          <Typography variant="subtitle2">{proposal.stationName}</Typography>
                          <Typography variant="subtitle2">{formatDate1(proposal.proposalDate)}</Typography>
                          <Typography
                            variant="subtitle2"
                            color={proposal.status === 0 ? 'primary' : proposal.status === 1 ? 'success.main' : 'error.main'}
                          >
                            <FormattedMessage id={proposal.status === 0 ? 'toAccept' : proposal.status === 1 ? 'accepted' : 'rejected'} />
                          </Typography>
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
