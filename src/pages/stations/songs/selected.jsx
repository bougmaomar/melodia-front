import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import useStation from 'hooks/useSation';
import useSongs from 'hooks/useSongs';
import { Container, Grid, Stack, Card, CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { Import, Heart } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';
import { API_MEDIA_URL } from 'config';
import { styled } from '@mui/material/styles';
import NoFoundIllustrate from 'assets/images/maintenance/noProposition.png';
import { formatDate2, handleDownloadSong } from 'utils/globals/functions';

const NoSongsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60vh',
  textAlign: 'center'
});

const Selected = () => {
  const navigate = useNavigate();
  const { getAcceptedSong } = useStation();
  const { putPlays, putDownloads, isSongFavorited, addFavoriteSong, removeFavoriteSong } = useSongs();
  const [songs, setSongs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(null); // Track which song is playing
  const [isFavorited, setIsFavorited] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songs] = await Promise.all([getAcceptedSong(user.userId)]);
        setSongs(songs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handlePlayPause = (event, propId, songId) => {
    event.stopPropagation(); // Prevent navigation on click

    if (isPlaying === propId) {
      audioRef.current.pause();
      setIsPlaying(null);
    } else {
      audioRef.current.src = `${API_MEDIA_URL}${songs.find((s) => s.id === propId).song.mp3FilePath}`;
      audioRef.current.play();
      setIsPlaying(propId);
      putPlays(songId, user.userId);
    }
  };

  useEffect(() => {
    const checkAllFavorited = async () => {
      if (songs && songs.length > 0) {
        const favoritedMap = {};
        for (const s of songs) {
          try {
            const favorited = await isSongFavorited(user.id, s.song.id);
            favoritedMap[s.song.id] = favorited;
          } catch (error) {
            favoritedMap[s.song.id] = false;
          }
        }
        setIsFavorited(favoritedMap);
      }
    };
    checkAllFavorited();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, isSongFavorited, user.userId]);

  const handleFavoriteToggle = async (songId) => {
    try {
      if (isFavorited[songId]) {
        if (typeof removeFavoriteSong === 'function') {
          await removeFavoriteSong(user.id, songId);
        }
        setIsFavorited((prev) => ({ ...prev, [songId]: false }));
        // toast.error(formatMessage({ id: 'songRemovedFromFavorites' }));
      } else {
        if (typeof addFavoriteSong === 'function') {
          await addFavoriteSong(user.id, songId);
        }
        setIsFavorited((prev) => ({ ...prev, [songId]: true }));
        // toast.success(formatMessage({ id: 'songAddedToFavorites' }));
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingBlock: 2 }}>
      {/* <Typography variant="h3" gutterBottom marginBottom={6}>
        🎧 <FormattedMessage id="selectedPage" />
      </Typography> */}
      {songs.length > 0 ? (
        <Grid container spacing={3} justifyContent="start">
          {songs.map((song, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  position: 'relative',
                  marginBottom: '30px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' }
                }}
              >
                {/* Play Button Overlay on Image */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    image={song.song.coverImagePath ? `${API_MEDIA_URL}${song.song.coverImagePath}` : 'https://via.placeholder.com/200'}
                    alt={song.song.title}
                    style={{ height: '200px' }}
                    onClick={() => navigate(`/radio-station/songs/details/${song.song.id}/accepted`)}
                  />
                  {/* Play/Pause Button */}
                  <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
                    <IconButton
                      sx={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(27, 104, 228, 0.9)' },
                        backgroundColor: 'rgba(27, 104, 228, 0.6)',
                        color: 'white'
                      }}
                      onClick={(event) => handlePlayPause(event, song.id, song.song.id)}
                    >
                      {isPlaying === song.id ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                    </IconButton>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="end"
                    sx={{ width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1, zIndex: 2 }}
                  >
                    <Stack direction="column" spacing={1} alignItems="center">
                      <IconButton
                        onClick={() => handleDownloadSong(song.song.mp3FilePath, 'Station', putDownloads, song.song.id, user.userId)}
                        sx={{
                          color: '#fff',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          borderRadius: '25px',
                          transition: 'color 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(214, 125, 0, 0.4)'
                          }
                        }}
                      >
                        <Import size={32} />
                      </IconButton>
                      <IconButton sx={{ color: 'crimson' }} onClick={() => handleFavoriteToggle(song.song.id)}>
                        <Heart variant={isFavorited[song.song.id] ? 'Bold' : 'Linear'} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>

                <CardContent sx={{ marginY: 0 }}>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h3">
                    {song.song.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {song.song.artists?.$values.map((artist) => artist.name).join(', ') || 'Unknown Artist'} - {song.song.albumTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    🎵 {song.song.genreMusic} - 📅 {formatDate2(song.song.releaseDate)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoSongsContainer>
          <CardMedia component="img" image={NoFoundIllustrate} title="No Songs Found" sx={{ width: 250, mb: 3 }} />
          <Typography variant="h4" fontWeight="bold">
            <FormattedMessage id="noSongs" />
          </Typography>
          <Typography variant="h6" color="textSecondary">
            <FormattedMessage id="waitPropositions" />
          </Typography>
        </NoSongsContainer>
      )}
      {/* Hidden Audio Element */}
      <audio ref={audioRef}>
        <track kind="captions" srcLang="fr" label="No captions available" />
      </audio>
    </Container>
  );
};

export default Selected;
