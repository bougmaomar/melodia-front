import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import useSongs from 'hooks/useSongs';
import { extractMinutesSeconds, formatDate2 } from 'utils/globals/functions';

// assets
import { Heart } from 'iconsax-react';
import { Play, Pause } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';

// ==============================|| PRODUCT CARD ||============================== //

const SongCard = ({ id, title, totalDuration, album, releaseDate, coverImage, audioPath, detailLink, refreshFavorites }) => {
  const theme = useTheme();

  const prodProfile = `${API_MEDIA_URL}${coverImage}`;
  const [wishlisted, setWishlisted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { addFavoriteSong, removeFavoriteSong, isSongFavorited } = useSongs();
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user?.id) {
        const isFavorited = await isSongFavorited(user.id, id);
        setWishlisted(isFavorited);
      }
    };

    fetchFavoriteStatus();
  }, [user?.id, id]);

  const addToFavourite = async () => {
    if (!wishlisted) {
      try {
        await addFavoriteSong(user.id, id);
        setWishlisted(true);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Added to favorites',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        refreshFavorites();
      } catch (error) {
        console.error('Error adding favorite song:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to add to favorites',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
    } else {
      try {
        await removeFavoriteSong(user.id, id);
        setWishlisted(false);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Removed from favorites',
            variant: 'alert',
            alert: {
              color: 'warning'
            },
            close: false
          })
        );
        refreshFavorites();
      } catch (error) {
        console.error('Error removing favorite song:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to remove from favorites',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
    }
  };

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
    } else {
      if (audio) {
        audio.pause();
        setCurrentTime(audio.currentTime);
      }
    }
    setPlaying(!playing);
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
        aspectRatio: '1 / 1',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 'auto',
          position: 'relative',
          aspectRatio: '1 / 1',
          overflow: 'hidden'
        }}
      >
        <Link to={`${detailLink}/${id}`} style={{ textDecoration: 'none' }}>
          <img
            src={prodProfile}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderStartStartRadius: '12px',
              display: 'block'
            }}
          />
        </Link>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: '100%',
            position: 'absolute',
            top: 0,
            pt: 1.75,
            pl: 2,
            pr: 1,
            zIndex: 2
          }}
        >
          <Chip
            label={extractMinutesSeconds(totalDuration)}
            variant="combined"
            color="success"
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontWeight: 'bold',
              padding: '1px 2px',
              borderRadius: '8px'
            }}
          />
          <IconButton color="secondary" sx={{ '&:hover': { background: 'transparent' } }} onClick={addToFavourite}>
            {wishlisted ? <Heart variant="Bold" color="red" /> : <Heart />}
          </IconButton>
        </Stack>

        {/* Bouton Play/Pause */}
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
            {playing ? <Pause style={{ fontSize: '2rem', color: '#fff' }} /> : <Play style={{ fontSize: '2rem', color: '#fff' }} />}
          </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: 2, py: 1, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack>
              <Typography
                component={Link}
                to={`${detailLink}/${id}`}
                color="textPrimary"
                variant="h4"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                {title}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {album} - {formatDate2(releaseDate)}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

SongCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  totalDuration: PropTypes.string,
  genreMusicName: PropTypes.string,
  coverImage: PropTypes.string,
  audioPath: PropTypes.string,
  releaseDate: PropTypes.string,
  detailLink: PropTypes.string,
  refreshFavorites: PropTypes.func
};

export default SongCard;
