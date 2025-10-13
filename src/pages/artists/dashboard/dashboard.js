// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { Airpods, DocumentDownload, Eye, Heart } from 'iconsax-react';

// project-imports

//import NewSongs from 'sections/dashboard/chart/NewSongs';
//import NewProposals from 'sections/dashboard/chart/NewProposals';
//import NewVisits from 'sections/dashboard/chart/NewAccepts';

import UserCard from 'sections/dashboard/statistics/UserCard';
import MediaCard from 'sections/dashboard/statistics/MediaCard';

// import TopSongs from 'sections/widget/data/TopSongs';
// import TopStations from 'sections/widget/data/TopStations';
import ChatData from 'sections/dashboard/data/ChatData';
import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';

import { ThemeMode } from 'config';
import { useEffect, useState, useMemo } from 'react';
import useSongs from 'hooks/useSongs';
// import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import useArtist from 'hooks/useArtist';
import { useIntl } from 'react-intl';
import ArtistComparison from 'sections/dashboard/statistics/ArtistComparaison';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem('user'));
  }, []);
  const { formatMessage } = useIntl();
  // const [songs, setSongs] = useState([]);
  // const [stations, setStations] = useState([]);
  const [downloadsCount, setDownloads] = useState(0);
  const [playsCount, setPlays] = useState(0);
  //const [proposals, setProposals] = useState([]);
  //const [acceptProps, setAcceptProps] = useState([]);
  const [accepts, setAccepts] = useState(0);
  const [visits, setVisits] = useState(0);
  //const [mensualProposals, setMensualProposals] = useState([]);
  //const [annualProposals, setAnnualProposals] = useState([]);
  //const [mensualSongs, setMensualSongs] = useState([]);
  //const [annualSongs, setAnnualSongs] = useState([]);
  //const [mensualVisits, setMensualVisits] = useState([]);
  //const [annualVisits, setAnnualVisits] = useState([]);
  const [artist, setArtist] = useState();
  const { getAllDownloadsByArtist, getAllPlaysByArtist, getMensualSongsByArtist, getAnnualSongsByArtist } = useSongs();
  // const { getStations } = useStation();
  // const { getAllProposalsByArtist, getAllAcceptedProposalsByArtist, getMensualProposalsByArtist, getAnnualProposalsByArtist } =
  const { getMensualProposalsByArtist, getAnnualProposalsByArtist, getAllAcceptedProposalsByArtist } = useProposals();
  const { getAllVisitsByArtist, getArtistByEmail, getMensualVisitsByArtist, getAnnualVisitsByArtist } = useArtist();

  useEffect(() => {
    let isMounted = true;

    const fetchEssentialData = async () => {
      try {
        // const [songsData, stationData] = await Promise.all([getArtistSongs(user.email), getStations()]);

        // if (isMounted) {
        //   setSongs(songsData);
        //   setStations(stationData);
        // }

        // Defer non-blocking heavy requests
        setTimeout(async () => {
          try {
            const [downloads, plays, artistInfo] = await Promise.all([
              getAllDownloadsByArtist(user.userId),
              getAllPlaysByArtist(user.userId),
              getArtistByEmail(user.email)
            ]);

            if (isMounted) {
              setDownloads(downloads.length);
              setPlays(plays.length);
              setArtist(artistInfo);
            }
          } catch (err) {
            console.error('❌ Error fetching secondary initial data:', err);
          }
        }, 100);
      } catch (err) {
        console.error('❌ Error fetching essential initial data:', err);
      }
    };

    const fetchStatsData = async () => {
      try {
        const [/*proposals,*/ accepts, visits/*, mensualProps, annualProps, mensualSongs, annualSongs, mensualVisits, annualVisits*/] =
          await Promise.all([
            //getAllProposalsByArtist(user.userId),
            getAllAcceptedProposalsByArtist(user.userId),
            getAllVisitsByArtist(user.userId),
            getMensualProposalsByArtist(user.userId),
            getAnnualProposalsByArtist(user.userId),
            getMensualSongsByArtist(user.userId),
            getAnnualSongsByArtist(user.userId),
            getMensualVisitsByArtist(user.userId),
            getAnnualVisitsByArtist(user.userId)
          ]);

        if (isMounted) {
          //setProposals(proposals);
          //setAcceptProps(accepts);
          setAccepts(accepts.length);
          setVisits(visits.length);
          //setMensualProposals(mensualProps);
          //setAnnualProposals(annualProps);
          //setMensualSongs(mensualSongs);
          //setAnnualSongs(annualSongs);
          //setMensualVisits(mensualVisits);
          //setAnnualVisits(annualVisits);
        }
      } catch (err) {
        console.error('❌ Error fetching stats data:', err);
      }
    };

    if (user?.userId && user?.email) {
      fetchEssentialData();

      // Delay stats fetch slightly to avoid UI jank
      setTimeout(() => {
        fetchStatsData();
      }, 300);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.userId, user?.email]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/** 
      <Grid item xs={12} md={4} lg={3}>
        {mensualProposals && annualProposals && <NewProposals mensual={mensualProposals} annual={annualProposals} type="artist" />}
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        {mensualSongs && annualSongs && <NewSongs mensual={mensualSongs} annual={annualSongs} type="artist" />}
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        {mensualVisits && annualVisits && <NewVisits mensual={mensualVisits} annual={annualVisits} type="artist" />}
      </Grid>
      */}

      {/* Section statistiques + profil artiste (sous les autres éléments) */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {/* Blocs statistiques à gauche (2x2) */}
          <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <HoverSocialCard
                  primary={formatMessage({ id: 'totalPlays' })}
                  secondary={`${playsCount} +`}
                  iconPrimary={Airpods}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <HoverSocialCard
                  primary={formatMessage({ id: 'totalDownloads' })}
                  secondary={`${downloadsCount} +`}
                  iconPrimary={DocumentDownload}
                  color={theme.palette.info.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <HoverSocialCard
                  primary={formatMessage({ id: 'totalAccepts' })}
                  secondary={`${accepts} +`}
                  iconPrimary={Heart}
                  color={theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.dark}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <HoverSocialCard
                  primary={formatMessage({ id: 'totalVisits' })}
                  secondary={`${visits} +`}
                  iconPrimary={Eye}
                  color={theme.palette.error.main}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Bloc artiste à droite */}
          <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {artist && <UserCard user={artist} />}
              </Grid>
              <Grid item xs={12}>
                {artist && <MediaCard youtube={artist.youtube} spotify={artist.spotify} />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <ChatData />
      </Grid>
      {/* {songs && proposals && acceptProps && (
        <Grid item xs={12} md={6}>
          <TopSongs songs={songs} proposals={proposals} accepts={acceptProps} type="artist" />
        </Grid>
      )}
      {stations && (
        <Grid item xs={12} md={6}>
          <TopStations stations={stations} type="artist" />
        </Grid>
      )} */}

      <Grid item xs={12}>
        <ArtistComparison id={user?.userId} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
