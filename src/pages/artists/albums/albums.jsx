import { useState, useEffect, useRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';
import { API_URL, API_MEDIA_URL } from 'config';
import { format } from 'date-fns';

// material ui
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
  Menu,
  IconButton,
  Box,
  Pagination,
  CardContent,
  useMediaQuery
} from '@mui/material';
import { Add, SearchNormal1, ArrowRight2, Trash, RefreshCircle } from 'iconsax-react';

// assets
import imageEmpty from 'assets/images/e-commerce/empty-song.jpg';
import { DebouncedInput } from 'components/third-party/react-table';
import MoreIcon from 'components/@extended/MoreIcon';
import AntAvatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

import useAlbums from 'hooks/useAlbums';

export default function CardAlbums() {
  const user = JSON.parse(localStorage.getItem('user'));
  const history = useNavigate();
  const isMounted = useRef(false);
  const { formatMessage } = useIntl();
  const { deleteAlbum } = useAlbums();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [globalFilter, setGlobalFilter] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [page, setPage] = useState(1);
  const albumsPerPage = 8;
  const openMenu = Boolean(anchorEl);

  const fetchUpdatedAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/Albums/artist/${user.userId}`);
      if (response.data?.$values) {
        return response.data.$values.map((album) => ({
          ...album,
          coverImage: `${API_MEDIA_URL}${album.coverImage}`
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching albums:', error);
      return [];
    }
  };

  const handleMenuClick = (event, album) => {
    setAnchorEl(event.currentTarget);
    setCurrentAlbum(album);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditAlbum = (id) => {
    history(`/artist/albums/update-album/${id}`);
    handleMenuClose();
  };

  const handleDeleteAlbum = () => {
    setOpenDelete(true);
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleGlobalFilterChange = (value) => {
    setGlobalFilter(value);
  };

  const sortAlbums = (albums, sortBy) => {
    switch (sortBy) {
      case 'Album Type':
        return [...albums].sort((a, b) => a.albumTypeName.localeCompare(b.albumTypeName));
      case 'Release Date':
        return [...albums].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
      default:
        return albums;
    }
  };

  const filterAlbums = (albumsArray) => {
    if (!globalFilter) return albumsArray;
    return albumsArray.filter((album) => album.name.toLowerCase().includes(globalFilter.toLowerCase()));
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAlbum(id);
      if (res) {
        setOpenDelete(false);
        setErrorMessage('');
        const updatedAlbums = await fetchUpdatedAlbums();
        setAlbums(updatedAlbums);
        history('/artist/albums');
      } else {
        setErrorMessage('Error during deleting album');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      setErrorMessage('Error during deleting album');
    }
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  useEffect(() => {
    isMounted.current = true;

    const getAllAlbums = async () => {
      try {
        const updatedAlbums = await fetchUpdatedAlbums();

        if (isMounted.current) {
          setAlbums(updatedAlbums);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
        if (isMounted.current) setAlbums([]);
      }
    };

    getAllAlbums();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let updatedAlbums = filterAlbums(albums);
    updatedAlbums = sortAlbums(updatedAlbums);
    setFilteredAlbums(updatedAlbums);
  }, [albums, globalFilter]);

  const paginatedAlbums = Array.isArray(filteredAlbums) ? filteredAlbums.slice((page - 1) * albumsPerPage, page * albumsPerPage) : [];

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM - yyyy');
  };

  const handleAddAlbum = async () => {
    history(`/artist/albums/add-album`);
  };

  return (
    <>
      {/* search and filter */}
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={handleGlobalFilterChange}
              placeholder={`${formatMessage({ id: 'search' })} ${albums.length} ${formatMessage({ id: 'record' })}`}
              startAdornment={<SearchNormal1 size={18} />}
            />

            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <Box>
                <IconButton size="large" color="purple" onClick={toggleViewMode}>
                  {viewMode === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
              </Box>
              <Button variant="contained" onClick={handleAddAlbum} size="large" startIcon={<Add />}>
                <FormattedMessage id="Add_Album" />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {paginatedAlbums.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            /* --- Cards view --- */
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
                    <Box sx={{ width: '100%', m: 'auto', position: 'relative' }}>
                      <CardMedia
                        sx={{ aspectRatio: '1 / 1', borderRadius: 2, boxShadow: 3, textDecoration: 'none', opacity: 1 }}
                        image={album.coverImage}
                        alt={album.title}
                        component={Link}
                        to={`/artist/album-details/${album.id}`}
                      />
                      <IconButton
                        edge="end"
                        aria-label="options"
                        onClick={(e) => handleMenuClick(e, album)}
                        sx={{ position: 'absolute', top: 10, right: 10, '&:hover': { bgcolor: 'transparent' } }}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Typography
                          component={Link}
                          to={`/artist/album-details/${album.id}`}
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
                          <FormattedMessage id="release_date" />: {formatReleaseDate(album.releaseDate)}
                        </Typography>
                      </Stack>
                    </CardContent>

                    <Menu
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem onClick={() => handleEditAlbum(currentAlbum.id)}>
                        <FormattedMessage id="edit" />
                      </MenuItem>
                      <MenuItem onClick={handleDeleteAlbum}>
                        <FormattedMessage id="delete" />
                      </MenuItem>
                    </Menu>
                  </MainCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            /* --- List View --- */
            <Box sx={{ width: '100%', p: 2 }}>
              <Stack spacing={2}>
                {paginatedAlbums.map((album) => (
                  <Box
                    key={album.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderBottom: '1px solid #ddd',
                      borderRadius: 2,
                      boxShadow: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': { boxShadow: 6, backgroundColor: 'rgba(0,0,0,0.02)' }
                    }}
                    onClick={() => history(`/artist/album-details/${album.id}`)}
                  >
                    {/* Album Cover & Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CardMedia
                        component="img"
                        image={album.coverImage}
                        alt={album.title}
                        sx={{
                          width: '100%',
                          paddingTop: '100%', // carré parfait
                          position: 'relative',
                          borderRadius: 2,
                          boxShadow: 3,
                          backgroundImage: `url(${album.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <Stack>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {album.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                          {album.albumTypeName.toUpperCase()}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Release Date */}
                    <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      {formatReleaseDate(album.releaseDate)}
                    </Typography>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleEditAlbum(album.id)}>
                        <RefreshCircle size={36} color="orange" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setCurrentAlbum(album);
                          handleDeleteAlbum();
                        }}
                      >
                        <Trash size={36} color="red" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
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
                    <FormattedMessage id="Delete_Sure" />
                  </Typography>
                  <Typography align="center">
                    <FormattedMessage id="Delete_Click" />
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                  <Button fullWidth onClick={() => setOpenDelete(false)} color="secondary" variant="outlined">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button fullWidth color="error" variant="contained" onClick={() => handleDelete(currentAlbum.id)} autoFocus>
                    <FormattedMessage id="delete" />
                  </Button>
                </Stack>
              </Stack>
              <DialogContentText color="error">{errorMessage}</DialogContentText>
            </DialogContent>
          </Dialog>
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
              <CardMedia component="img" image={imageEmpty} title="Cart Empty" sx={{ width: { xs: 240, md: 320, lg: 440 } }} />
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
                  <Button variant="contained" size="large" color="error" endIcon={<ArrowRight2 />} onClick={handleAddAlbum}>
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
