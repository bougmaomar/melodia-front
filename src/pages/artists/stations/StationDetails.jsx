import { Grid, Typography, Card, CardMedia, Button, IconButton } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useParams } from 'react-router';
import useStation from 'hooks/useSation';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { formatDate1, formatPhone } from 'utils/globals/functions';
import { useChatContext } from 'contexts/ChatContext';
import defaultStation from 'assets/images/users/default_station.png';

const StationDetails = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { id } = useParams();
  const history = useNavigate();
  const { getStationById, getAcceptedSong } = useStation();
  const { startChat, handleChatClick } = useChatContext();
  const [station, setStation] = useState();
  const [acceptedSongs, setAcceptedSongs] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [station, accepted] = await Promise.all([getStationById(id), getAcceptedSong(id)]);
      setStation(station);
      setAcceptedSongs(accepted);
    };
    fetchData();
  });

  const handleGoToSuggest = (id) => {
    history(`/artist/suggest/${id}`);
  };

  const handleContact = async () => {
    const res = await startChat(user?.email, station?.email);
    if (res) {
      if (res) {
        const response = await handleChatClick(res);
        if (response) history('/artist/chat');
      }
    }
  };

  return (
    <>
      <Grid>
        <Grid container spacing={3} justifyContent="flex">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            {station && (
              <Card
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <CardMedia
                  component="img"
                  image={station.logo ? `${API_MEDIA_URL}${station.logo}` : defaultStation}
                  alt={station.stationName}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute'
                  }}
                />
                <IconButton
                  onClick={() => history(-1)}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%',
                    color: 'black',
                    width: 40,
                    height: 40,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
                  }}
                >
                  <ArrowLeft sx={{ fontSize: 24 }} />
                </IconButton>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={5}>
            <Typography variant="h2">{station && station.stationName}</Typography>
            <Typography sx={{ padding: 2 }}>
              {station &&
                (station.description
                  ? station.description.split('<br />').map((line, index) => (
                      <Typography key={index} variant="body1" gutterBottom>
                        {line}
                      </Typography>
                    ))
                  : 'Aucune description donnée')}
            </Typography>
          </Grid>
          {station && (
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Grid margin={2} padding={3} borderRadius="12px" bgcolor="rgba(0,0,0,0.2)">
                <Typography variant="h5">
                  <FormattedMessage id="details" />
                </Typography>
                <Grid paddingY={2}>
                  <Typography>{station.email}</Typography>
                  <Typography>{formatDate1(station.foundationDate)}</Typography>
                  <Typography>{formatPhone(station.phoneNumber)}</Typography>
                </Grid>
                <Grid paddingY={2}>
                  <Typography>
                    <strong>
                      <FormattedMessage id="owner" />
                    </strong>{' '}
                    : {station.stationOwner}
                  </Typography>
                  <Typography>
                    <strong>
                      <FormattedMessage id="frequency" />
                    </strong>{' '}
                    : {station.frequency}
                  </Typography>
                  <Typography>
                    <strong>
                      <FormattedMessage id="stationType" />
                    </strong>{' '}
                    : {station.stationTypeName}
                  </Typography>
                </Grid>
                <Grid item>
                  {station.webSite && station.webSite !== 'null' ? (
                    <Link to={station.webSite} target="_blank" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: 'gray',
                          color: 'white',
                          borderRadius: '12px',
                          padding: 1,
                          margin: 1,
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: 'darkblue' }
                        }}
                      >
                        <FormattedMessage id="webSite" />
                      </Button>
                    </Link>
                  ) : null}
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'orange',
                      color: 'white',
                      borderRadius: '12px',
                      padding: 1,
                      margin: 1,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: 'darkorange' }
                    }}
                    onClick={() => handleGoToSuggest(station.id)}
                  >
                    <FormattedMessage id="proposeSong" />
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'purple',
                      color: 'white',
                      borderRadius: '12px',
                      padding: 1,
                      margin: 1,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: 'darkpurple' }
                    }}
                    onClick={handleContact}
                  >
                    <FormattedMessage id="contact" />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} margin={2}>
            <Grid item sm={12} xs={12}>
              <Typography variant="h4" marginBlock={2}>
                <FormattedMessage id="lastAcceptedSongs" />
              </Typography>
              <hr />
            </Grid>
            {acceptedSongs && (
              <Grid item container spacing={4} sm={12} xs={12}>
                {acceptedSongs.slice(0, 12).map((accept, index) => (
                  <Grid item key={index} xs={4} sm={3} md={2}>
                    <Card
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      {/* Station Logo as Background */}
                      <CardMedia
                        component="img"
                        image={accept.song.coverImagePath ? `${API_MEDIA_URL}${accept.song.coverImagePath}` : '/default-logo.png'}
                        alt={accept.song.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute'
                        }}
                      />
                    </Card>
                    <Grid textAlign="center" padding={1} variant="h5" fontFamily="bold" fontSize={18}>
                      {accept.song.title}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default StationDetails;
