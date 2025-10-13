// material-ui
import {
  Chip,
  // Card,
  // CardContent,
  Divider,
  Grid,
  // Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';
// import { googleColor, youtubeColor, spotifyColor, instagramColor, facebookColor } from 'config';

// third-party
import { format } from 'date-fns';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import { useAgent } from 'hooks/useAgent';
import useAdmin from 'hooks/useAdmin';
import useArtist from 'hooks/useArtist';
// import useSongs from 'hooks/useSongs';
// assets
import { CallCalling, Gps, Timer, Sms, Mouse } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { API_MEDIA_URL } from 'config';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { formatPhone } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabProfile = () => {
  const userData = localStorage.getItem('user');
  const navigate = useNavigate();
  const user = JSON.parse(userData);
  const [agent, setAgent] = useState('');
  const [city, setCity] = useState('');
  const [artists, setArtists] = useState([]);
  const { getAgentByEmail } = useAgent();
  const { getCityById } = useAdmin();
  const { getArtistsByAgent } = useArtist();
  const defaultAvatar = avatarImage('./default.jpeg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentResponse, artists] = await Promise.all([getAgentByEmail(user.email), getArtistsByAgent(user.userId)]);
        setAgent(agentResponse);
        setArtists(artists?.$values);

        if (agentResponse && agentResponse.cityId) {
          const cityResponse = await getCityById(agentResponse.cityId);
          setCity(`${cityResponse.name}, ${cityResponse.countryName}`);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user]);

  const handleAvatarClick = (email) => {
    navigate(`/agent/artist/artist_detail/${email}`);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Chip label="Active" size="small" color="success" />
                    {/* {artist.active ? <Chip label="Active" size="small" color="success" /> : <Chip label="desactivate" size="small" color="error" /> } */}
                  </Stack>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      alt="Avatar 1"
                      size="xl"
                      src={agent.photoProfile && agent.photoProfile != null ? `${API_MEDIA_URL}${agent.photoProfile}` : defaultAvatar}
                    />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{agent && agent.agentRealName}</Typography>
                      <Typography color="secondary">
                        {user.role} <FormattedMessage id="account" />
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="secondary">
                        <FormattedMessage id="artistsNum" />
                      </Typography>
                      <Typography variant="h5">{agent && artists && artists.length}</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    {/* email */}
                    <ListItem>
                      <ListItemIcon>
                        <Sms size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{agent && agent.email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {/* phone number */}
                    <ListItem>
                      <ListItemIcon>
                        <CallCalling size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{agent && formatPhone(agent.phoneNumber)}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {/* city */}
                    <ListItem>
                      <ListItemIcon>
                        <Gps size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{city}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {/* website */}
                    <ListItem>
                      <ListItemIcon>
                        <Mouse size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{agent && agent.webSite}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {/* start date */}
                    <ListItem>
                      <ListItemIcon>
                        <Timer size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{agent && format(new Date(agent.careerStartDate), 'MMMM, dd yyyy')}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title={<FormattedMessage id="bio" />}>
              <Typography color="secondary">{agent && agent.bio}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title="Artistes géres">
              <List style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {artists.map((artist, index) => (
                  <Grid key={index} item lg={2} md={2} xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      alt="Avatar 1"
                      onClick={() => handleAvatarClick(artist.email)}
                      sx={{ width: 86, height: 86, cursor: 'pointer' }}
                      src={artist.photoProfile && artist.photoProfile != null ? `${API_MEDIA_URL}${artist.photoProfile}` : defaultAvatar}
                    />
                    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 1 }}>
                      {artist.artistRealName}
                    </Typography>
                  </Grid>
                ))}
              </List>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TabProfile;
