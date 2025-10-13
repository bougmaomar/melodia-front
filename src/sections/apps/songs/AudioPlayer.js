import { useEffect } from 'react';
import { Grid, Typography, Stack, Box, IconButton, TextField, FormHelperText } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { PlayArrow, Pause, CloudUpload } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { API_MEDIA_URL } from 'config';

const AudioUploadPlayer = ({ label, file, onFileChange, error, isPlaying, onPlayPause, audioRef }) => {
  const theme = useTheme();

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

  // Determine the source URL based on file type (File object or backend URL string)
  const audioSrc = file instanceof File ? URL.createObjectURL(file) : `${API_MEDIA_URL}${file}`;

  return (
    <Grid item xs={12} md={4}>
      <Typography color="error.main">
        *{' '}
        <Typography component="span" color="textSecondary">
          <FormattedMessage id={label} />
        </Typography>
      </Typography>
      <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
        <Box
          sx={{
            width: 200,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.300',
            borderRadius: '8px',
            position: 'relative'
          }}
        >
          {file && (
            <audio ref={audioRef} src={audioSrc}>
              <track kind="captions" srcLang="en" label="Audio" />
            </audio>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute'
            }}
          >
            {/* Play/Pause Button, only visible when file is uploaded */}
            {file && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPause();
                }}
                sx={{ color: theme.palette.primary.main, fontSize: '3rem' }}
              >
                {isPlaying ? <Pause sx={{ fontSize: 80 }} /> : <PlayArrow sx={{ fontSize: 80 }} />}
              </IconButton>
            )}

            {/* Upload New File Button */}
            <IconButton
              onClick={() => document.getElementById(`change-${label}`).click()}
              sx={{ color: theme.palette.primary.main, fontSize: '3rem' }}
            >
              <CloudUpload sx={{ fontSize: 80 }} />
            </IconButton>
          </Box>
        </Box>
        <TextField
          type="file"
          id={`change-${label}`}
          sx={{ display: 'none' }}
          onChange={(event) => {
            // const newFile = event.target.files[0];
            onFileChange(event);
          }}
          accept="audio/mpeg, audio/wav, audio/ogg, audio/mp4, audio/webm"
        />
        <FormHelperText style={{ color: 'red' }}>{error}</FormHelperText>
      </Stack>
    </Grid>
  );
};

export default AudioUploadPlayer;
