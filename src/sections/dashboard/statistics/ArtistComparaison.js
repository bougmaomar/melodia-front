import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography, MenuItem, Select } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAdmin from 'hooks/useAdmin';
import useArtist from 'hooks/useArtist';
import { FormattedMessage, useIntl } from 'react-intl';

const ArtistComparison = ({ id }) => {
  const { getArtists } = useAdmin();
  const { getPlaysComparaison } = useArtist();
  const { formatMessage } = useIntl();
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [comparisonData, setComparisonData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getArtists();
        if (res && res.length > 0) {
          const filteredArtists = res.filter((artist) => artist.artistId !== id);
          setArtists(filteredArtists);
          if (filteredArtists.length > 0) {
            setSelectedArtist(filteredArtists[0].artistId);
          } else {
            setSelectedArtist('');
          }
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, [id]);

  useEffect(() => {
    if (!selectedArtist) return;

    const fetchComparisonData = async () => {
      try {
        const res = await getPlaysComparaison(id, selectedArtist);
        setComparisonData(res);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      }
    };

    fetchComparisonData();
  }, [selectedArtist, id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Grid
          style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '6px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          <Typography style={{ fontWeight: 'bold' }}>{label}</Typography>
          <Typography style={{ fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#3b82f6', marginRight: '5px' }}></span>
            <FormattedMessage id="you" />: {payload[0].payload.you.toLocaleString()} <FormattedMessage id="plays" />
          </Typography>
          <Typography style={{ fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#94a3b8', marginRight: '5px' }}></span>
            {artists?.find((a) => a.artistId === selectedArtist)?.artistRealName}: {payload[0].payload.comparison.toLocaleString()}{' '}
            <FormattedMessage id="plays" />
          </Typography>
        </Grid>
      );
    }
    return null;
  };
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string
  };

  return (
    <Card
      sx={{
        overflow: 'hidden',
        transition: 'all 0.5s ease-in-out',
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {selectedArtist ? (
        <CardContent sx={{ p: 2 }}>
          <Grid>
            <Select
              value={selectedArtist && selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              fullWidth
              sx={{
                maxWidth: 180,
                bgcolor: 'background.paper',
                borderRadius: 2,
                m: 2
              }}
              displayEmpty
              renderValue={(selected) => artists?.find((artist) => artist.artistId === selected)?.artistRealName || 'Select an artist'}
            >
              {artists?.map(
                (artist) => (
                  // artist.artistId != id && (
                  <MenuItem key={artist.artistId} value={artist.artistId}>
                    {artist.artistRealName}
                  </MenuItem>
                )
                // )
              )}
            </Select>
          </Grid>

          <Grid style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.6)' }} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="you"
                  name={formatMessage({ id: 'you' })}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="comparison"
                  name={artists?.find((a) => a.artistId === selectedArtist)?.artistRealName}
                  stroke="#94a3b8"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </CardContent>
      ) : (
        <Typography variant="body2" sx={{ m: 2 }}>
          <FormattedMessage id="no-artists-to-compare" defaultMessage="No other artists to compare." />
        </Typography>
      )}
    </Card>
  );
};
ArtistComparison.propTypes = {
  id: PropTypes.number.isRequired
};

export default ArtistComparison;
