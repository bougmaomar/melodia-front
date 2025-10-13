// material-ui
import { Chip, Divider, Grid, Link, List, ListItem, ListItemIcon, ListItemSecondaryAction, Stack, Typography } from '@mui/material';

// third-party
import { format } from 'date-fns';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import useStation from 'hooks/useSation';
import useAdmin from 'hooks/useAdmin';

// assets
import { CallCalling, Gps, Timer, Sms, Brodcast, Global } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import { formatPhone } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const ViewProfile = () => {
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const [station, setStation] = useState('');
  const [city, setCity] = useState('');
  const { getStationById } = useStation();
  const { getCityById } = useAdmin();
  const defaultAvatar = avatarImage('./default.jpeg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationResponse] = await Promise.all([getStationById(user.userId)]);

        setStation(stationResponse);

        if (stationResponse && stationResponse.cityId) {
          const cityResponse = await getCityById(stationResponse.cityId);
          setCity(`${cityResponse.name}, ${cityResponse.countryName}`);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user.userId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Chip label="Active" size="small" color="success" />
                  </Stack>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="Avatar 1" size="xl" src={station.logo ? `${API_MEDIA_URL}${station.logo}` : defaultAvatar} />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{station && station.stationName}</Typography>
                      <Typography color="secondary">
                        {user.role} <FormattedMessage id="account" />
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3} sx={{ '& svg': { fontSize: '1.15rem', cursor: 'pointer' } }}></Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1.5 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <Sms size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{station && station.email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CallCalling size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{station && formatPhone(station.phoneNumber)}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Gps size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{city}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Timer size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{station && format(new Date(station.foundationDate), 'MMMM, dd yyyy')}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Brodcast size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{station && station.frequency}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Global size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">
                          {station?.webSite ? (
                            <Link href={station.webSite} target="_blank" color="secondary">
                              {station.webSite}
                            </Link>
                          ) : (
                            'N/A'
                          )}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Informations */}
            <MainCard title="Informations">
              <Stack spacing={2} sx={{ p: 2 }}>
                {' '}
                {/* Station Name */}
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="black">
                      <FormattedMessage id="stationName" /> :
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left' }}>
                      {station?.stationName || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                {/* Station Owner */}
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="black">
                      <FormattedMessage id="stationOwner" /> :
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left' }}>
                      {station?.stationOwner || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                {/* Station Type */}
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="black">
                      <FormattedMessage id="stationType" /> :
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left' }}>
                      {station?.stationTypeName || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title={<FormattedMessage id="about_station" />}>
              <Stack spacing={2}>
                {station &&
                  station?.description?.split('<br />').map((line, index) => (
                    <Typography key={index} component="p" variant="body1" gutterBottom>
                      {line}
                    </Typography>
                  ))}
              </Stack>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewProfile;
