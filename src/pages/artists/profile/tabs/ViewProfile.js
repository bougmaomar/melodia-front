// material-ui
import {
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';
import { googleColor, youtubeColor, spotifyColor, instagramColor, facebookColor } from 'config';

// third-party
import { format } from 'date-fns';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
// import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import { useArtist } from 'hooks/useArtist';
import useAdmin from 'hooks/useAdmin';
import useSongs from 'hooks/useSongs';
// assets
import { CallCalling, Gps, Timer, Sms, Spotify, Youtube, Instagram, Facebook, Google } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import { formatPhone } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const ViewProfile = () => {
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);
  const [artist, setArtist] = useState('');
  const [city, setCity] = useState('');
  const [songs, setSongs] = useState([]);
  const { getArtistByEmail } = useArtist();
  const { getCityById } = useAdmin();
  const { getArtistSongs } = useSongs();
  const defaultAvatar = avatarImage('./default.jpeg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistResponse, songsResponse] = await Promise.all([getArtistByEmail(user.email), getArtistSongs(user.email)]);

        setArtist(artistResponse);
        setSongs(songsResponse);

        if (artistResponse && artistResponse.cityId) {
          const cityResponse = await getCityById(artistResponse.cityId);
          setCity(`${cityResponse.name}, ${cityResponse.countryName}`);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user.email]);


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
                    {/* {artist.active ? <Chip label="Active" size="small" color="success" /> : <Chip label="desactivate" size="small" color="error" /> } */}
                  </Stack>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="Avatar 1" size="xl" src={artist.photoProfile ? `${API_MEDIA_URL}${artist.photoProfile}` : defaultAvatar} />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist && artist.artistRealName}</Typography>
                      <Typography color="secondary">
                        {user.role} <FormattedMessage id="account" />
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3} sx={{ '& svg': { fontSize: '1.15rem', cursor: 'pointer' } }}>
                      {artist.google && (
                        <Link target="_blank" rel="noopener noreferrer" href={artist.google}>
                          <Google variant="Bold" style={{ color: googleColor }} />
                        </Link>
                      )}
                      {artist.spotify && (
                        <Link target="_blank" rel="noopener noreferrer" href={artist.spotify}>
                          <Spotify variant="Bold" style={{ color: spotifyColor }} />
                        </Link>
                      )}
                      {artist.youtube && (
                        <Link target="_blank" rel="noopener noreferrer" href={artist.youtube}>
                          <Youtube variant="Bold" style={{ color: youtubeColor }} />
                        </Link>
                      )}
                      {artist.instagram && (
                        <Link target="_blank" rel="noopener noreferrer" href={artist.instagram}>
                          <Instagram variant="Bold" style={{ color: instagramColor }} />
                        </Link>
                      )}
                      {artist.facebook && (
                        <Link target="_blank" rel="noopener noreferrer" href={artist.facebook}>
                          <Facebook variant="Bold" style={{ color: facebookColor }} />
                        </Link>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist && artist.numberOfSingles}</Typography>
                      <Typography color="secondary">Singles</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist && artist.numberOfAlbums}</Typography>
                      <Typography color="secondary">
                        <FormattedMessage id="albums" />
                      </Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist && artist.numberOfAlbumSongs}</Typography>
                      <Typography color="secondary">
                        <FormattedMessage id="songs" />
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <Sms size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{artist && artist.email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CallCalling size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{artist && formatPhone(artist.phoneNumber)}</Typography>
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
                        <Typography align="right">{artist && format(new Date(artist.careerStartDate), 'MMMM, dd yyyy')}</Typography>
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
            <MainCard title={<FormattedMessage id="bio" />}>
              <Typography color="secondary">{artist && artist.bio}</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title={<FormattedMessage id="mySongs" />}>
              <List style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {songs.map((song, index) => (
                  <Grid key={index} item xs={2.8}>
                    <Card
                      sx={{
                        borderRadius: '12px',
                        position: 'relative',
                        '&:hover': { '& .overlay': { opacity: 1 } },
                        height: '85%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <img
                        src={`${API_MEDIA_URL}${song.coverImagePath}`}
                        alt={`Song ${song.title}`}
                        style={{ width: '100%', borderRadius: '12px', cursor: 'pointer', flex: '1 0 auto' }}
                      />
                      <CardContent
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                          opacity: 0,
                          background: 'rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(40px)',
                          color: '#fff',
                          padding: '5px',
                          borderRadius: '12px',
                          transition: 'opacity 0.3s',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <Typography variant="body1">{song.title}</Typography>
                      </CardContent>
                    </Card>
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

export default ViewProfile;
