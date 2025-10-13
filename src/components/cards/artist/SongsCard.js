import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Box, CardMedia, Stack, IconButton } from '@mui/material';
import { Play, Pause, Add, Import } from 'iconsax-react'; // Import MoreVert for 3 dots
// import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import useSongs from 'hooks/useSongs';
import { API_MEDIA_URL } from 'config';
import { useNavigate } from 'react-router';
import {  handleDownloadSong } from 'utils/globals/functions';

const SongCard = ({ songId, coverImage, audioPath, onAddToSelection }) => {
  const theme = useTheme();
  const history = useNavigate();
  const prodProfile = `${API_MEDIA_URL}${coverImage}`;
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { putDownloads, putPlays } = useSongs();
  const user = JSON.parse(localStorage.getItem('user'));
  const status = 'ToAdd';

  const handlePlayPause = () => {
    if (!playing) {
      if (!audio) {
        const newAudio = new Audio(`${API_MEDIA_URL}${audioPath}`);
        newAudio.currentTime = currentTime;
        newAudio.addEventListener('timeupdate', () => setCurrentTime(newAudio.currentTime));
        newAudio.addEventListener('ended', () => {
          setPlaying(false);
          setAudio(null);
        });
        newAudio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setAudio(newAudio);
      } else {
        audio.currentTime = currentTime;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }

      if (user.role === 'Station') {
        putPlays(songId, user.userId)
          .then((res) => {
            console.log('Play count updated:', res);
          })
          .catch((error) => {
            console.error('Error updating play count:', error);
          });
      }
    } else {
      if (audio) {
        audio.pause();
        setCurrentTime(audio.currentTime);
      }
    }
    setPlaying(!playing);
  };

  const handleGoToDetails = (id) => {
    history(`/radio-station/songs/details/${id}/${status}`);
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio]);

  if (loading) return <SkeletonProductPlaceholder />;

  return (
    <MainCard
      content={false}
      sx={{
        '&:hover': {
          transform: 'scale3d(1.02, 1.02, 1)',
          transition: 'all .4s ease-in-out'
        },
        minWidth: 260
      }}
    >
      <Box sx={{ width: '100%', height: '90%', position: 'relative', minHeight: 300 }}>
        <CardMedia
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            '&:hover': { cursor: 'pointer' }
          }}
          image={prodProfile}
          component="div"
          onClick={() => handleGoToDetails(songId)}
        />
        <Stack
          direction="row"
          alignItems="flex"
          justifyContent="end"
          sx={{ width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1, zIndex: 2 }}
        >
          {/* <Chip label={extractMinutesSeconds(totalDuration)} variant="combined" color="success" size="small" /> */}

          {/* 3-dot Icon and Menu */}
          <Grid>
            <IconButton
              onClick={onAddToSelection}
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderRadius: '25px',
                transition: 'color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 152, 8, 0.4)' // Change color when hovered
                }
              }}
            >
              <Add />
            </IconButton>
            <IconButton
              onClick={() => handleDownloadSong(audioPath, 'Station', putDownloads, songId, user.userId)}
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderRadius: '25px',
                marginX: 1,
                transition: 'color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(214, 125, 0, 0.4)'
                }
              }}
            >
              <Import size={32} />
            </IconButton>
          </Grid>
        </Stack>

        {playing ? (
          <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
            <Box
              sx={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { cursor: 'pointer' }
              }}
              onClick={handlePlayPause}
            >
              <Pause style={{ fontSize: '2rem', color: '#fff' }} />
            </Box>
          </Stack>
        ) : (
          <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
            <Box
              sx={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { cursor: 'pointer' }
              }}
              onClick={handlePlayPause}
            >
              <Play style={{ fontSize: '2rem', color: '#fff' }} />
            </Box>
          </Stack>
        )}
      </Box>
    </MainCard>
  );
};

SongCard.propTypes = {
  title: PropTypes.string,
  totalDuration: PropTypes.string,
  coverImage: PropTypes.string,
  audioPath: PropTypes.string
};

export default SongCard;
