import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Grid, Stack, Typography, CardMedia, Menu, MenuItem, Divider, IconButton, Box, Dialog, DialogContent, DialogContentText } from '@mui/material';
import MoreIcon from 'components/@extended/MoreIcon';
import Pagination from '@mui/material/Pagination';
import CardContent from '@mui/material/CardContent';
import { DebouncedInput } from 'components/third-party/react-table';
import { Add, SearchNormal1, ArrowRight2, Trash } from 'iconsax-react';
import AntAvatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import axios from 'utils/axios';
import { API_URL, API_MEDIA_URL } from 'config';
import { format } from 'date-fns';
import useAlbums from 'hooks/useAlbums';

export default function CardAlbums() {
  const history = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const { deleteAlbum } = useAlbums();
  const albumsPerPage = 6;
  const isMounted = useRef(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const openMenu = Boolean(anchorEl);
  const user = JSON.parse(localStorage.getItem('user'));

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
        window.location.href = '/artist/albums';
      } else {
        setErrorMessage('Error during deleting album');
      }
    } catch (error) {
      console.error('Error editing album:', error);
      setErrorMessage('Error during deleting album');
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const getAllAlbums = async () => {
      try {
        const response = await axios.get(`${API_URL}/Albums/artist/${user.userId}`);
        if (isMounted.current) {
          const albumData = response.data?.$values;
          if (Array.isArray(albumData)) {
            const updatedAlbums = albumData.map((album) => ({
              ...album,
              coverImage: `${API_MEDIA_URL}${album.coverImage}`
            }));
            setAlbums(updatedAlbums);
          } else {
            setAlbums([]);
          }
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
            direction="row"
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={handleGlobalFilterChange}
              placeholder={`Search ${albums.length} records...`}
              startAdornment={<SearchNormal1 size={18} />}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button variant="contained" onClick={() => history(`/artist/albums/add-album`)} size="large" startIcon={<Add />}>
                Add Album
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {paginatedAlbums.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {paginatedAlbums.map((album) => (
              <Grid item xs={12} sm={6} md={4} key={album.id}>
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
                    <CardMedia
                      sx={{ height: 250, borderRadius: 2, boxShadow: 3, textDecoration: 'none' }}
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

                  <Divider />

                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={2}>
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
                        Released on {formatReleaseDate(album.releaseDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By {formatArtistNames(album.artistNames)}
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
                    <MenuItem onClick={() => handleEditAlbum(currentAlbum?.id)}>Edit</MenuItem>
                    <MenuItem onClick={handleDeleteAlbum}>Delete</MenuItem>
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
                            Are you sure you want to delete?
                          </Typography>
                          <Typography align="center">By Clicking Delete you desactivate the album :</Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                          <Button fullWidth onClick={() => setOpenDelete(false)} color="secondary" variant="outlined">
                            Cancel
                          </Button>
                          <Button fullWidth color="error" variant="contained" onClick={() => handleDelete(currentAlbum?.id)} autoFocus>
                            Delete
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
              <CardMedia component="img" image="assets/images/e-commerce/empty-song.jpg" title="Cart Empty" sx={{ width: { xs: 240, md: 320, lg: 440 } }} />
            </Grid>
            <Grid item>
              <Stack spacing={0.5}>
                <Typography variant="h3" color="inherit">
                  There are no albums
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  Try adding new albums
                </Typography>
                <Box sx={{ pt: 3 }}>
                  <Button variant="contained" size="large" color="error" endIcon={<ArrowRight2 />} onClick={() => history(`/artist/albums/add-album`)}>
                    Add Album
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
