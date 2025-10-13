import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import { API_MEDIA_URL } from 'config';
import useAdmin from 'hooks/useAdmin';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { Youtube, Instagram, Spotify, Facebook, Google, Sms } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';
import useSongs from 'hooks/useSongs';
import { youtubeColor } from 'config';
import { instagramColor } from 'config';
import { spotifyColor } from 'config';
import { facebookColor } from 'config';
import { googleColor } from 'config';

const avatarImage = require.context('assets/images/users', true);

const ArtistDetail = ({ artistEmail }) => {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const { getArtistByEmail } = useAdmin();
  const { getArtistSongs } = useSongs();

  // const theme = useTheme();
  // const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const defaultAvatar = avatarImage('./default.jpeg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistResponse, songsResponse] = await Promise.all([getArtistByEmail(artistEmail), getArtistSongs(artistEmail)]);
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
  }, [artistEmail]);

  useEffect(() => {
    console.log('songs :' + songs.map((song) => song.title));
  }, [songs]);

  const formatSocialMedia = (link) => {
    const match = link.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/);
    if (match && match[1]) {
      return `@${match[1]}`;
    }
  };

  if (!artist) {
    return (
      <Typography>
        <FormattedMessage id="loading" />
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Transitions type="slide" direction="down" in={true}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={4}>
            <MainCard>
              <Chip
                label={artist.active ? 'Active' : 'Inactive'}
                size="small"
                color={artist.active ? 'primary' : 'secondary'}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  fontSize: '0.675rem'
                }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      alt="Artist Avatar"
                      src={artist.photoProfile ? `${API_MEDIA_URL}${artist.photoProfile}` : defaultAvatar}
                      sx={{ width: 70, height: 70 }}
                    />

                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist.artistRealName}</Typography>
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
                      <Typography color="secondary">
                        <FormattedMessage id="singles" />
                      </Typography>
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
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="secondary">
                        <FormattedMessage id="Career_Start_Date" />
                      </Typography>
                      <Typography variant="h5">{new Date(artist.careerStartDate).toDateString()}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                    {artist.email && (
                      <ListItem>
                        <ListItemIcon>
                          <Sms size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={`mailto:${artist.email}`} target="_blank">
                            {artist.email}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.google && (
                      <ListItem>
                        <ListItemIcon>
                          <Google size={18} style={{ color: googleColor }} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.google} target="_blank" style={{ color: googleColor }}>
                            {artist.google}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.facebook && (
                      <ListItem>
                        <ListItemIcon>
                          <Facebook size={18} style={{ color: facebookColor }} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.facebook} target="_blank" style={{ color: facebookColor }}>
                            @{artist.artistRealName}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.instagram && (
                      <ListItem>
                        <ListItemIcon>
                          <Instagram size={18} style={{ color: instagramColor }} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link
                            align="right"
                            href={artist.instagram}
                            target="_blank"
                            style={{ color: instagramColor, textDecoration: 'none' }}
                          >
                            {formatSocialMedia(artist.instagram)}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.youtube && (
                      <ListItem>
                        <ListItemIcon>
                          <Youtube size={18} style={{ color: youtubeColor }} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.youtube} target="_blank" style={{ color: youtubeColor }}>
                            @{artist.artistRealName}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.spotify && (
                      <ListItem>
                        <ListItemIcon>
                          <Spotify size={18} style={{ color: spotifyColor }} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.spotify} target="_blank" style={{ color: spotifyColor }}>
                            @{artist.artistRealName}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Stack spacing={2.5}>
              <MainCard title={<FormattedMessage id="bio" />}>
                <Typography color="secondary">{artist.bio}</Typography>
              </MainCard>
              <MainCard title={<FormattedMessage id="mySongs" />}>
                <List style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {songs.map((song, index) => (
                    <Grid key={index} item xs={3.8}>
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
            </Stack>
          </Grid>
        </Grid>
      </Transitions>
    </Box>
  );
};

ArtistDetail.propTypes = {
  artistEmail: PropTypes.string.isRequired
};

export default ArtistDetail;
