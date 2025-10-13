import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Box, CardMedia, Button } from '@mui/material';
import { DocumentDownload, InfoCircle } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

const SongList = ({ title, songs }) => {
  console.log('songs:', songs);
  return (
    <Box mb={4}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {!songs || songs.length === 0 ? (
        <Typography variant="body1" color="error">
          <FormattedMessage id="no_exist_songs" />
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {songs.slice(0, 10).map((song) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={song.id}>
              <Card sx={{ position: 'relative', boxShadow: 3, borderRadius: 2, height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${API_MEDIA_URL}${song.coverImagePath}`}
                  alt={song.title}
                  sx={{ objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
                />
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                  <Typography variant="caption" sx={{ background: '#1976d2', color: 'white', borderRadius: '4px', padding: '2px 4px' }}>
                    {song.genreMusic ? song.genreMusic.name : 'N/A'}
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {song.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>
                      <FormattedMessage id="artists" /> :
                    </strong>{' '}
                    {Array.isArray(song.artistNames?.$values) ? song.artistNames.$values.map((artist) => artist).join(', ') : 'N/A'}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<DocumentDownload />}
                    href={`${API_MEDIA_URL}${song.mp3FilePath}`}
                    sx={{ marginRight: '8px' }}
                  >
                    MP3
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<DocumentDownload />}
                    href={`${API_MEDIA_URL}${song.wavFilePath}`}
                    sx={{ marginRight: '8px' }}
                  >
                    WAV
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<InfoCircle />}
                    onClick={() => showSongDetails(song)}
                  >
                    <FormattedMessage id="details" />
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  function showSongDetails(song) {
    // Logic to display song details
    console.log(`Showing details for ${song.title}`);
  }
};

SongList.propTypes = {
  title: PropTypes.string.isRequired,
  songs: PropTypes.array.isRequired
};

export default SongList;
