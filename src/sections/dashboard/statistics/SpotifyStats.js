import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { API_URL } from 'config';
import { useNavigate } from 'react-router';

const CLIENT_ID = 'your_spotify_client_id';
const REDIRECT_URI = 'http://localhost:3000/callback'; // Must match your Spotify settings
const SCOPES = 'user-top-read'; // Required scope to read user top tracks
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

export default function SpotifyStats() {
  const history = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        // Get the Spotify access token from the .NET backend
        const tokenRes = await axios.get(`${API_URL}/spotify/token`);
        const tokenData = tokenRes.data;
        const accessToken = tokenData.access_token;
        console.log(accessToken);

        if (!accessToken) throw new Error('Failed to retrieve access token');

        // Fetch the top tracks from Spotify using the token
        const res = await axios.get(
          'https://api.spotify.com/v1/recommendations?seed_artists=06HL4z0CvFAxyc27GXpf02&seed_genres=pop&seed_tracks=3n3Ppam7vgaVa1iaRUc9Lp&limit=10',
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        console.log(res);
        setTracks((await res.data) || []);
      } catch (error) {
        console.error('Error fetching Spotify data', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  console.log(tracks);
  return (
    <Grid container spacing={2} margin={4}>
      <Button onClick={() => history(AUTH_URL)}>Login with Spotify</Button>
      <Typography variant="h5">Top Spotify Tracks</Typography>
      {tracks?.map((track, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">{track.name}</Typography>
              <Typography color="textSecondary">{track.artists.map((artist) => artist.name).join(', ')}</Typography>
              <img src={track.album.images[0]?.url} alt={track.name} width={100} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
