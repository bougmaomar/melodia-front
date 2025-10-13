import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { handleDownloadSong } from 'utils/globals/functions';
import { FormattedMessage } from 'react-intl';
import { API_MEDIA_URL } from 'config';

// material-ui
import { Box, Divider, Grid, Stack, Tab, Tabs, Dialog, DialogContent, DialogContentText, Typography, Button } from '@mui/material';
import AntAvatar from 'components/@extended/Avatar';
import { Trash } from 'iconsax-react';
import { Add, Update, Delete } from '@mui/icons-material';

// project-imports
import MainCard from 'components/MainCard';
import SongDetail from 'sections/apps/songs/SongDetails';
import SongCover from 'sections/apps/songs/SongCover';
import AudioPlayer from 'components/AudioPlayer';
import SongInfos from 'sections/apps/songs/SongInfos';
// import RelatedSongs from 'sections/apps/songs/RelatedSongs';
import SocialMediaIcons from 'sections/apps/songs/SocialMedia';
import PopularityChart from 'components/PopularityChart';

// hooks
import useSongs from 'hooks/useSongs';
import useArtist from 'hooks/useArtist';
import useSpotify from 'hooks/useSpotify';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`song-details-tabpanel-${index}`}
      aria-labelledby={`song-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `song-details-tab-${index}`,
    'aria-controls': `song-details-tabpanel-${index}`
  };
}

// ==============================|| ARTIST - SONG DETAILS ||============================== //

const SongDetails = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const { getSongById, deleteSong } = useSongs();
  const history = useNavigate();
  const { getArtistByEmail } = useArtist();
  const { getPopularity } = useSpotify();

  const [song, setSong] = useState();
  const [value, setValue] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nameArtist, setNameArtist] = useState('');
  const [popularity, setPopularity] = useState(0);

  const alreadyExecuted = useRef(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alb = await getSongById(id);
        setSong(alb);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, getSongById]);

  const handleDelete = async () => {
    try {
      const res = await deleteSong(id);
      if (res) {
        setOpenDelete(false);
        setErrorMessage('');
        window.location.href = '/artist/songs';
      } else {
        setErrorMessage('Error during deleting song');
      }
    } catch (error) {
      console.error('Error editing song:', error);
      setErrorMessage('Error during deleting song');
    }
  };

  const handleArtist = async () => {
    try {
      if (song && song.artistEmails && song.artistEmails.$values[0] !== undefined) {
        const res = await getArtistByEmail(song.artistEmails.$values[0]);

        if (res) {
          setNameArtist(res.name);
        } else {
          console.log('Error during getting artist');
        }
      }
    } catch (error) {
      console.error('Error getting artist:', error);
      setErrorMessage('Error during getting artist');
    }
  };

  useEffect(() => {
    handleArtist();
  }, [song]);

  const handlePopularity = async () => {
    try {
      const popularity = await getPopularity(song.title, nameArtist);
      setPopularity(popularity);
    } catch (error) {
      console.error('Error fetching popularity:', error);
      setErrorMessage('Error fetching popularity');
    }
  };

  useEffect(() => {
    if (song !== undefined && nameArtist !== '' && !alreadyExecuted.current) {
      alreadyExecuted.current = true; // Bloque les appels suivants
      handlePopularity();
    }
  }, [song, nameArtist]);
  return (
    <>
      {song && song.id === Number(id) && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={4}>
                <SongCover coverImage={song.coverImagePath} />
              </Grid>
              <Grid item container xs={12} sm={6} md={8}>
                <Grid item xs={6} md={7}>
                  <SongInfos song={song} />
                </Grid>

                <Grid item xs={6} md={4}>
                  <Typography variant="h6" color="text.secondary" align="center">
                    <FormattedMessage id="popularity" />
                  </Typography>
                  <PopularityChart
                    value={popularity}
                    onChange={handleArtist}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '25%'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                    <Grid></Grid>
                    <Button variant="outlined" color="primary" startIcon={<Add />} onClick={() => history('/artist/add-song')}>
                      <FormattedMessage id="addSong" />
                    </Button>
                    <Button variant="outlined" color="warning" startIcon={<Update />} onClick={() => history(`/artist/update-song/${id}`)}>
                      <FormattedMessage id="updateSong" />
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setOpenDelete(true)}>
                      <FormattedMessage id="deleteSong" />
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, width: '100%' }}>
                    <AudioPlayer
                      src={song && `${API_MEDIA_URL}${song.mp3FilePath}`}
                      onDownload={() => handleDownloadSong(song.mp3FilePath, 'Artist', () => {}, song.id, user.userId)}
                      onPlay={() => {}}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Delete language Dialog */}
          <Dialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            keepMounted
            maxWidth="xs"
            aria-labelledby="column-delete-title"
            aria-describedby="column-delete-description"
          >
            <DialogContent sx={{ mt: 2, my: 1 }}>
              <Stack alignItems="center" spacing={3.5}>
                <AntAvatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                  <Trash variant="Bold" />
                </AntAvatar>
                <Stack spacing={2}>
                  <Typography variant="h4" align="center">
                    <FormattedMessage id="confirmDelete" />
                  </Typography>
                  <Typography align="center">
                    <FormattedMessage id="explainDelete" />
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                  <Button fullWidth onClick={() => setOpenDelete(false)} color="secondary" variant="outlined">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button fullWidth color="error" variant="contained" onClick={handleDelete} autoFocus>
                    <FormattedMessage id="delete" />
                  </Button>
                </Stack>
              </Stack>
              <DialogContentText color="error">{errorMessage}</DialogContentText>
            </DialogContent>
          </Dialog>
          <Grid item xs={12}>
            <MainCard>
              <Stack spacing={3}>
                <Stack>
                  <Tabs
                    value={value}
                    indicatorColor="primary"
                    onChange={handleChange}
                    aria-label="album description tabs example"
                    variant="scrollable"
                  >
                    <Tab component={Link} to="#" label={<FormattedMessage id="details" />} {...a11yProps(0)} />
                    <Tab component={Link} to="#" label={<FormattedMessage id="lyrics" />} {...a11yProps(1)} />
                    <Tab component={Link} to="#" label={<FormattedMessage id="socialMedia" />} {...a11yProps(2)} />
                  </Tabs>
                  <Divider />
                </Stack>
                <TabPanel value={value} index={0}>
                  <SongDetail song={song} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Grid item xs={12}>
                    {song.lyrics.split('<br />').map((line, index) => (
                      <Typography key={index} component="p" variant="body1" gutterBottom>
                        {line}
                      </Typography>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <SocialMediaIcons song={song} />
                </TabPanel>
              </Stack>
            </MainCard>
          </Grid>
          {/* <Grid item xs={12} md={5} xl={4} sx={{ position: 'relative' }}>
            <MainCard
              title={<FormattedMessage id="relatedSongs" />}
              sx={{
                height: 'calc(100% - 16px)',
                position: { xs: 'relative', md: 'absolute' },
                top: '16px',
                left: { xs: 0, md: 16 },
                right: 0
              }}
              content={false}
            >
              <RelatedSongs id={id} />
            </MainCard>
          </Grid> */}
        </Grid>
      )}
    </>
  );
};

export default SongDetails;
