import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Grid } from '@mui/material';
import axios from 'utils/axios';
import { API_URL } from 'config';
import { useTheme } from '@mui/material/styles';
import SongList from './songList';
import ReportCard from './reportCard';
import { MusicPlaylist, DocumentText, DocumentDownload } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

const SongsPage = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [mostDownloadedSongs, setMostDownloadedSongs] = useState([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState([]);
  const [latestAddedSongs, setLatestAddedSongs] = useState([]);
  const [stats, setStats] = useState({
    trending: 0,
    latestAdded: 0,
    mostDownloaded: 0,
    mostPlayed: 0,
    totalSongs: 0,
    singles: 0
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, downloaded, played, latest, totalSongs] = await Promise.all([
          axios.get(`${API_URL}/Songs/trending`),
          axios.get(`${API_URL}/Songs/most-downloaded`),
          axios.get(`${API_URL}/Songs/most-played`),
          axios.get(`${API_URL}/Songs/latest-added`),
          axios.get(`${API_URL}/Songs`)
        ]);

        setTrendingSongs(trending.data?.$values || []);
        setMostDownloadedSongs(downloaded.data?.$values || []);
        setMostPlayedSongs(played.data?.$values || []);
        setLatestAddedSongs(latest.data?.$values || []);
        const singles = totalSongs.data?.$values.filter((song) => song.albumId === null) || [];

        setStats({
          trending: trending.data?.$values.length ?? 0,
          latestAdded: latest.data?.$values.length ?? 0,
          mostDownloaded: downloaded.data?.$values.length ?? 0,
          mostPlayed: played.data?.$values.length ?? 0,
          totalSongs: totalSongs.data?.$values.length ?? 0,
          singles: singles.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        <FormattedMessage id="dashboard_songs" />
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4} lg={4} sm={6}>
          <ReportCard
            primary={stats.trending}
            secondary={<FormattedMessage id="trending_songs" />}
            color={theme.palette.secondary.main}
            iconPrimary={<MusicPlaylist />}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sm={6}>
          <ReportCard
            primary={stats.latestAdded}
            secondary={<FormattedMessage id="lastadded_songs" />}
            color={theme.palette.error.main}
            iconPrimary={<MusicPlaylist />}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sm={6}>
          <ReportCard
            primary={stats.mostDownloaded}
            secondary={<FormattedMessage id="most_downloaded_songs" />}
            color={theme.palette.success.main}
            iconPrimary={<DocumentDownload />}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sm={6}>
          <ReportCard
            primary={stats.mostPlayed}
            secondary={<FormattedMessage id="most_played_songs" />}
            color={theme.palette.primary.main}
            iconPrimary={<DocumentText />}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sm={6}>
          <ReportCard
            primary={stats.totalSongs}
            secondary={<FormattedMessage id="total_songs" />}
            color={theme.palette.warning.main}
            iconPrimary={<MusicPlaylist />}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sm={6}>
          <ReportCard
            primary={stats.singles}
            secondary={<FormattedMessage id="singles" />}
            color={theme.palette.info.main}
            iconPrimary={<MusicPlaylist />}
          />
        </Grid>
      </Grid>
      <SongList title={<FormattedMessage id="trending_songs" />} songs={trendingSongs.slice(0, -1)} />
      <SongList title={<FormattedMessage id="most_downloaded_songs" />} songs={mostDownloadedSongs} />
      <SongList title={<FormattedMessage id="most_played_songs" />} songs={mostPlayedSongs} />
      <SongList title={<FormattedMessage id="lastadded_songs" />} songs={latestAddedSongs} />
    </Container>
  );
};

export default SongsPage;
