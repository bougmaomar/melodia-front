import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
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
  useMediaQuery,
  Button
} from '@mui/material';
import { API_MEDIA_URL } from 'config';
import useAdmin from 'hooks/useAdmin';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { Youtube, Instagram, Spotify, Facebook, Google, Sms, CallCalling } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);

const ArtistDetail = ({ artistEmail }) => {
  const [artist, setArtist] = useState(null);
  const { getArtistByEmail } = useAdmin();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const defaultAvatar = avatarImage('./default.jpeg');
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistData = await getArtistByEmail(artistEmail);
        setArtist(artistData);
      } catch (error) {
        console.error('Error fetching artist details:', error);
      }
    };

    if (artistEmail) {
      fetchArtist();
    }
  }, [artistEmail]);

  if (!artist) {
    return <Typography>Loading...</Typography>;
  }
  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specials = '!@#$%^&*()_+-=';
    let password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      specials[Math.floor(Math.random() * specials.length)]
    ];
    const all = upper + lower + digits + specials;
    for (let i = password.length; i < 12; i++) {
      password.push(all[Math.floor(Math.random() * all.length)]);
    }
    password = password.sort(() => Math.random() - 0.5);
    return password.join('');
  };

  const handleResetPassword = async () => {
    try {
      // Assuming you have a function to reset the password
      const newPassword = generatePassword();

      const response = await PutResetPassord(artist.id, newPassword);
      if (response && response.status === 200) {
        await sendEmail(
          'template_wo0ibqm', // Replace with your actual reset password template ID
          artist.artistRealName,
          artist.email,
          newPassword
        );
        toast.success('Password reset successfully!');
      } else {
        toast.error('Failed to reset password. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password.');
    }
  };
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
                    {artist.phoneNumber && (
                      <ListItem>
                        <ListItemIcon>
                          <CallCalling size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>{artist.phoneNumber}</ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.google && (
                      <ListItem>
                        <ListItemIcon>
                          <Google size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.google} target="_blank">
                            Google Profile
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.facebook && (
                      <ListItem>
                        <ListItemIcon>
                          <Facebook size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.facebook} target="_blank">
                            Facebook Profile
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.instagram && (
                      <ListItem>
                        <ListItemIcon>
                          <Instagram size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.instagram} target="_blank">
                            Instagram Profile
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.youtube && (
                      <ListItem>
                        <ListItemIcon>
                          <Youtube size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.youtube} target="_blank">
                            YouTube Profile
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}

                    {artist.spotify && (
                      <ListItem>
                        <ListItemIcon>
                          <Spotify size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={artist.spotify} target="_blank">
                            Spotify Profile
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleResetPassword} sx={{ px: 4, py: 1 }}>
                  <FormattedMessage id="reset_password" defaultMessage="Reset Password" />
                </Button>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Stack spacing={2.5}>
              <MainCard title="Personal Details">
                <List sx={{ py: 0 }}>
                  <ListItem divider={!matchDownMD}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="firstName" />
                          </Typography>
                          <Typography>{artist.artistRealName.split(' ')[0]}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="lastName" />
                          </Typography>
                          <Typography>{artist.artistRealName.split(' ')[1]}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="nbrAlbums" />
                          </Typography>
                          <Typography>{artist.numberOfAlbums}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="nbrSongs" />
                          </Typography>
                          <Typography>{artist.numberOfAlbumSongs}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="nbrSingle" />
                          </Typography>
                          <Typography>{artist.numberOfSingles}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="Career_Start_Date" />
                          </Typography>
                          <Typography>{new Date(artist.careerStartDate).toDateString()}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </MainCard>
              <MainCard title={<FormattedMessage id="bio" />}>
                <Typography color="secondary">{artist.bio}</Typography>
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
