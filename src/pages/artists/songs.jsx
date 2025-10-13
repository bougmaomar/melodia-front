import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Box, Stack, Button, Pagination, TextField, IconButton } from '@mui/material';
import { Add, ViewList, ViewModule } from '@mui/icons-material';
import { ArrangeVertical } from 'iconsax-react';

// project imports
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import SongEmpty from 'sections/apps/songs/SongEmpty';
import MainCard from 'components/MainCard';
import SongCard from 'components/cards/artist/SongCard';
import useSongs from 'hooks/useSongs';
import { FormattedMessage } from 'react-intl';
import SongList from 'components/cards/artist/SongList';

const ArtistSongs = () => {
  const history = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const songsPerPage = 8;
  const { getArtistSongs } = useSongs();
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const [productLoading, setProductLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newer');
  const [songs, setSongs] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // "grid" or "list"

  useEffect(() => {
    setProductLoading(false);
  }, []);

  const fetchFavorites = async () => {
    const favoriteSongs = await getArtistSongs(user.email);
    setSongs(favoriteSongs);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleAddSong = async () => {
    history(`/artist/add-song`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSongs = useMemo(() => {
    const searchFilteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const sortedSongs = searchFilteredSongs.sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return sortOrder === 'newer' ? dateB - dateA : dateA - dateB;
    });

    return sortedSongs;
  }, [songs, searchTerm, sortOrder]);

  const paginatedSongs = useMemo(() => {
    return filteredSongs.slice((page - 1) * songsPerPage, page * songsPerPage);
  }, [filteredSongs, page]);

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <TextField label={<FormattedMessage id="search" />} variant="outlined" value={searchTerm} onChange={handleSearch} />

          <Stack direction="row" spacing={1}>
            {/* View Mode Toggle */}
            <IconButton size="large" color="purple" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setSortOrder(sortOrder === 'newer' ? 'older' : 'newer')}
              startIcon={<ArrangeVertical />}
            >
              {sortOrder === 'newer' ? <FormattedMessage id="newer" /> : <FormattedMessage id="older" />}
            </Button>
            <Button variant="contained" onClick={handleAddSong} startIcon={<Add />}>
              <FormattedMessage id="addSong" />
            </Button>
          </Stack>
        </Stack>
      </Box>
      <MainCard
        sx={{
          bgcolor: 'transparent',
          borderRadius: '4px 0 0 4px',
          border: 'none',
          width: '100%'
        }}
        content={false}
      >
        <Grid container spacing={3}>
          {productLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid key={item} item xs={12} sm={6} md={4}>
                <SkeletonProductPlaceholder />
              </Grid>
            ))
          ) : paginatedSongs.length > 0 ? (
            viewMode === 'grid' ? (
              // Grid View
              <>
                {paginatedSongs.map((song, index) => (
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
                      detailLink="/artist/songs-details"
                      refreshFavorites={fetchFavorites}
                    />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {paginatedSongs.map((song) => (
                  <Grid key={song.id} item xs={12} sx={{ marginInlineEnd: 4 }}>
                    <SongList song={song} />
                  </Grid>
                ))}
              </>
            )
          ) : (
            <SongEmpty />
          )}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={Math.ceil(songs.length / songsPerPage)} page={page} onChange={handlePageChange} />
        </Box>
      </MainCard>
    </>
  );
};

export default ArtistSongs;
