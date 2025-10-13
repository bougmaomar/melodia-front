import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Chip,
  Fab,
  Tooltip,
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
  CardContent,
  IconButton,
  Button,
  TextField
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { API_MEDIA_URL } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import useAdmin from 'hooks/useAdmin';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { Youtube, Instagram, Spotify, Facebook, Google, Sms, ArrowLeft, Edit, Add } from 'iconsax-react';
// import { ArrowBack } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import useSongs from 'hooks/useSongs';
import { youtubeColor } from 'config';
import { instagramColor } from 'config';
import { spotifyColor } from 'config';
import { facebookColor } from 'config';
import { googleColor } from 'config';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import useArtist from 'hooks/useArtist';

const avatarImage = require.context('assets/images/users', true);

const ArtistDetail = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const { getArtistByEmail } = useAdmin();
  const { getArtistSongs } = useSongs();
  const { updateArtistByAgent } = useArtist();
  const navigate = useNavigate();
  const paramEmail = useParams();
  const artistEmail = paramEmail.email;
  const [bioText, setBioText] = useState('');
  const [nameText, setNameText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [socialLinks, setSocialLinks] = useState({
    email: null,
    spotify: null,
    youtube: null,
    facebook: null,
    google: null,
    instagram: null
  });

  // const theme = useTheme();
  // const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const defaultAvatar = avatarImage('./default.jpeg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistResponse, songsResponse] = await Promise.all([getArtistByEmail(artistEmail), getArtistSongs(artistEmail)]);
        setArtist(artistResponse);
        setSongs(songsResponse);
        artistResponse.bio && setBioText(artistResponse.bio);
        artistResponse.artistRealName && setNameText(artistResponse.artistRealName);
        artistResponse.careerStartDate && setSelectedDate(new Date(artistResponse.careerStartDate));
        artistResponse.email && setSocialLinks((prev) => ({ ...prev, ['email']: artistResponse.email }));
        artistResponse.spotify && setSocialLinks((prev) => ({ ...prev, ['spotify']: artistResponse.spotify }));
        artistResponse.youtube && setSocialLinks((prev) => ({ ...prev, ['youtube']: artistResponse.youtube }));
        artistResponse.facebook && setSocialLinks((prev) => ({ ...prev, ['facebook']: artistResponse.facebook }));
        artistResponse.instagram && setSocialLinks((prev) => ({ ...prev, ['instagram']: artistResponse.instagram }));
        artistResponse.google && setSocialLinks((prev) => ({ ...prev, ['google']: artistResponse.google }));

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



  const handleCardClick = (id) => {
    navigate(`/agent/songs-details/${id}`);
  };

  const [isBioEditing, setIsBioEditing] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isDateEditing, setIsDateEditing] = useState(false);
  const [isMediaEditing, setIsMediaEditing] = useState(false);

  const handleBioChange = (event) => {
    setBioText(event.target.value);
  };

  const handleNameChange = (event) => {
    setNameText(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleMediaChange = (platform, value) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSave = () => {
    setIsBioEditing(false);
    setIsNameEditing(false);
    setIsDateEditing(false);
    setIsMediaEditing(false);
  };

  const handleSubmit = async () => {
    try {
      const sanitizedSocialLinks = Object.fromEntries(
        Object.entries(socialLinks).map(([key, value]) => [key, value && value !== 'null' ? value : null])
      );

      await updateArtistByAgent({
        artistId: artist.artistId,
        agentId: user.userId,
        firstname: nameText.trim().split(/\s+/)[0],
        lastname: nameText.trim().split(/\s+/).slice(1).join(' '),
        userName: nameText,
        phoneNumber: artist.phoneNumber,
        photoProfile: artist.photoProfile,
        careerStartDate: selectedDate.toISOString(),
        email: sanitizedSocialLinks.email,
        spotify: sanitizedSocialLinks.spotify,
        instagram: sanitizedSocialLinks.instagram,
        facebook: sanitizedSocialLinks.facebook,
        youtube: sanitizedSocialLinks.youtube,
        google: sanitizedSocialLinks.google,
        cityId: -1,
        bio: bioText
      });

      dispatch(
        openSnackbar({
          open: true,
          message: 'Artist updated successfully.',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error updating artist.',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
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
            <MainCard sx={{ position: 'relative' }}>
              {/* Return icon */}
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '25px',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                }}
              >
                <ArrowLeft sx={{ fontSize: 30 }} />
              </IconButton>
              <Chip
                label={artist.active ? 'Active' : 'Inactive'}
                size="small"
                color={artist.active ? 'primary' : 'secondary'}
                sx={{
                  position: 'absolute',
                  right: 25,
                  top: 25,
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

                    <Stack spacing={0.5} alignItems="center" direction="row">
                      {isNameEditing ? (
                        <TextField
                          fullWidth
                          autoFocus
                          variant="standard"
                          value={nameText}
                          onChange={handleNameChange}
                          onBlur={handleSave}
                          onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Save on Enter key
                        />
                      ) : (
                        <Typography variant="h5">{nameText}</Typography>
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          color: 'gray',
                          '&:hover': { color: 'black' }
                        }}
                        onClick={() => setIsNameEditing(true)}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    {/* number of singles */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist && artist.numberOfSingles}</Typography>
                      <Typography color="secondary">
                        <FormattedMessage id="singles" />
                      </Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    {/* number of albums */}
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{artist && artist.numberOfAlbums}</Typography>
                      <Typography color="secondary">
                        <FormattedMessage id="albums" />
                      </Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    {/* number of songs */}
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
                {/* start date */}
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="secondary">
                        <FormattedMessage id="Career_Start_Date" />
                      </Typography>

                      {isDateEditing ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            onClose={handleSave}
                            renderInput={(params) => <TextField {...params} autoFocus />}
                          />
                        </LocalizationProvider>
                      ) : (
                        <Typography variant="h5">
                          {selectedDate.toDateString()}
                          {'  '}
                          <IconButton
                            size="small"
                            sx={{ color: 'gray', '&:hover': { color: 'black' } }}
                            onClick={() => setIsDateEditing(true)}
                          >
                            <Edit size={18} />
                          </IconButton>
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                {/* social media */}
                <Grid item xs={12} sx={{ position: 'relative', margin: 1 }}>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: 'gray',
                      '&:hover': { color: 'black' }
                    }}
                    size="small"
                    onClick={() => setIsMediaEditing((prev) => !prev)}
                  >
                    <Edit size={18} />
                  </IconButton>
                  <List aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                    {[
                      { platform: 'email', icon: <Sms size={18} />, color: 'black' },
                      { platform: 'google', icon: <Google size={18} color={googleColor} />, color: { googleColor } },
                      { platform: 'facebook', icon: <Facebook size={18} color={facebookColor} />, color: { facebookColor } },
                      { platform: 'instagram', icon: <Instagram size={18} color={instagramColor} />, color: { instagramColor } },
                      { platform: 'youtube', icon: <Youtube size={18} color={youtubeColor} />, color: { youtubeColor } },
                      { platform: 'spotify', icon: <Spotify size={18} color={spotifyColor} />, color: { spotifyColor } }
                    ].map(({ platform, icon, color }) => (
                      <ListItem key={platform}>
                        <ListItemIcon style={{ color: color }}>{icon}</ListItemIcon>
                        <ListItemSecondaryAction>
                          {isMediaEditing ? (
                            <TextField
                              size="small"
                              variant="standard"
                              value={socialLinks[platform] || ''}
                              onChange={(e) => handleMediaChange(platform, e.target.value)}
                              placeholder={`Enter ${platform}`}
                              onKeyPress={(e) => e.key === 'Enter' && handleSave()} // Save on Enter
                              sx={{ width: '200px' }}
                            />
                          ) : (
                            socialLinks[platform] != 'null' && (
                              <Link
                                align="right"
                                href={platform === 'email' ? `mailto:${socialLinks[platform]}` : socialLinks[platform]}
                                target="_blank"
                                style={{ color }}
                              >
                                {socialLinks[platform] && (platform === 'email' ? socialLinks[platform] : `@${artist.artistRealName}`)}
                              </Link>
                            )
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Stack spacing={2.5}>
              {/* bio */}
              <MainCard title={<FormattedMessage id="bio" />} sx={{ position: 'relative', padding: 2 }}>
                {/* Edit Button */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 15,
                    right: 20,
                    color: 'gray',
                    '&:hover': { color: 'black' }
                  }}
                  size="small"
                  onClick={() => setIsBioEditing(true)}
                >
                  <Edit size={18} />
                </IconButton>

                {/* Editable TextField or Static Typography */}
                {isBioEditing ? (
                  <TextField
                    fullWidth
                    autoFocus
                    variant="standard"
                    value={bioText}
                    onChange={handleBioChange}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                ) : (
                  <Typography color="secondary">{bioText}</Typography>
                )}
              </MainCard>

              {/* songss */}
              <MainCard title={<FormattedMessage id="mySongs" />} sx={{ position: 'relative' }}>
                <List spacing={2} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {songs.map((song, index) => (
                    <Grid key={index} item xs={2.5}>
                      <Card
                        onClick={() => handleCardClick(song.id)}
                        sx={{
                          borderRadius: '12px',
                          position: 'relative',
                          '&:hover': { '& .overlay': { opacity: 1 } },
                          height: 150,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer'
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

                  {/* Add Song Button */}
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                    <Tooltip title={<FormattedMessage id="addSong" />} aria-label="add">
                      <Fab
                        color="primary"
                        onClick={() => navigate(`/agent/songs/add-song/${artist.artistId}`)}
                        aria-label="add"
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: '#007BFF'
                        }}
                      >
                        <Add />
                      </Fab>
                    </Tooltip>
                  </Grid>
                </List>
              </MainCard>
            </Stack>
          </Grid>
        </Grid>
        <Grid container justifyContent="end">
          <Button
            item
            sx={{
              margin: 2,
              backgroundColor: '#007BFF',
              color: 'white'
            }}
            onClick={() => handleSubmit()}
          >
            <FormattedMessage id="save" />
          </Button>
        </Grid>
      </Transitions>
    </Box>
  );
};

ArtistDetail.propTypes = {
  artistEmail: PropTypes.string.isRequired
};

export default ArtistDetail;
