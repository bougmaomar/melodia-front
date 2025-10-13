import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { API_MEDIA_URL } from 'config';

// material-ui
import {
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Dialog,
  DialogContent,
  Typography,
  Button,
  DialogContentText,
  IconButton
} from '@mui/material';
import { Add, Update, Delete } from '@mui/icons-material';
import { Trash, ArrowLeft } from 'iconsax-react';
import AntAvatar from 'components/@extended/Avatar';

// project-imports
import MainCard from 'components/MainCard';
import AlbumInfo from 'sections/apps/albums/album-details/AlbumInfo';
import AlbumDetail from 'sections/apps/albums/album-details/AlbumDetail';
import AlbumSongs from 'sections/apps/albums/album-details/AlbumSongs';
import RelatedAlbums from 'sections/apps/albums/album-details/RelatedAlbums';
import PopularityChart from 'components/PopularityChart';

// hooks
import useAlbums from 'hooks/useAlbums';
import useSpotify from 'hooks/useSpotify';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`album-details-tabpanel-${index}`}
      aria-labelledby={`album-details-tab-${index}`}
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
    id: `album-details-tab-${index}`,
    'aria-controls': `album-details-tabpanel-${index}`
  };
}

// ==============================|| ECOMMERCE - ALBUM DETAILS ||============================== //

const AlbumDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const { getAlbumById } = useAlbums();
  const { getPopularityAlbum } = useSpotify();
  const [album, setAlbum] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [value, setValue] = useState(0);
  const { deleteAlbum } = useAlbums();
  const [errorMessage, setErrorMessage] = useState('');
  const initialImage = album ? `${API_MEDIA_URL}${album.coverImage}` : '';
  const [popularity, setPopularity] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteAlbum(id);
      if (res) {
        setOpenDelete(false);
        setErrorMessage('');
        window.location.href = '/agent/albums';
      } else {
        setErrorMessage('Error during deleting song');
      }
    } catch (error) {
      console.error('Error editing song:', error);
      setErrorMessage('Error during deleting song');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alb = await getAlbumById(id);
        setAlbum(alb);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, getAlbumById]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (album) {
          const res = await getPopularityAlbum(album.title, album.artistNames.$values[0]);
          if (res) {
            setPopularity(res);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [album, getPopularityAlbum]);

  return (
    <>
      {album && album.id === Number(id) && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3.5}>
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative',
                    aspectRatio: { xs: '2 / 1', sm: '1 / 1' },
                    overflow: 'hidden',
                    borderRadius: '12px'
                  }}
                >
                  <img
                    src={initialImage}
                    alt={album.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      display: 'block',
                      position: 'absolute',
                      flex: '1 0 auto',
                      aspectRatio: { xs: '2 / 1', sm: '1 / 1' }
                    }}
                  />
                  <IconButton
                    onClick={() => history(-1)}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '50%',
                      color: 'black',
                      width: 40,
                      height: 40,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                    }}
                  >
                    <ArrowLeft sx={{ fontSize: 24 }} />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item container xs={12} sm={6} md={8.5}>
                <Grid item xs={12} sm={6} md={7}>
                  <MainCard border={false} sx={{ height: '100%', bgcolor: 'secondary.lighter' }}>
                    <AlbumInfo album={album} />
                  </MainCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                    <Grid></Grid>
                    <Typography variant="h6" color="text.secondary" align="center">
                      <FormattedMessage id="popularity" />
                    </Typography>
                    <PopularityChart
                      value={popularity}
                      sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '25%'
                      }}
                    />
                    <Grid></Grid>
                    <Button variant="outlined" color="primary" startIcon={<Add />} onClick={() => history(`/agent/albums/add-album/${0}`)}>
                      <FormattedMessage id="Add_Album" />
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<Update />}
                      onClick={() => history(`/agent/albums/update-album/${id}`)}
                    >
                      <FormattedMessage id="updateAlbum" />
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setOpenDelete(true)}>
                      <FormattedMessage id="deleteAlbum" />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
          <Grid item xs={12} md={7} xl={8}>
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
                    <Tab component={Link} to="#" label={<FormattedMessage id="songs" />} {...a11yProps(0)} />
                    <Tab component={Link} to="#" label={<FormattedMessage id="details" />} {...a11yProps(1)} />
                  </Tabs>
                  <Divider />
                </Stack>
                <TabPanel value={value} index={0}>
                  <AlbumSongs songs={album.songs?.$values} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <AlbumDetail album={album} />s
                </TabPanel>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={5} xl={4} sx={{ position: 'relative' }}>
            <MainCard
              title={<FormattedMessage id="relatedAlbums" />}
              sx={{
                height: 'calc(100% - 16px)',
                position: { xs: 'relative', md: 'absolute' },
                top: '16px',
                left: { xs: 0, md: 16 },
                right: 0
              }}
              content={false}
            >
              <RelatedAlbums id={id} />
            </MainCard>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AlbumDetails;
