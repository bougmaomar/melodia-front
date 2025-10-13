import React, { useEffect, useState } from 'react';
// import MainCard from 'components/MainCard';
// import { useState } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button, Box } from '@mui/material';
import { Music, User, Headphones, AttachCircle } from 'iconsax-react';
import { useNavigate } from 'react-router';
import useAgent from 'hooks/useAgent';
import useArtist from 'hooks/useArtist';
import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import ChatData from 'sections/dashboard/data/ChatData';

const avatarImage = require.context('assets/images/users', true);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const defaultAvatar = avatarImage('./default.jpeg');
  const navigate = useNavigate();
  const { getStations } = useStation();
  const { getAllAcceptedProposalsByAgent } = useProposals();
  const { getAllSongsByAgent } = useAgent();
  const { getArtistsByAgent } = useArtist();
  const [artists, setArtists] = useState([]);
  const [artistNum, setArtistNum] = useState(0);
  const [songsNum, setSongsNum] = useState(0);
  const [stationsNum, setStationsNum] = useState(0);
  const [acceptsNum, setAcceptsNum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.userId) {
          const [artists, songs, stations, accepts] = await Promise.all([
            getArtistsByAgent(user.userId),
            getAllSongsByAgent(user.userId),
            getStations(),
            getAllAcceptedProposalsByAgent(user.userId)
          ]);
          setArtists(artists.$values || []);
          setArtistNum(artists.$values.length);
          setSongsNum(songs.length);
          setStationsNum(stations.length);
          setAcceptsNum(accepts.length);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user, getArtistsByAgent]);

  // Static stats
  const stats = [
    { id: 'artists', title: 'Nombre des artistes', value: artistNum, icon: <User size={32} />, color: '#1976d2', link: '/agent/artists' },
    { id: 'songs', title: 'Nombre de chansons', value: songsNum, icon: <Music size={32} />, color: '#ff9800', link: '/agent/songs' },
    {
      id: 'accepts',
      title: 'Nombre d`acceptations',
      value: acceptsNum,
      icon: <AttachCircle size={32} />,
      color: '#4caf50',
      link: '/agent/suggest/0'
    },
    {
      id: 'stations',
      title: 'Nombre des stations',
      value: stationsNum,
      icon: <Headphones size={32} />,
      color: '#e91e63',
      link: '/agent/stations'
    }
  ];
  // Handle click to navigate to artist's dashboard
  const handleArtistClick = (id) => {
    navigate(`/agent/artistdashboard/${id}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        {/* Statistics Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.03)', transition: '0.3s ease-in-out' }
              }}
              onClick={() => navigate(stat.link)}
            >
              <Card
                sx={{
                  textAlign: 'center',
                  p: 1,
                  borderRadius: '8px',
                  background: '#fff',
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  borderLeft: `8px solid ${stat.color}`
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary" marginTop={2}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}

        {/* Artists List */}
        <Grid item xs={12} md={12}>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="artists" />
          </Typography>
          <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {artists.map((artist) => (
              <Grid item key={artist.id}>
                <Button
                  onClick={() => handleArtistClick(artist.artistId)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textTransform: 'none'
                  }}
                >
                  <Avatar
                    alt="Artist Avatar"
                    src={artist.photoProfile ? `${API_MEDIA_URL}${artist.photoProfile}` : defaultAvatar}
                    sx={{ width: 100, height: 100, mb: 1, border: '2px solid #1976d2' }}
                  />
                  <Typography>{artist.artistRealName}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* chat data */}
        <Grid item xs={12}>
          <ChatData />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
