import { React, useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import { Grid } from '@mui/material';
import { Music, User, Document } from 'iconsax-react';

import useStation from 'hooks/useSation';
import useProposals from 'hooks/useProposals';
import useSongs from 'hooks/useSongs';
import useAdmin from 'hooks/useAdmin';

import StatsCard from 'sections/dashboard/statistics/StatsCard';
import StationCard from 'sections/dashboard/statistics/StationCard';
import ProposalsCard from 'sections/dashboard/statistics/ProposalsCard';
import GenreStatistics from 'sections/widget/data/GenreStatistics';
import LanguageStatistics from 'sections/widget/data/LanguageStatistics';
import ProjectAnalytics from 'sections/dashboard/chart/ProjectAnalytics';
import { FormattedMessage } from 'react-intl';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { getStationById } = useStation();
  const { getProposals } = useProposals();
  const { getArtists } = useAdmin();
  const {
    getSongs,
    getMostUsedTypes,
    getMostUsedLanguages,
    getSongsByDecade,
    getSongsByDuration,
    getAcceptsByDecade,
    getAcceptsByDuration,
    getSongsStatistics,
    getProposalsStatistics,
    getProposalsAcceptedByStation
  } = useSongs();

  const [songs, setSongs] = useState();
  const [songsStat, setSongsStat] = useState();
  const [artists, setArtists] = useState();
  const [station, setStation] = useState();
  const [proposals, setProposals] = useState();
  const [proposalsStat, setProposalsStat] = useState();
  const [types, setTypes] = useState();
  const [languages, setLanguages] = useState();
  const [numberDecade, setNumberDecade] = useState();
  const [decade, setDecade] = useState();
  const [acceptDecade, setAcceptDecade] = useState();
  const [acceptDuration, setAcceptDuration] = useState();
  const [numberDuration, setNumberDuration] = useState();
  const [numberAcceptedStation, setNumberAcceptedStation] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [station, songs, sStat, artists, proposals, pStat, types, langs, decade, duration, acdecade, acDuree, acByStation] =
          await Promise.all([
            getStationById(user.userId),
            getSongs(),
            getSongsStatistics(),
            getArtists(),
            getProposals(user.userId),
            getProposalsStatistics(),
            getMostUsedTypes(),
            getMostUsedLanguages(),
            getSongsByDecade(),
            getSongsByDuration(),
            getAcceptsByDecade(),
            getAcceptsByDuration(),
            getProposalsAcceptedByStation(user.userId)
          ]);

        setStation(station);
        setSongs(songs.length);
        setSongsStat(sStat);
        setArtists(artists.length);
        setProposals(proposals);
        setProposalsStat(pStat);
        setTypes(types);
        setLanguages(langs);
        setNumberDecade(decade.map((item) => item.value));
        setDecade(decade.map((key) => key.key));
        setNumberDuration(duration.map((item) => item.value));
        setAcceptDecade(acdecade.map((item) => item.value));
        setAcceptDuration(acDuree.map((item) => item.value));
        setNumberAcceptedStation(acByStation);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGetNew = () => {
    var res = [...proposals].filter((p) => p.status == 0).sort((a, b) => new Date(b.proposalDate) - new Date(a.proposalDate));
    return res.slice(0, 3);
  };

  return (
    <>
      <MainCard>
        <Grid container rowSpacing={4.5} columnSpacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            {/* {songs && songsStat && ( */}
            {songs !== undefined && songsStat !== undefined && (
              <StatsCard
                title={<FormattedMessage id="total_songs" />}
                value={songs || 0}
                icon={<Music />}
                trend={{ value: songsStat, isPositive: songsStat >= 0 }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            {artists !== undefined && (
              <StatsCard
                title={<FormattedMessage id="totalArtists" />}
                value={artists || 0}
                icon={<User />}
                trend={{ value: 0, isPositive: true }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            {proposals !== undefined && proposalsStat !== undefined && (
              <StatsCard
                title={<FormattedMessage id="totalProposals" />}
                value={proposals?.length || 0}
                icon={<Document />}
                trend={{ value: proposalsStat, isPositive: proposalsStat >= 0 }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            {proposals !== undefined && proposalsStat !== undefined && (
              <StatsCard
                title={<FormattedMessage id="AcceptanceRate" />}
                value={proposals?.length ? `${(((numberAcceptedStation || 0) / proposals.length) * 100).toFixed(0)} %` : '0%'}
                icon={<Document />}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            {proposals !== undefined && proposalsStat !== undefined && (
              <StatsCard title={<FormattedMessage id="accepteds" />} value={numberAcceptedStation || 0} icon={<Document />} />
            )}
          </Grid>
          <Grid item xs={12} md={12} lg={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {station && <StationCard user={station} />}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            {proposals && <ProposalsCard proposals={handleGetNew()} />}
          </Grid>
          <Grid item xs={12} md={6}>
            {types && <GenreStatistics types={types} />}
          </Grid>
          <Grid item xs={12} md={6}>
            {languages && <LanguageStatistics languages={languages} />}
          </Grid>

          {numberDecade && numberDuration && acceptDecade && (
            <Grid item xs={12}>
              <ProjectAnalytics
                allDecade={numberDecade}
                decadeCategories={decade}
                allDuration={numberDuration}
                allAcceptDecade={acceptDecade}
                allAcceptDuration={acceptDuration}
              />
            </Grid>
          )}
        </Grid>
      </MainCard>
    </>
  );
};

export default Dashboard;
