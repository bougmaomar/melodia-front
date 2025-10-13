import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Grid,
  Typography,
  Button,
  CardMedia,
  CircularProgress,
  Box,
  Stack,
  Select,
  FormControl,
  OutlinedInput,
  MenuItem,
  ListItemText
} from '@mui/material';
import { ArrowRight2, ArrangeVertical } from 'iconsax-react';
import { SortingSelect, CSVExport } from 'components/third-party/ReactTable';
import { FormattedMessage, useIntl } from 'react-intl';
import ProposalList from '../proposals/proposalList';
import useAdmin from 'hooks/useAdmin';
import useProposals from 'hooks/useProposals';
import NoFoundIllustrate from 'assets/images/maintenance/noProposition.png';

const Proposals = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { formatMessage } = useIntl();
  const { getLanguages, getGenreMusics, getArtists } = useAdmin();
  const { getProposals, getProposalsByType, getProposalsByLanguage, getProposalsByArtist } = useProposals();
  const [allProposals, setAllProposals] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primarySort, setPrimarySort] = useState('all');
  const [secondarySortOptions, setSecondarySortOptions] = useState([]);
  const [secondarySort, setSecondarySort] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const history = useNavigate();

  const sortItems = [
    { id: 'all', Header: 'All', canSort: true },
    { id: 'langue', Header: 'Langue', canSort: true },
    { id: 'type', Header: 'Type', canSort: true },
    { id: 'artists', Header: 'Artists', canSort: true }
  ];
  const fetchProposals = async () => {
    try {
      const [proposals, types, languages, artists] = await Promise.all([
        getProposals(user.userId),
        getGenreMusics(),
        getLanguages(),
        getArtists()
      ]);
      setLanguages(languages.map((lang) => ({ id: lang.id, Header: lang.label, canSort: true })));
      setTypes(types.map((genre) => ({ id: genre.id, Header: genre.name, canSort: true })));
      setArtists(artists.map((artist) => ({ id: artist.artistId, Header: artist.artistRealName, canSort: true })));
      setAllProposals(proposals || []);
      setProposals(proposals || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchProposals();
    }
  }, [user.userId]);

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
      setProposals(allProposals);
    }
  };

  const handleSecondarySortChange = async (event) => {
    const selectedSort = event.target.value;
    setSecondarySort(selectedSort);
    const primary = primarySort[0].id;
    try {
      if (primary === 'langue') {
        const filteredproposals = await getProposalsByLanguage(user.userId, selectedSort);
        setProposals(filteredproposals || []);
      } else if (primary === 'type') {
        const filteredproposals = await getProposalsByType(user.userId, selectedSort);
        setProposals(filteredproposals || []);
      } else if (primary === 'artists') {
        const filteredproposals = await getProposalsByArtist(user.userId, selectedSort);
        setProposals(filteredproposals || []);
      } else {
        setProposals(allProposals);
      }
      console.log(proposals);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoHome = () => {
    history(`/radio-station/dashboard`);
  };

  const filteredP = useMemo(() => {
    let filtered = proposals.filter((song) => song.song.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return sortOrder === 'newest'
      ? filtered.sort((a, b) => new Date(b.proposalDate) - new Date(a.proposalDate))
      : filtered.sort((a, b) => new Date(a.proposalDate) - new Date(b.proposalDate));
  }, [searchQuery, sortOrder, proposals]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      {/* <Typography variant="h4" gutterBottom>
        <FormattedMessage id="proposals" />
      </Typography> */}
      <Stack spacing={1} marginBottom={3}>
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
              <CSVExport data={proposals} filename={'proposals-list.csv'} />
            </Grid>
          </Grid>
        </Grid>
      </Stack>

      {filteredP.length !== 0 ? (
        <ProposalList proposals={filteredP} user={user} fetchProposals={fetchProposals} />
      ) : (
        <Grid container alignItems="center" justifyContent="center" spacing={3} sx={{ my: 3, height: 'auto', p: { xs: 2.5, md: 'auto' } }}>
          <Grid item>
            <CardMedia component="img" image={NoFoundIllustrate} title="Cart Empty" sx={{ width: { xs: 200, md: 300, lg: 400 } }} />
          </Grid>
          <Grid item>
            <Stack spacing={0.5}>
              <Typography variant={'h3'} color="inherit">
                <FormattedMessage id="no_proposition_found" />
              </Typography>
              <Typography variant="h5" color="textSecondary">
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
      )}
    </Container>
  );
};

export default Proposals;
