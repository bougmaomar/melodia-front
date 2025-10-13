import { Grid, Card, CardContent, Typography, Box, CardMedia } from '@mui/material';
import { Groups, Radio, MusicNote, BarChart } from '@mui/icons-material';
import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import { useNavigate } from 'react-router';
import { API_MEDIA_URL } from 'config';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import defaultStation from 'assets/images/users/default_station.png';

const StationsList = () => {
  const history = useNavigate();
  const { getStations, getTopStation } = useStation();
  const { getAllProposalsCount, getAllAcceptedProposalsCount } = useProposals();
  const [stations, setStations] = useState([]);
  const [stationNum, setStationNum] = useState(0);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [topStation, setTopStation] = useState('');

  const statistics = [
    { icon: <Radio fontSize="large" color="primary" />, label: 'Total Stations', value: stationNum || 0 },
    { icon: <Groups fontSize="large" color="secondary" />, label: 'Chansons Proposées', value: proposalsCount || 0 },
    { icon: <MusicNote fontSize="large" color="success" />, label: 'Chansons Acceptées', value: acceptedCount || 0 },
    { icon: <BarChart fontSize="large" color="warning" />, label: 'Top Station', value: topStation || 'N/A' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [stations, proposalsCount, acceptedProposalsCount, top] = await Promise.all([
        getStations(),
        getAllProposalsCount(),
        getAllAcceptedProposalsCount(),
        getTopStation()
      ]);

      setStations(stations);
      setStationNum(stations.length);
      setProposalsCount(proposalsCount);
      setAcceptedCount(acceptedProposalsCount);
      setTopStation(top);
    };
    fetchData();
  }, []);

  const handleGoToDetails = (id) => {
    history(`/agent/stations/details/${id}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" color="textSecondary" marginBottom={4}>
        <FormattedMessage id="stationPageText" /> ! 📊🚀
      </Typography>

      <Grid container spacing={3} justifyContent="flex">
        {stations.map((station, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1', // Ensures square shape
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.05)' }
              }}
              onClick={() => handleGoToDetails(station.stationId)}
            >
              {/* Station Logo as Background */}
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

              {/* Overlay for Station Details */}
              <CardContent
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)', // Dark transparent overlay
                  color: 'white',
                  textAlign: 'center',
                  padding: 1
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {station.stationName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h2" marginBlock={3}>
        Station statistics
      </Typography>
      <Grid container spacing={2}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 3,
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {stat.icon}
              <Typography variant="h6" fontWeight="bold" mt={2}>
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StationsList;
