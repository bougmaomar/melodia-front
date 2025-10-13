import { useState } from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { Play, Pause } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { API_MEDIA_URL } from 'config';
import { extractMinutesSeconds, formatDate2 } from 'utils/globals/functions';

const SongList = ({ song }) => {
  const history = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    if (!playing) {
      if (!audio) {
        const newAudio = new Audio(`${API_MEDIA_URL}${song.mp3FilePath}`);
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

  return (
    <>
      <Box
        key={song.id}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          marginInline: 1,
          marginBlock: 0.5,
          width: '100%',
          borderBottom: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 2,
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': { boxShadow: 6, backgroundColor: 'rgba(0,0,0,0.02)' }
        }}
        onClick={() => history(`/artist/songs-details/${song.id}`)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={`${API_MEDIA_URL}${song.coverImagePath}`} alt={song.title} style={{ width: 80, height: 80, borderRadius: 8 }} />
          <Stack>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {song.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: '1rem' }}>
              <Chip size="small" color="secondary" variant="outlined" label={song.albumTitle || 'None'} />
              <Chip size="small" color="warning" variant="outlined" label={extractMinutesSeconds(song.duration)} sx={{ marginInline: 1 }} />
            </Typography>
          </Stack>
        </Box>

        {/* Release Date */}
        <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>
          {formatDate2(song.releaseDate)}
        </Typography>
        <Box sx={{ position: 'relative', marginInlineEnd: 4 }}>
          <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
            <Box
              sx={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { cursor: 'pointer' }
              }}
              onClick={(event) => {
                event.stopPropagation();
                handlePlayPause();
              }}
            >
              {playing ? <Pause style={{ fontSize: '2rem', color: '#fff' }} /> : <Play style={{ fontSize: '2rem', color: '#fff' }} />}
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default SongList;
