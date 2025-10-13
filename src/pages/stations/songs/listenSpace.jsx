import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import useSongs from 'hooks/useSongs';
import useAdmin from 'hooks/useAdmin';
import useStation from 'hooks/useSation';
import useArtist from 'hooks/useArtist';
// import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  Container,
  Stack,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  // useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Pagination,
  Button,
  ListItemText
  // Chip
} from '@mui/material';
import { ArrangeVertical, ArrowRight2, Clock } from 'iconsax-react';
import { SortingSelect, CSVExport } from 'components/third-party/ReactTable';
import { FormattedMessage, useIntl } from 'react-intl';
import NoFoundIllustrate from 'assets/images/maintenance/noProposition.png';
import SongsCard from 'components/cards/artist/SongsCard';
import { toast, ToastContainer } from 'react-toastify';
import { extractMinutesSeconds, formatDate2 } from 'utils/globals/functions';

const ListenPage = () => {
  // const theme = useTheme();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();
  const { getSongsForStation, getSongsByLanguage, getSongsByType, getSongsByArtist } = useSongs();
  const { getLanguages, getGenreMusics, getArtists } = useAdmin();
  const { getArtistByEmail } = useArtist();
  const { sendToAccepted } = useStation();
  const history = useNavigate();
  const [allsongs, setAllsongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [primarySort, setPrimarySort] = useState('all');
  const [secondarySortOptions, setSecondarySortOptions] = useState([]);
  const [secondarySort, setSecondarySort] = useState('');
  const [errors, setErrors] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // Default to newest

  const songsPerPage = 3;




  const sortItems = [
    { id: 'all', Header: 'All', canSort: true },
    { id: 'langue', Header: 'Langue', canSort: true },
    { id: 'type', Header: 'Type', canSort: true },
    { id: 'artists', Header: 'Artists', canSort: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [langs, genres, artists, songs] = await Promise.all([getLanguages(), getGenreMusics(), getArtists(), getSongsForStation()]);
        setLanguages(langs.map((lang) => ({ id: lang.id, Header: lang.label, canSort: true })));
        setTypes(genres.map((genre) => ({ id: genre.id, Header: genre.name, canSort: true })));
        setArtists(artists.map((artist) => ({ id: artist.artistId, Header: artist.artistRealName, canSort: true })));
        setAllsongs(songs);
        setSongs(songs);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    setErrors({});
  }, []);

  const handlePrimarySortChange = (selectedSort) => {
    setPrimarySort(selectedSort);
    setSecondarySort('');

    if (selectedSort === 'langue') {
      setSecondarySortOptions(languages);
    } else if (selectedSort === 'type') {
      setSecondarySortOptions(types);
    } else if (selectedSort === 'artists') {
      setSecondarySortOptions(artists);
    } else {
      setSecondarySortOptions([]);
      setSongs(allsongs);
    }
  };

  const handleSecondarySortChange = async (event) => {
    const selectedSort = event.target.value;
    setSecondarySort(selectedSort);
    const primary = primarySort[0].id;
    try {
      if (primary === 'langue') {
        const filteredSongs = await getSongsByLanguage(selectedSort);
        setSongs(filteredSongs.$values || []);
      } else if (primary === 'type') {
        const filteredSongs = await getSongsByType(selectedSort);
        setSongs(filteredSongs.$values || []);
      } else if (primary === 'artists') {
        const filteredSongs = await getSongsByArtist(selectedSort);
        setSongs(filteredSongs.$values || []);
      } else {
        setSongs(allsongs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredSongs = useMemo(() => {
    let filtered = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return sortOrder === 'newest'
      ? filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      : filtered.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  }, [searchQuery, sortOrder, songs]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleGoHome = () => {
    history(`/radio-station/dashboard`);
  };

  const addToSelected = async (id, email) => {
    const artist = await getArtistByEmail(email);
    const res = await sendToAccepted(artist.artistId, user.userId, id);
    if (res.success === true) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
      toast.success('Chanson ajoutée au playlist de la station');
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: res.message }));
    }
  };

  const paginatedSongs = useMemo(() => {
    return filteredSongs.slice((page - 1) * songsPerPage, page * songsPerPage);
  }, [filteredSongs, page]);
  console.log('allsongs', allsongs);
  return (
    <Container>
      <ToastContainer />
      {/* <Typography variant="h3" gutterBottom>
        🎧 <FormattedMessage id="listen" />
      </Typography> */}

      {/* Sorting and CSV Export Section */}
      <Stack spacing={3}>
        <Stack spacing={2} sx={{ p: 1 }}>
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item md={8} container spacing={2}>
              {/* Search Input */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <OutlinedInput
                    placeholder={formatMessage({ id: 'search' })}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </FormControl>
              </Grid>

              {/* Primary Sort (Always Visible) */}
              <Grid item xs={6} md={3}>
                <FormControl fullWidth>
                  <SortingSelect
                    fullWidth
                    id="primary-sort"
                    label="Primary Sort"
                    sortBy={primarySort}
                    setSortBy={setPrimarySort}
                    onChange={(event) => handlePrimarySortChange(event.target.value)}
                    allColumns={sortItems}
                  />
                </FormControl>
              </Grid>

              {/* Secondary Sort (Disabled until Primary is Selected) */}
              <Grid item xs={6} md={3}>
                <FormControl fullWidth disabled={primarySort === 'all'}>
                  <Select
                    id="secondary-sort"
                    value={secondarySort}
                    onChange={handleSecondarySortChange}
                    displayEmpty
                    input={<OutlinedInput placeholder={formatMessage({ id: 'sortBy' })} />}
                    renderValue={(selected) => {
                      const selectedOption = secondarySortOptions.find((option) => option.id === selected);
                      return selectedOption ? selectedOption.Header : <FormattedMessage id="sortBy" />;
                    }}
                  >
                    {secondarySortOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        <ListItemText primary={option.Header} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={2} container spacing={2}>
              {/* Newest/Oldest Sort Button */}
              <Grid item xs={6} md={9}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                >
                  <ArrangeVertical size={32} style={{ fontSize: 48, marginRight: 2 }} />
                  {sortOrder === 'newest' ? <FormattedMessage id="newer" /> : <FormattedMessage id="older" />}
                </Button>
              </Grid>

              {/* CSV Export Button (Aligned to Right) */}
              <Grid item xs={6} md={3}>
                <CSVExport data={songs} filename={'songs-list.csv'} />
              </Grid>
            </Grid>
          </Grid>
        </Stack>

        {/* Songs List or No Results */}
        {paginatedSongs.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {paginatedSongs.map((song) => (
                <Grid item xs={6} sm={6} md={4} key={song.id}>
                  <Card className="song-card">
                    <SongsCard
                      songId={song.id}
                      totalDuration={song.duration}
                      coverImage={song.coverImagePath}
                      audioPath={song.mp3FilePath}
                      onAddToSelection={() => addToSelected(song.id, song.artistEmails.$values[0])}
                    />

                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="h4" color="text.primary">
                          {song.title || ' N/A '}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {song.artistNames?.$values.map((artist) => artist).join(', ') || ' '}
                        </Typography>
                        <Box variant="body2" display="flex" justifyContent="space-between">
                          <Grid>{formatDate2(song?.releaseDate)}</Grid>
                          <Grid color="green">
                            <Clock size={14} style={{ marginRight: 2 }} />
                            {extractMinutesSeconds(song?.duration)}
                          </Grid>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'red' }}>
                        {errors[song.id]}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" justifyContent="center">
              <Pagination count={Math.ceil(songs.length / songsPerPage)} page={page} onChange={handlePageChange} />
            </Stack>
          </>
        ) : (
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="body1" component="div">
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={3}
                sx={{ my: 3, height: 'auto', p: { xs: 2.5, md: 'auto' } }}
              >
                <Grid item>
                  <CardMedia component="img" image={NoFoundIllustrate} title="Cart Empty" sx={{ width: { xs: 200, md: 300, lg: 400 } }} />
                </Grid>
                <Grid item>
                  <Stack spacing={0.5}>
                    <Typography variant="h3" color="inherit" component="h3">
                      <FormattedMessage id="noSongs" />
                    </Typography>
                    <Typography variant="h5" color="textSecondary" component="h5">
                      <FormattedMessage id="waitPropositions" />
                    </Typography>

                    <Box sx={{ pt: 3 }}>
                      <Button variant="contained" size="large" color="warning" endIcon={<ArrowRight2 />} onClick={handleGoHome}>
                        <FormattedMessage id="goHome" />
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Typography>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default ListenPage;
