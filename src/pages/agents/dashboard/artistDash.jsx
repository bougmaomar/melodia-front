import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ThemeMode } from 'config';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { Airpods, DocumentDownload, Eye, Heart } from 'iconsax-react';

// project-imports
import NewSongs from 'sections/dashboard/chart/NewSongs';
import NewProposals from 'sections/dashboard/chart/NewProposals';
import NewVisits from 'sections/dashboard/chart/NewAccepts';
import UserCard from 'sections/dashboard/statistics/UserCard';
import MediaCard from 'sections/dashboard/statistics/MediaCard';
// import TopSongs from 'sections/widget/data/TopSongs';
// import TopStations from 'sections/widget/data/TopStations';
import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';
import ArtistComparison from 'sections/dashboard/statistics/ArtistComparaison';

// Hooks
import useSongs from 'hooks/useSongs';
// import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import useArtist from 'hooks/useArtist';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

const ArtistDashboard = () => {
  const theme = useTheme();
  const { id } = useParams();
  // const [songs, setSongs] = useState();
  // const [stations, setStations] = useState();
  const [downloadsCount, setDownloads] = useState(0);
  const [playsCount, setPlays] = useState(0);
  // const [proposals, setProposals] = useState();
  // const [acceptProps, setAcceptProps] = useState();
  const [accepts, setAccepts] = useState(0);
  const [visits, setVisits] = useState(0);
  const [mensualProposals, setMensualProposals] = useState();
  const [annualProposals, setAnnualProposals] = useState();
  const [mensualSongs, setMensualSongs] = useState();
  const [annualSongs, setAnnualSongs] = useState();
  const [mensualVisits, setMensualVisits] = useState();
  const [annualVisits, setAnnualVisits] = useState();
  const [artist, setArtist] = useState();
  const [user, setUser] = useState();
  const { getAllDownloadsByArtist, getAllPlaysByArtist, getMensualSongsByArtist, getAnnualSongsByArtist } = useSongs();
  // const { getArtistSongs, getAllDownloadsByArtist, getAllPlaysByArtist, getMensualSongsByArtist, getAnnualSongsByArtist } = useSongs();
  // const { getStations } = useStation();
  // const { getAllProposalsByArtist, getAllAcceptedProposalsByArtist, getMensualProposalsByArtist, getAnnualProposalsByArtist } =
  const { getAllAcceptedProposalsByArtist, getMensualProposalsByArtist, getAnnualProposalsByArtist } = useProposals();
  // const { getArtistById, getArtistByEmail, getMensualVisitsByArtist, getAnnualVisitsByArtist } = useArtist();
  const { getArtistById, getAllVisitsByArtist, getArtistByEmail, getMensualVisitsByArtist, getAnnualVisitsByArtist } = useArtist();

  useEffect(() => {
    const fetchData = async () => {
      const artist = await getArtistById(id);
      artist && setUser(artist);
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [
          // songs,
          // stations,
          downloads,
          plays,
          // proposals,
          accepts,
          visits,
          artist,
          mensual_proposals,
          annual_proposals,
          mensual_songs,
          annual_songs,
          mensual_visits,
          annual_visits
        ] = await Promise.all([
          // getArtistSongs(user.email),
          // getStations(),
          getAllDownloadsByArtist(user.artistId),
          getAllPlaysByArtist(user.artistId),
          // getAllProposalsByArtist(user.artistId),
          getAllAcceptedProposalsByArtist(user.artistId),
          getAllVisitsByArtist(user.artistId),
          getArtistByEmail(user.email),
          getMensualProposalsByArtist(user.artistId),
          getAnnualProposalsByArtist(user.artistId),
          getMensualSongsByArtist(user.artistId),
          getAnnualSongsByArtist(user.artistId),
          getMensualVisitsByArtist(user.artistId),
          getAnnualVisitsByArtist(user.artistId)
        ]);
        // setSongs(songs);
        // setStations(stations);
        setDownloads(downloads.length);
        setPlays(plays.length);
        // setProposals(proposals);
        // setAcceptProps(accepts);
        setAccepts(accepts.length);
        setVisits(visits.length);
        setArtist(artist);
        setMensualProposals(mensual_proposals);
        setAnnualProposals(annual_proposals);
        setMensualSongs(mensual_songs);
        setAnnualSongs(annual_songs);
        setMensualVisits(mensual_visits);
        setAnnualVisits(annual_visits);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (user) {
      fetchData();
    }
  }, [id, user]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* row 1 */}
      <Grid item xs={12} md={4} lg={3}>
        {mensualProposals && annualProposals && <NewProposals mensual={mensualProposals} annual={annualProposals} type="agent" />}
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        {mensualSongs && annualSongs && <NewSongs mensual={mensualSongs} annual={annualSongs} type="agent" />}
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        {mensualVisits && annualVisits && <NewVisits mensual={mensualVisits} annual={annualVisits} type="agent" />}
      </Grid>
      <Grid item xs={12} md={12} lg={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {artist && <UserCard user={artist} />}
          </Grid>
          <Grid item xs={12}>
            {artist && <MediaCard youtube={artist.youtube} spotify={artist.spotify} />}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={3} lg={3} sm={6}>
        <HoverSocialCard primary="Total d'écoutes" secondary={`${playsCount} +`} iconPrimary={Airpods} color={theme.palette.primary.main} />
      </Grid>
      <Grid item xs={12} md={3} lg={3} sm={6}>
        <HoverSocialCard
          primary="Total de téléchargement"
          secondary={`${downloadsCount} +`}
          iconPrimary={DocumentDownload}
          color={theme.palette.info.main}
        />
      </Grid>
      <Grid item xs={12} md={3} lg={3} sm={6}>
        <HoverSocialCard
          primary="Total d'acceptations"
          secondary={`${accepts} +`}
          iconPrimary={Heart}
          color={theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.dark}
        />
      </Grid>
      <Grid item xs={12} md={3} lg={3} sm={6}>
        <HoverSocialCard primary="Total de visites" secondary={`${visits} +`} iconPrimary={Eye} color={theme.palette.error.main} />
      </Grid>
      {/*
      {songs && proposals && acceptProps && (
        <Grid item xs={12} md={6}>
          <TopSongs songs={songs} proposals={proposals} accepts={acceptProps} type="agent" />
        </Grid>
      )}
      {stations && (
        <Grid item xs={12} md={6}>
          <TopStations stations={stations} />
        </Grid>
      )}
*/}
      <Grid item xs={12}>
        {user && <ArtistComparison id={user.artistId} />}
      </Grid>
    </Grid>
  );
};

export default ArtistDashboard;
