import { Grid, Typography, CardMedia, Avatar, Box, IconButton, Button } from '@mui/material';
import { Email, Phone, CalendarToday, PlayArrow, Pause } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { useNavigate, useParams } from 'react-router';
import useArtist from 'hooks/useArtist';
import useSongs from 'hooks/useSongs';
import { useEffect, useState, useRef } from 'react';
import { API_MEDIA_URL } from 'config';
import { Facebook, Google, Heart, Instagram, Send, Spotify, Youtube, ArrowLeft } from 'iconsax-react';
import { googleColor, instagramColor, facebookColor, youtubeColor, spotifyColor } from 'config';
import { FormattedMessage } from 'react-intl';
import { extractMinutesSecondsText, formatPhone } from 'utils/globals/functions';
import { useChatContext } from 'contexts/ChatContext';

const avatarImage = require.context('assets/images/users', true);
const ProfileArtist = () => {
  const defaultAvatar = avatarImage('./default.jpeg');
  const navigate = useNavigate();
  const { startChat, handleChatClick } = useChatContext();
  const { recordVisit, getArtistById } = useArtist();
  const { getArtistSongs } = useSongs();
  const [artist, setArtist] = useState();
  const [songs, setSongs] = useState([]);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [favoris, setFavoris] = useState(false);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const audioRefs = useRef({}); // Store a ref for each song

  useEffect(() => {
    const fetchData = async () => {
      const response = await getArtistById(id);
      setArtist(response);
      const artistSongs = await getArtistSongs(response.email);
      setSongs(artistSongs);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (id) {
      recordVisit(id, user.userId);
    }
  }, [id, user.userId]);

  const handlePlayPause = (songId, songUrl) => {
    if (playingSongId && playingSongId !== songId) {
      audioRefs.current[playingSongId]?.pause();
    }

    // Toggle play/pause
    if (playingSongId === songId) {
      audioRefs.current[songId]?.pause();
      setPlayingSongId(null);
    } else {
      if (!audioRefs.current[songId]) {
        audioRefs.current[songId] = new Audio(`${API_MEDIA_URL}${songUrl}`);
      }
      audioRefs.current[songId].play();
      setPlayingSongId(songId);
    }
  };

  const handleContact = async () => {
    if (!user || !user.email) {
      console.error('User information is missing.');
      return;
    }

    if (!artist || !artist.email) {
      console.error('Artist information is missing.');
      return;
    }

    try {
      const res = await startChat(user?.email, artist.email);

      if (res) {
        const response = await handleChatClick(res);
        if (response) navigate('/radio-station/chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <MainCard>
      {/* Return icon */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '25px',
          color: 'white',
          width: 40,
          height: 40,
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
        }}
      >
        <ArrowLeft sx={{ fontSize: 30 }} />
      </IconButton>
      {/* Artist Profile Info */}
      <Grid container spacing={3} alignItems="center">
        <Grid item container xs={6} md={4} display="flex" justifyContent="center">
          <Grid item md={12} xs={12} display="flex" justifyContent="center">
            <Avatar
              alt="coverimage"
              src={artist?.photoProfile ? `${API_MEDIA_URL}${artist.photoProfile}` : defaultAvatar}
              sx={{ width: 150, height: 150, borderRadius: '50%' }}
            />
          </Grid>

          {/* Social Media Icons */}
          <Grid item md={12} xs={12} display="flex" justifyContent="center" gap={2} mt={2}>
            {[
              { icon: Spotify, color: spotifyColor, link: artist?.spotify },
              { icon: Youtube, color: youtubeColor, link: artist?.youtube },
              { icon: Facebook, color: facebookColor, link: artist?.facebook },
              { icon: Instagram, color: instagramColor, link: artist?.instagram },
              { icon: Google, color: googleColor, link: artist?.google }
            ].map(({ icon: Icon, color, link }, index) => (
              <Avatar
                key={index}
                sx={{
                  bgcolor: color,
                  width: 30,
                  height: 30,
                  opacity: link ? 1 : 0.5,
                  cursor: link ? 'pointer' : 'not-allowed'
                }}
                onClick={() => link && window.open(link, '_blank', 'noopener,noreferrer')}
              >
                <Icon size="18" color="#fff" />
              </Avatar>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6} md={5}>
          <Typography variant="h2">{artist?.artistRealName}</Typography>
          <br />
          <Grid item>
            <Box display="flex" alignItems="center" gap={2} margin={1}>
              <Email color="primary" />
              <Typography>{artist?.email}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} margin={1}>
              <Phone color="secondary" />
              <Typography>{formatPhone(artist?.phoneNumber)}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} margin={1}>
              <CalendarToday color="action" />
              <Typography>{artist?.careerStartDate ? new Date(artist.careerStartDate).toLocaleDateString() : 'N/A'}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container md={3} xs={12}>
          <Grid item margin={1} marginInline={2} lg={12} md={6}>
            {' '}
            <Button style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: favoris ? 'red' : 'black' }} onClick={() => setFavoris(!favoris)}>
              <Heart style={{ marginRight: 6, color: favoris ? 'red' : 'black' }} variant={favoris ? 'Bold' : 'Outline'} />{' '}
              {!favoris ? <FormattedMessage id="markAsFavorite" /> : <FormattedMessage id="favorite" />}
            </Button>
          </Grid>
          <Grid item margin={1} marginInline={2} lg={12} md={6}>
            {' '}
            <Button style={{ backgroundColor: 'orange', color: 'white' }} onClick={handleContact}>
              <Send style={{ marginRight: 6 }} /> <FormattedMessage id="contact" />
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Bio Section */}
      <Box mt={3} p={2} bgcolor="grey.100" borderRadius={2}>
        <Typography variant="h5" marginBottom={2}>
          <FormattedMessage id="bio" />
        </Typography>
        <Typography>{artist?.bio || 'No bio available.'}</Typography>
      </Box>

      {/* Songs List */}
      <Box mt={3} p={2} bgcolor="grey.100" borderRadius={2}>
        <Typography variant="h5">
          <FormattedMessage id="songs" />
        </Typography>
        {songs.length > 0 ? (
          songs.map((song) => (
            <Box key={song.id} display="flex" alignItems="center" justifyContent="space-between" p={1} borderBottom="1px solid #ddd">
              <Box display="flex" alignItems="center" gap={2}>
                <CardMedia
                  component="img"
                  image={`${API_MEDIA_URL}${song.coverImagePath}`}
                  sx={{ width: 50, height: 50, borderRadius: 1 }}
                />
                <Typography>{song.title}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="textSecondary">
                  {extractMinutesSecondsText(song.duration)}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(song.id, song.mp3FilePath);
                  }}
                  sx={{
                    bgcolor: '#2596be',
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: '4rem'
                  }}
                >
                  {playingSongId === song.id ? <Pause sx={{ fontSize: 60 }} /> : <PlayArrow sx={{ fontSize: 60 }} />}
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>
            <FormattedMessage id="noSongs" />
          </Typography>
        )}
      </Box>
    </MainCard>
  );
};

export default ProfileArtist;
