import React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
// material-ui
import { Grid, Box, Stack, Typography, Button, Pagination, CardMedia } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Add } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import imageEmpty from 'assets/images/e-commerce/empty-song.jpg';

// project-imports
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import MainCard from 'components/MainCard';
import SongCard from 'components/cards/artist/SongCard';
import useSongs from 'hooks/useSongs';
import useArtist from 'hooks/useArtist';
import useAgent from 'hooks/useAgent';
import { useTheme } from '@mui/material/styles';

// ==============================|| AGENT - SONGS ||============================== //

const ArtistSongs = () => {
  const theme = useTheme();

  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const { getSongsByArtistId } = useSongs();
  const { getArtistsByAgent } = useArtist();
  const { getAllSongsByAgent } = useAgent();

  const user = JSON.parse(localStorage.getItem('user'));
  const [productLoading, setProductLoading] = useState(true);
  const [selectArtist, setSelectArtist] = useState('');
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistid, setArtistid] = useState(0);
  const [page, setPage] = useState(1);
  const songsPerPage = 8;

  useEffect(() => {
    setProductLoading(false);
  }, []);

  const getSongs = useCallback(
    async (id) => {
      try {
        const songData = await getSongsByArtistId(id);
        if (Array.isArray(songData)) {
          setSongs(songData);
        } else {
          setSongs([]);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    },
    [getSongsByArtistId]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allSongs, artistsData] = await Promise.all([getAllSongsByAgent(user.userId), getArtistsByAgent(user.userId)]);

        setSongs(allSongs);
        const artistList = artistsData?.$values?.map((artist) => ({
          id: artist.artistId,
          Header: artist.artistRealName,
          canSort: true
        }));
        setArtists(artistList);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [user.userId]);

  const handleSelectArtist = (value) => {
    setSelectArtist(value);
    setArtistid(value);
    if (value) {
      getSongs(value);
    } else {
      const fetchData = async () => {
        try {
          const allSongs = await getAllSongsByAgent(user.userId);
          setSongs(allSongs);
        } catch (err) {
          console.error('Error fetching albums:', err);
        }
      };

      setArtistid(0);
      fetchData();
    }
  };

  const handleAddSong = (id) => {
    navigate(`/agent/songs/add-song/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedSongs = useMemo(() => {
    return [...songs]
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice((page - 1) * songsPerPage, page * songsPerPage);
  }, [songs, page]);

  const fetchFavorites = async () => {
    const favoriteSongs = await getAllSongsByAgent(user.userId);
    setSongs(favoriteSongs);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  let songResult = <></>;
  if (paginatedSongs && paginatedSongs.length > 0) {
    songResult = paginatedSongs.map((song, index) => (
      <Grid key={index} item xs={12} sm={6} md={3}>
        <SongCard
          id={song.id}
          coverImage={song.coverImagePath}
          audioPath={song.mp3FilePath}
          title={song.title}
          artists={song.artistNames}
          album={song.albumTitle}
          releaseDate={song.releaseDate}
          totalDuration={song.duration}
          detailLink="/agent/songs-details"
          refreshFavorites={fetchFavorites}
        />
      </Grid>
    ));
  } else {
    songResult = (
      <Grid item xs={12} sx={{ mt: 3 }}>
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
                  <FormattedMessage id="noSongs" />
                </Typography>
                <Typography variant="h5" color="textSecondary">
                  <FormattedMessage id="tryAddSongs" />
                </Typography>
                <Box sx={{ pt: 3 }}>
                  <Button variant="contained" color="error" onClick={() => handleAddSong(artistid)} size="large" startIcon={<Add />}>
                    <FormattedMessage id="addSong" />
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    );
  }
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
              <Autocomplete
                id="select-artist"
                options={artists}
                getOptionLabel={(option) => option.Header || ''}
                value={artists.find((artist) => artist.id === selectArtist) || null}
                onChange={(event, newValue) => handleSelectArtist(newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label={<FormattedMessage id="selectArtist" />} variant="outlined" size="large" />
                )}
                sx={{ minWidth: 300 }}
              />
            </Stack>
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <Button variant="contained" onClick={() => handleAddSong(artistid)} size="large" startIcon={<Add />}>
                <FormattedMessage id="addSong" />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <MainCard
        sx={{
          bgcolor: 'transparent',
          borderRadius: '4px 0 0 4px',
          border: 'none'
        }}
        content={false}
      >
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {productLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Grid key={item} item xs={12} sm={6} md={4}>
                      <SkeletonProductPlaceholder />
                    </Grid>
                  ))
                : songResult}
            </Grid>
          </Grid>
        </Grid>{' '}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={Math.ceil(songs.length / songsPerPage)} page={page} onChange={handlePageChange} />
        </Box>
      </MainCard>
    </>
  );
};

export default ArtistSongs;
