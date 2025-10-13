import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

// Material UI
import { Grid, Card, CardContent, Typography, Box, CardMedia } from '@mui/material';
import { Groups, Radio, MusicNote, BarChart } from '@mui/icons-material';

// Hooks
import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';

// Assets
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
    { icon: <Radio fontSize="large" color="primary" />, label: <FormattedMessage id="totalStations" />, value: stationNum || 0 },
    { icon: <Groups fontSize="large" color="secondary" />, label: <FormattedMessage id="proposalSongs" />, value: proposalsCount || 0 },
    { icon: <MusicNote fontSize="large" color="success" />, label: <FormattedMessage id="acceptedSongs" />, value: acceptedCount || 0 },
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
    history(`/artist/stations/details/${id}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" color="textSecondary" marginBottom={4}>
        <FormattedMessage id="stationPageText" /> ! 📊🚀
      </Typography>

      <Grid container spacing={3} justifyContent="flex">
        {stations.map((station, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
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
              onClick={() => handleGoToDetails(station.stationId)}
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
              <CardContent
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
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
        <FormattedMessage id="statistics" />
      </Typography>
      <Grid container spacing={2}>
        {statistics.map((stat, index) => (
          <Grid item xs={6} sm={3} md={3} lg={3} key={index}>
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
