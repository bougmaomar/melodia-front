import PropTypes from 'prop-types';
import { useState } from 'react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

// material-ui
import { Box, Button, List, ListItem, ListItemAvatar, ListItemText, Stack, Tab, Tabs, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';

// project-imports
import MainCard from 'components/MainCard';

const avatarImage = require.context('assets/images/users', true);

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

export default function TopStations({ stations, type }) {
  const history = useNavigate();
  const { formatMessage } = useIntl();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGoToAll = () => {
    type == 'artist' ? history('/artist/stations') : history('/agent/stations');
  };

  const handleGoToNew = () => {
    type == 'artist' ? history('/artist/suggest/0') : history('/agent/suggest/0');
  };

  const defaultAvatar = avatarImage('./default.jpeg');

  return (
    <MainCard content={false}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5">Top Stations</Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3 }}>
            <Tab label={formatMessage({ id: 'allStations' })} {...a11yProps(0)} />
            <Tab label={formatMessage({ id: 'famousStations' })} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {stations.slice(0, 5).map((key, station) => (
              <ListItem key={station} divider>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    type="outlined"
                    color="secondary"
                    src={key.logo ? `${API_MEDIA_URL}${key.logo}` : defaultAvatar}
                    sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{key.stationName}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {key.stationOwner} - {key.stationTypeName}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {stations.slice(0, 5).map((key, station) => (
              <ListItem key={station} divider>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    type="outlined"
                    color="secondary"
                    src={key.logo ? `${API_MEDIA_URL}${key.logo}` : defaultAvatar}
                    sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{key.stationName}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {key.stationOwner} - {key.stationTypeName}
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
          <Button variant="contained" fullWidth onClick={handleGoToNew}>
            <FormattedMessage id="proposeSong" />
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
}

TopStations.propTypes = {
  stations: PropTypes.array
};
