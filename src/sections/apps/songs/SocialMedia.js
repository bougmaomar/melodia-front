import { useState } from 'react';
import { Grid, Button, Box, Modal, TextField, Typography, IconButton } from '@mui/material';
import { Spotify, Youtube, AddCircle, Edit, Trash } from 'iconsax-react';
import useSongs from 'hooks/useSongs';

const SocialMediaIcons = ({ song }) => {
  const [open, setOpen] = useState(false);
  const [newLink, setNewLink] = useState('');
  const { updateSongMedia } = useSongs();
  const [currentPlatform, setCurrentPlatform] = useState('');

  const handleOpen = (platform, existingLink = '') => {
    setCurrentPlatform(platform);
    setNewLink(existingLink);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewLink('');
    setCurrentPlatform('');
  };

  const handleSave = async () => {
    const response = await updateSongMedia(song.id, currentPlatform, newLink);
    if (response) {
      handleClose();
      window.location.href = `/agent/songs-details/${song.id}`;
    } else {
      console.log('Failed to update');
      handleClose();
    }
  };

  const handleDelete = async (platform) => {
    const response = await updateSongMedia(song.id, platform, 'null');
    if (response) {
      window.location.href = `/agent/songs-details/${song.id}`;
    } else {
      console.log('Failed to delete');
    }
  };

  return (
    <>
      <Grid container marginBlock={3} justifyContent="start" gap={2}>
        {/* Spotify */}
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Spotify size={32} />}
            sx={{
              bgcolor: song.spotify ? '#1DB954' : 'gray',
              color: 'white',
              '&:hover': { bgcolor: song.spotify ? '#1AA34A' : 'gray' }
            }}
            href={song.spotify || '#'}
            target="_blank"
            disabled={!song.spotify}
          >
            Spotify
          </Button>
          {song.spotify ? (
            <>
              <IconButton onClick={() => handleOpen('Spotify', song.spotify)}>
                <Edit size={32} />
              </IconButton>
              <IconButton onClick={() => handleDelete('Spotify')}>
                <Trash size={32} />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => handleOpen('Spotify')}>
              <AddCircle size={32} style={{ color: '#1DB954' }} />
            </IconButton>
          )}
        </Grid>
      </Grid>
      <Grid>
        {/* YouTube */}
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Youtube size={32} />}
            sx={{
              bgcolor: song.youTube ? '#FF0000' : 'gray',
              color: 'white',
              '&:hover': { bgcolor: song.youTube ? '#CC0000' : 'gray' }
            }}
            href={song.youTube || '#'}
            target="_blank"
            disabled={!song.youTube}
          >
            YouTube
          </Button>
          {song.youTube ? (
            <>
              <IconButton onClick={() => handleOpen('Youtube', song.youTube)}>
                <Edit size={32} />
              </IconButton>
              <IconButton onClick={() => handleDelete('Youtube')}>
                <Trash size={32} />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => handleOpen('Youtube')}>
              <AddCircle size={32} style={{ color: '#FF0000' }} />
            </IconButton>
          )}
        </Grid>
      </Grid>

      {/* Modal for Adding or Editing a Link */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 300
          }}
        >
          <Typography variant="h6">{newLink ? `Modify ${currentPlatform} Link` : `Add ${currentPlatform} Link`}</Typography>
          <TextField
            fullWidth
            label="Enter URL"
            variant="outlined"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSave}>
              {newLink ? 'Update' : 'Save'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SocialMediaIcons;
