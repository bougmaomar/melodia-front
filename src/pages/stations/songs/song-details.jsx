import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { Download, Check, Close, BubbleChart } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { ArrowLeft, Heart } from 'iconsax-react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import useSongs from 'hooks/useSongs';
import useArtist from 'hooks/useArtist';
import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import useSpotify from 'hooks/useSpotify';

import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import SongDetail from 'sections/apps/songs/SongDetails';
import SocialMediaIcons from 'sections/apps/songs/SocialMedia';
import { extractMinutesSecondsText, handleDownloadSong } from 'utils/globals/functions';
import { toast, ToastContainer } from 'react-toastify';
import AudioPlayer from 'components/AudioPlayer';
import PopularityChart from 'components/PopularityChart';
import axios from 'axios';
import { API_URL } from 'config';
import { useIntl } from 'react-intl';

// import { TabContext, TabPanel } from '@mui/lab';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`song-details-tabpanel-${index}`}
      aria-labelledby={`song-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `song-details-tab-${index}`,
    'aria-controls': `song-details-tabpanel-${index}`
  };
}

const SongDetails = () => {
  const { id, status } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const {
    getSongById,
    putDownloads,
    getSongDownloads,
    putPlays,
    getSongPlays,
    putVisits,
    getSongVisits,
    isSongFavorited,
    addFavoriteSong,
    removeFavoriteSong
  } = useSongs();
  const { getProposalsNumber } = useProposals();
  const { getArtistByEmail } = useArtist();
  const { sendToAccepted } = useStation();
  const { getPopularity } = useSpotify();
  const { formatMessage } = useIntl();

  const [isFavorited, setIsFavorited] = useState(false);
  const [value, setValue] = useState(0);
  const [song, setSong] = useState();
  const [plays, setPlays] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [visits, setVisits] = useState(0);
  const [number, setNumber] = useState(0);
  const [errors, setErrors] = useState({});
  const [nameArtist, setNameArtist] = useState('');
  const [popularity, setPopularity] = useState(0);

  const alreadyExecuted = useRef(false);

  useEffect(() => {
    if (id) putVisits(id, user.userId);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [song, plays, downloads, visits, num] = await Promise.all([
          getSongById(id),
          getSongPlays(id),
          getSongDownloads(id),
          getSongVisits(id),
          getProposalsNumber(id)
        ]);
        setSong(song);
        setPlays(plays);
        setDownloads(downloads);
        setVisits(visits);
        setNumber(num);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    setErrors({});
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addToSelected = async (id, email) => {
    const artist = await getArtistByEmail(email);
    const res = await sendToAccepted(artist.artistId, user.userId, id);
    if (res.success === true) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
      toast.success('Chanson ajoutée au playlist de la station');
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: res.message }));
      toast.warning(res.message);
    }
  };

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (song) {
        try {
          const favorited = await isSongFavorited(user.id, song.id);
          setIsFavorited(favorited);
        } catch (error) {
          console.log('');
        }
      }
    };
    checkIfFavorited();
  }, [song, isSongFavorited, user.id]);

  const handleFavoriteToggle = async (songId) => {
    try {
      if (isFavorited) {
        await removeFavoriteSong(user.id, songId);
        setIsFavorited(false);
        toast.error(formatMessage({ id: 'songRemovedFromFavorites' }));
      } else {
        await addFavoriteSong(user.id, songId);
        setIsFavorited(true);
        toast.success(formatMessage({ id: 'songAddedToFavorites' }));
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleArtist = async () => {
    try {
      if (song && song.artistEmails && song.artistEmails.$values[0] !== undefined) {
        const res = await getArtistByEmail(song.artistEmails.$values[0]);

        if (res) {
          setNameArtist(res.name);
        } else {
          console.log('Error during getting artist');
        }
      }
    } catch (error) {
      console.error('Error getting artist:', error);
      setErrorMessage('Error during getting artist');
    }
  };

  const handleAccept = async (radioStationId, songId) => {
    try {
      console.log('Accepting proposal for songId:', songId, 'radioStationId:', radioStationId);
      const response = await axios.post(`${API_URL}/SongProposal/accept`, null, {
        params: { radioStationId, songId }
      });
      if (response.status === 200) {
        toast.success(formatMessage({ id: 'proposalAccepted' }));
        navigate(`/radio-station/songs/details/${songId}/accepted`);
        // Optionally, you can fetch proposals again or update the state to reflect the changes
        // fetchProposals();
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
    }
  };

  const handleReject = async (radioStationId, songId) => {
    try {
      const response = await axios.post(`${API_URL}/SongProposal/reject`, null, {
        params: { radioStationId, songId }
      });
      if (response.status === 200) {
        toast.error(formatMessage({ id: 'proposalRejected' }));
        navigate(`/radio-station/songs/details/${songId}/rejected`);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    }
  };

  useEffect(() => {
    handleArtist();
  }, [song]);

  const handlePopularity = async () => {
    try {
      const popularity = await getPopularity(song.title, nameArtist);
      setPopularity(popularity);
    } catch (error) {
      console.error('Error fetching popularity:', error);
      setErrorMessage('Error fetching popularity');
    }
  };

  useEffect(() => {
    if (song !== undefined && nameArtist !== '' && !alreadyExecuted.current) {
      alreadyExecuted.current = true; // Bloque les appels suivants
      handlePopularity();
    }
  }, [song, nameArtist]);

  return (
    <Container>
      <ToastContainer />
      {/* Song Card */}
      <Card sx={{ boxShadow: 3, borderRadius: 3, overflow: 'hidden', p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item lg={3.5} md={4} sm={12} xs={12}>
            <Box
              sx={{
                position: 'relative', // Allows absolute positioning inside
                aspectRatio: { xs: '2 / 1', sm: '2 / 1', md: '1 / 1', lg: '1 / 1' },
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              {/* Cover Image */}
              <CardMedia
                component="img"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2
                }}
                image={song ? `${API_MEDIA_URL}${song.coverImagePath}` : ''}
                alt={song ? song.title : 'Image cover'}
              />

              {/* Return Icon Positioned on Top of Cover */}
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  position: 'absolute', // Places it on top of the image
                  top: 10, // Distance from the top
                  left: 10, // Distance from the left
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%', // Makes it circular
                  color: 'black',
                  width: 40,
                  height: 40,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                }}
              >
                <ArrowLeft sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
          </Grid>

          {/* Song Information (md=6) and Buttons (md=2) */}
          <Grid item lg={8.5} md={8} sm={12} xs={12}>
            <Grid container spacing={2} alignItems="center">
              {/* Song Info (md=6) */}
              <Grid item lg={8} md={7} xs={12}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h3" fontWeight="bold">
                    {song?.title || 'Unknown Title'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">
                    {song?.artistNames?.$values.join(', ') || 'Unknown Artist'}
                  </Typography>
                  <Chip label={song?.albumTitle || 'Single'} size="small" color="primary" sx={{ width: 'fit-content' }} />
                  <Grid>
                    <Chip label={song?.genreMusicName || 'Single'} size="small" color="warning" sx={{ width: 'fit-content' }} />
                    <Chip
                      label={song && extractMinutesSecondsText(song?.duration)}
                      size="small"
                      sx={{ width: 'fit-content', marginX: 2 }}
                    />
                  </Grid>
                </CardContent>
              </Grid>

              {/* Buttons (md=2) */}
              <Grid item lg={4} md={5} xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Heart style={{ marginRight: 6, color: 'red' }}  variant={isFavorited ? 'Bold' : 'Outline'} />}
                  onClick={() => handleFavoriteToggle(song.id)}
                >
                  {!isFavorited ? <FormattedMessage id="markAsFavorite" /> : <FormattedMessage id="favorite" />}
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<Download />}
                  onClick={() => handleDownloadSong(song.mp3FilePath, 'Station', putDownloads, song.id, user.userId)}
                >
                  <FormattedMessage id="download" />
                </Button>

                {/* Accept/Reject Buttons (if Pending) */}
                {status === 'ToAdd' ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<BubbleChart />}
                    onClick={() => addToSelected(song.id, song.artistEmails.$values[0])}
                  >
                    <FormattedMessage id="select" />
                  </Button>
                ) : (
                  // <Box display="flex" flexDirection="column" gap={1}>
                  <>
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => handleAccept(user.userId, song.id)}
                      disabled={status != 'pending'}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => handleReject(user.userId, song.id)}
                      disabled={status != 'pending'}
                    >
                      Reject
                    </Button>
                    <Typography variant="body2" sx={{ color: 'red' }}>
                      {song && errors[song.id]}
                    </Typography>
                  </>
                  // </Box>
                )}
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, width: '100%' }}>
              <AudioPlayer
                src={song && `${API_MEDIA_URL}${song.mp3FilePath}`}
                onDownload={() => handleDownloadSong(song.mp3FilePath, 'Station', putDownloads, song.id, user.userId)}
                onPlay={() => putPlays(song.id, user.userId)}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mt: 3, boxShadow: 2, borderRadius: 2 }}>
        <MainCard>
          <Stack spacing={3}>
            <Stack>
              <Tabs
                value={value}
                indicatorColor="primary"
                onChange={handleChange}
                aria-label="album description tabs example"
                variant="scrollable"
              >
                <Tab component={Link} to="#" label={<FormattedMessage id="details" />} {...a11yProps(0)} />
                <Tab component={Link} to="#" label={<FormattedMessage id="lyrics" />} {...a11yProps(1)} />
                <Tab component={Link} to="#" label={<FormattedMessage id="socialMedia" />} {...a11yProps(2)} />
                <Tab component={Link} to="#" label={<FormattedMessage id="statistics" />} {...a11yProps(3)} />
              </Tabs>
              <Divider />
            </Stack>
            <TabPanel value={value} index={0}>
              {song && <SongDetail song={song} />}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid item xs={12}>
                {song &&
                  song.lyrics.split('<br />').map((line, index) => (
                    <Typography key={index} component="p" variant="body1" gutterBottom>
                      {line}
                    </Typography>
                  ))}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              {song && <SocialMediaIcons song={song} />}
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Plays Count */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                      <FormattedMessage id="totalPlays" />
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {(plays && plays) || 0}
                    </Typography>
                  </Card>
                </Grid>

                {/* Downloads Count */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                      <FormattedMessage id="totalDownloads" />
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="secondary">
                      {(downloads && downloads) || 0}
                    </Typography>
                  </Card>
                </Grid>

                {/* Likes Count */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                      <FormattedMessage id="totalViews" />
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="success">
                      {(visits && visits) || 0}
                    </Typography>
                  </Card>
                </Grid>

                {/* Suggestions to Stations */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                      <FormattedMessage id="suggestionTo" />
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="warning">
                      {(number && number) || 0}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                      <FormattedMessage id="popularity" />
                    </Typography>
                    <PopularityChart
                      value={popularity}
                      onChange={handleArtist}
                      sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '25%'
                      }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Stack>
        </MainCard>
      </Paper>
    </Container>
  );
};

export default SongDetails;
