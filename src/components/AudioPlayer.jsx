import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';
import { Box, Slider, IconButton, Stack, Typography } from '@mui/material';

const AudioPlayer = ({ src, onDownload, onPlay }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volumeSliderVisible, setVolumeSliderVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // Event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  // Play/Pause toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime === 0) onPlay();
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seeking
  const handleProgressChange = (_, newValue) => {
    if (!audioRef.current) return;

    const newTime = typeof newValue === 'number' ? (newValue * duration) / 100 : 0;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (_, newValue) => {
    const newVolume = typeof newValue === 'number' ? newValue / 100 : 0;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressValue = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Box
      sx={{
        width: '100%',
        // maxWidth: 400,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)'
        },
        '@media (max-width: 480px)': {
          maxWidth: '100%'
        }
      }}
    >
      {/* Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata">
        <track kind="captions" srcLang="en" label="No captions available" />
      </audio>

      {/* Progress Bar and Volume Icon */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', mb: 1 }}>
        {/* Progress Slider */}
        <Slider
          size="large"
          value={progressValue}
          onChange={handleProgressChange}
          aria-label="Progress"
          sx={{
            color: 'primary.main',
            flex: 1,
            height: 8,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8
            },
            transition: 'width 0.3s ease'
          }}
        />
        {volumeSliderVisible && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiSlider-root': {
                width: 50,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  color: 'primary.main',
                  backgroundColor: '#fff',
                  boxShadow: '0 0 4px rgba(0,0,0,0.3)'
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  background: 'rgba(0, 0, 0, 0.2)'
                },
                '& .MuiSlider-rail': {
                  background: 'rgba(0, 0, 0, 0.1)'
                }
              }
            }}
          >
            <Slider
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              aria-label="Volume"
              orientation="horizontal"
              sx={{
                color: 'blue',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  boxShadow: '0 0 4px rgba(0,0,0,0.3)'
                }
              }}
            />
          </Box>
        )}
        {/* Volume Icon */}
        <IconButton
          onClick={() => setVolumeSliderVisible(!volumeSliderVisible)}
          size="small"
          sx={{
            color: 'text.primary'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </IconButton>
        <IconButton
          onClick={() => onDownload()}
          size="small"
          sx={{
            color: 'text.primary'
          }}
        >
          <Download />
        </IconButton>
      </Stack>

      {/* Time Display */}
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatTime(currentTime)}
        </Typography>
        <IconButton
          onClick={togglePlay}
          disabled={isLoading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            width: 36,
            height: 36,
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          size="small"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </IconButton>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatTime(duration)}
        </Typography>
      </Stack>
    </Box>
  );
};

export default AudioPlayer;
