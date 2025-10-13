import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ListItemAvatar, ListItemButton, ListItemText, IconButton, Stack, Typography, Box, List, Grid } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import SimpleBar from 'simplebar-react';
import Avatar from 'components/@extended/Avatar';
import { API_MEDIA_URL } from 'config';
import { useState, useRef, useEffect } from 'react';
import { extractMinutesSecondsText } from 'utils/globals/functions';

export const ListSongs = ({ song, role }) => {
  const theme = useTheme();
  const history = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const file = song.mp3FilePath;

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleLoadedData = () => {
        if (isPlaying) {
          audioElement.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
      };

      audioElement.addEventListener('loadeddata', handleLoadedData);

      return () => {
        audioElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [isPlaying, file]);

  const audioSrc = `${API_MEDIA_URL}${file}`;

  const linkHandler = (id) => {
    if (role === 'Artist') {
      history(`/artist/songs-details/${id}`);
    } else if (role === 'Agent') {
      history(`/agent/songs-details/${id}`);
    }
  };

  const handlePlayPause = (audioRef, isPlaying, setIsPlaying) => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <ListItemButton divider onClick={() => linkHandler(song.id)}>
      <ListItemAvatar>
        <Avatar
          alt="Avatar"
          size="xl"
          color="secondary"
          variant="rounded"
          type="combined"
          src={song.coverImagePath ? `${API_MEDIA_URL}${song.coverImagePath}` : ''}
          sx={{ borderColor: theme.palette.divider, mr: 1 }}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={<Typography variant="subtitle1">{song.title}</Typography>}
        secondary={
          <Stack spacing={1}>
            <Typography color="text.secondary">{extractMinutesSecondsText(song.duration)}</Typography>
          </Stack>
        }
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          width: 50,
          height: 50,
          mr: 2,
          mt: 1
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause(audioRef, isPlaying, setIsPlaying);
          }}
          sx={{
            color: theme.palette.common.white,
            fontSize: '4rem'
          }}
        >
          {isPlaying ? <Pause sx={{ fontSize: 60 }} /> : <PlayArrow sx={{ fontSize: 60 }} />}
        </IconButton>
      </Box>
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc}>
          <track kind="captions" srcLang="en" label="Audio" />
        </audio>
      )}
    </ListItemButton>
  );
};

ListSongs.propTypes = {
  song: PropTypes.object,
  role: PropTypes.string
};

// ==============================|| ALBUMS DETAILS - RELATED ALBUMS ||============================== //

const AlbumSongs = ({ songs }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  let songResult = <></>;
  if (songs.length) {
    songResult = (
      <List
        component="nav"
        sx={{
          '& .MuiListItemButton-root': {
            borderRadius: 0,
            my: 0,
            px: 3,
            py: 2,
            alignItems: 'flex-start',
            '& .MuiListItemSecondaryAction-root': {
              alignSelf: 'flex-start',
              ml: 1,
              position: 'relative',
              right: 'auto',
              top: 'auto',
              transform: 'none'
            },
            '& .MuiListItemAvatar-root': { mr: 1, mt: 0.75 }
          },
          p: 0
        }}
      >
        {songs.map((song, index) => (
          <ListSongs key={index} song={song} role={user.role} />
        ))}
      </List>
    );
  }

  return (
    <SimpleBar sx={{ height: { xs: '100%', md: 'calc(100% - 62px)' } }}>
      <Grid item>
        <Stack>{songResult}</Stack>
      </Grid>
    </SimpleBar>
  );
};

AlbumSongs.propTypes = {
  songs: PropTypes.array
};

export default AlbumSongs;
