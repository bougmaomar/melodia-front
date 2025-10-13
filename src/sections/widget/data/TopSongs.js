import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

// material-ui
import { Box, Button, List, ListItem, ListItemAvatar, ListItemText, Stack, Tab, Tabs, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { Airpods, DocumentDownload } from 'iconsax-react';

// project-imports
import MainCard from 'components/MainCard';
import { extractMinutesSeconds, formatDate1 } from 'utils/globals/functions';

// hooks
import useSongs from 'hooks/useSongs';
// ==============================|| TAB PANEL ||============================== //

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| DATA WIDGET - TYRANSACTIONS ||============================== //

export default function TopSongs({ songs, proposals, accepts, type }) {
  const history = useNavigate();
  const { getPlaysCountBySong, getDownloadsCountBySong } = useSongs();
  const { formatMessage } = useIntl();
  const [value, setValue] = useState(0);
  const [playsCounts, setPlaysCounts] = useState([]);
  const [downloadsCounts, setDownloadsCounts] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const playsCountsPromise = Promise.all(
        songs.slice(0, 5).map(async (song) => {
          const playsCount = await getPlaysCountBySong(song.id);
          return playsCount;
        })
      );

      const downloadsCountsPromise = Promise.all(
        songs.slice(0, 5).map(async (song) => {
          const downloadsCount = await getDownloadsCountBySong(song.id);
          return downloadsCount;
        })
      );

      const [playsCounts, downloadsCounts] = await Promise.all([playsCountsPromise, downloadsCountsPromise]);

      setPlaysCounts(playsCounts);
      setDownloadsCounts(downloadsCounts);
    };

    fetchCounts();
  }, [songs, getPlaysCountBySong, getDownloadsCountBySong]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGoToAll = () => {
    type == 'artist' ? history(`/artist/songs`) : history(`/agent/songs`);
  };

  const handleGoToCreate = () => {
    type == 'artist' ? history(`/artist/add-song`) : history(`/agent/songs/add-song/0`);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5">
            <FormattedMessage id="topSongs" />
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3 }}>
            <Tab label={formatMessage({ id: 'allSongs' })} {...a11yProps(0)} />
            <Tab label={formatMessage({ id: 'proposalSongs' })} {...a11yProps(1)} />
            <Tab label={formatMessage({ id: 'acceptedSongs' })} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {songs.slice(0, 5).map((song, key) => (
              <ListItem
                key={key}
                divider
                secondaryAction={
                  <Stack>
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {playsCounts[key] || 0} <Airpods size={18} />
                      </Typography>
                      <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {downloadsCounts[key] || 0} <DocumentDownload size={18} />
                      </Typography>
                    </Stack>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    type="outlined"
                    color="secondary"
                    src={`${API_MEDIA_URL}${song.coverImagePath}`}
                    sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{song.title}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {song.genreMusicName} - {extractMinutesSeconds(song.duration)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {proposals.slice(0, 5).map((proposal, key) => (
              <ListItem
                key={key}
                divider
                secondaryAction={
                  <Stack>
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Le {formatDate1(proposal.proposalDate)}
                      </Typography>
                      <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        à {proposal.stationName}
                      </Typography>
                    </Stack>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    type="outlined"
                    color="secondary"
                    src={`${API_MEDIA_URL}${proposal.song.coverImagePath}`}
                    sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{proposal.song.title}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {proposal.song.genreMusic} - {extractMinutesSeconds(proposal.song.duration)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {accepts.slice(0, 5).map((proposal, key) => (
              <ListItem
                key={key}
                divider
                secondaryAction={
                  <Stack>
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Le {formatDate1(proposal.proposalDate)}
                      </Typography>
                      <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        à {proposal.stationName}
                      </Typography>
                    </Stack>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    type="outlined"
                    color="secondary"
                    src={`${API_MEDIA_URL}${proposal.song.coverImagePath}`}
                    sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{proposal.song.title}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {proposal.song.genreMusic} - {extractMinutesSeconds(proposal.song.duration)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ p: 3 }}>
          <Button variant="outlined" fullWidth color="secondary" onClick={handleGoToAll}>
            <FormattedMessage id="viewAll" />
          </Button>
          <Button variant="contained" fullWidth onClick={handleGoToCreate}>
            <FormattedMessage id="addNewSong" />
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
}

TopSongs.propTypes = {
  songs: PropTypes.array
};
