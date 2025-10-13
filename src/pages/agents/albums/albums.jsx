import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
  Button,
  MenuItem,
  Typography,
  CardMedia,
  CardContent,
  Menu,
  Divider,
  IconButton,
  Box,
  Pagination
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Add, ArrowRight2, Trash } from 'iconsax-react';
import MainCard from 'components/MainCard';
import AntAvatar from 'components/@extended/Avatar';
import MoreIcon from 'components/@extended/MoreIcon';
import { Autocomplete, TextField } from '@mui/material';
import imageEmpty from 'assets/images/e-commerce/empty-song.jpg';
import useAlbums from 'hooks/useAlbums';
import useArtist from 'hooks/useArtist';
import useAgent from 'hooks/useAgent';
import { format } from 'date-fns';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

export default function CardAlbums() {
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const albumsPerPage = 8;
  const [selectArtist, setSelectArtist] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [artistid, setArtistid] = useState(0);

  const { getArtistAlbums, deleteAlbum } = useAlbums();
  const { getArtistsByAgent } = useArtist();
  const { getAllAlbumsByAgent } = useAgent();
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  // Fetch artists on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allAlbums, artists] = await Promise.all([getAllAlbumsByAgent(user.userId), getArtistsByAgent(user.userId)]);
        if (Array.isArray(allAlbums)) {
          const updatedAlbums = allAlbums.map((album) => ({
            ...album,
            coverImage: `${API_MEDIA_URL}${album.coverImage}`
          }));
          setAlbums(updatedAlbums);
        } else {
          setAlbums([]);
        }

        setArtists(
          artists?.$values?.map((artist) => ({
            id: artist.artistId,
            Header: artist.artistRealName,
            canSort: true
          }))
        );
      } catch (err) {
        console.error('Error fetching artists:', err);
      }
    };

    fetchData();
  }, [user.userId]);

  const getAlbums = useCallback(
    async (id) => {
      try {
        const albumData = await getArtistAlbums(id);
        if (Array.isArray(albumData)) {
          const updatedAlbums = albumData.map((album) => ({
            ...album,
            coverImage: `${API_MEDIA_URL}${album.coverImage}`
          }));
          setAlbums(updatedAlbums);
        } else {
          setAlbums([]);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    },
    [getArtistAlbums]
  );

  useEffect(() => {
    let updatedAlbums = albums.filter((album) => album.title.toLowerCase());
    setFilteredAlbums(updatedAlbums);
  }, [albums]);

  const handleMenuClick = (event, album) => {
    setAnchorEl(event.currentTarget);
    setCurrentAlbum(album);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditAlbum = () => {
    if (currentAlbum?.id) {
      navigate(`/agent/albums/update-album/${currentAlbum.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteAlbum = () => {
    setOpenDelete(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (currentAlbum?.id) {
      try {
        const res = await deleteAlbum(currentAlbum.id);
        if (res) {
          setOpenDelete(false);
          setErrorMessage('');
          window.location.href = '/agent/albums';
        } else {
          setErrorMessage('Error during deleting album');
        }
      } catch (error) {
        console.error('Error deleting album:', error);
        setErrorMessage('Error during deleting album');
      }
    }
  };

  const handleAddAlbum = (id) => {
    navigate(`/agent/albums/add-album/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSelectArtist = (value) => {
    setSelectArtist(value);
    setArtistid(value);

    if (value) {
      getAlbums(value);
    } else {
      const fetchData = async () => {
        try {
          const allAlbums = await getAllAlbumsByAgent(user.userId);
          if (Array.isArray(allAlbums)) {
            const updatedAlbums = allAlbums.map((album) => ({
              ...album,
              coverImage: `${API_MEDIA_URL}${album.coverImage}`
            }));
            setAlbums(updatedAlbums);
          } else {
            setAlbums([]);
          }
        } catch (err) {
          console.error('Error fetching albums:', err);
        }
      };
      setArtistid(0);
      fetchData();
    }
  };

  const paginatedAlbums = useMemo(() => {
    return filteredAlbums.slice((page - 1) * albumsPerPage, page * albumsPerPage);
  }, [filteredAlbums, page]);

  const formatArtistNames = (artistNames) => {
    if (Array.isArray(artistNames)) {
      return artistNames.join(', ');
    } else if (typeof artistNames === 'string') {
      return artistNames;
    } else if (artistNames?.$values) {
      return artistNames.$values.join(', ');
    } else {
      return 'Unknown Artist';
    }
  };

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM - yyyy');
  };

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <Typography>
                <FormattedMessage id="chooseArtistForAlbums" />
              </Typography>
              <Autocomplete
                id="select-artist"
                options={artists}
                getOptionLabel={(option) => option.Header || ''}
                value={artists.find((artist) => artist.id === selectArtist) || null}
                onChange={(event, newValue) => handleSelectArtist(newValue?.id || '')}
                renderInput={(params) => <TextField {...params} label={<FormattedMessage id="select" />} variant="outlined" size="large" />}
                sx={{ minWidth: 300 }}
              />
              {/* <SortingSelect
                id="select-artist"
                label="Select Artist"
                sortBy={selectArtist}
                setSortBy={setSelectArtist}
                onChange={(event) => handleSelectArtist(event.target.value)}
                allColumns={artists}
              /> */}
            </Stack>
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <Button variant="contained" onClick={() => handleAddAlbum(artistid)} size="large" startIcon={<Add />}>
                <FormattedMessage id="Add_Album" />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {paginatedAlbums.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {paginatedAlbums.map((album) => (
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={album.id}>
                <MainCard
                  content={false}
                  sx={{
                    p: 2,
                    boxShadow: 4,
                    transition: 'transform 0.4s, box-shadow 0.4s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: 8 },
                    position: 'relative'
                  }}
                >
                  <Box sx={{ width: '100%', m: 'auto', marginBottom: '20px', position: 'relative' }}>
                    <Link to={`/agent/albums/album-details/${album.id}`} style={{ display: 'block', height: '100%' }}>
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        style={{ width: '100%', borderRadius: '12px', cursor: 'pointer', flex: '1 0 auto', height: 250 }}
                      />
                    </Link>
                    <IconButton
                      edge="end"
                      aria-label="options"
                      onClick={(e) => handleMenuClick(e, album)}
                      sx={{ position: 'absolute', top: 10, right: 10, '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>

                  <Divider />

                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography
                        component={Link}
                        to={`/agent/albums/album-details/${album.id}`}
                        color="text.primary"
                        variant="h5"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          textDecoration: 'none'
                        }}
                      >
                        {album.title} - {album.albumTypeName.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage id="release_date" /> {formatReleaseDate(album.releaseDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage id="By" /> {formatArtistNames(album.artistNames)}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleEditAlbum}>
                      <FormattedMessage id="edit" />
                    </MenuItem>
                    <MenuItem onClick={handleDeleteAlbum}>
                      <FormattedMessage id="delete" />
                    </MenuItem>
                  </Menu>

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
                            <FormattedMessage id="Delete_Click" />
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
                </MainCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={Math.ceil(filteredAlbums.length / albumsPerPage)} page={page} onChange={handlePageChange} />
          </Box>
        </>
      ) : (
        <MainCard content={false}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={3}
            sx={{ my: 3, height: { xs: 'auto', md: 'calc(100vh - 240px)' }, p: { xs: 2.5, md: 'auto' } }}
          >
            <Grid item>
              <CardMedia
                component="img"
                image={imageEmpty}
                title="Cart Empty"
                sx={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  paddingTop: '100%', // carré parfait
                  position: 'relative',
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </Grid>
            <Grid item>
              <Stack spacing={0.5}>
                <Typography variant={matchDownMD ? 'h3' : 'h1'} color="inherit">
                  <FormattedMessage id="No_Album" />
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  <FormattedMessage id="Try_new_album" />
                </Typography>
                <Box sx={{ pt: 3 }}>
                  <Button variant="contained" size="large" color="error" endIcon={<ArrowRight2 />} onClick={() => handleAddAlbum(artistid)}>
                    <FormattedMessage id="Add_Album" />
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}
