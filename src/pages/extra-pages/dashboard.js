import { User, MusicPlaylist, DocumentText, DocumentDownload } from 'iconsax-react';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import ReportCard from 'components/cards/statistics/ReportCard';
import { FormattedMessage } from 'react-intl';

const Dashboard = () => {
  const theme = useTheme();
  const useData = localStorage.getItem('user');
  console.log(useData);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} lg={3} sm={6}>
        <ReportCard primary="30200" secondary={<FormattedMessage id="users" />} color={theme.palette.secondary.main} iconPrimary={User} />
      </Grid>
      <Grid item xs={12} md={4} lg={3} sm={6}>
        <ReportCard
          primary="14500"
          secondary={<FormattedMessage id="songs" />}
          color={theme.palette.error.main}
          iconPrimary={MusicPlaylist}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={3} sm={6}>
        <ReportCard
          primary="290+"
          secondary={<FormattedMessage id="page_views" />}
          color={theme.palette.success.main}
          iconPrimary={DocumentText}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={3} sm={6}>
        <ReportCard
          primary="500"
          secondary={<FormattedMessage id="downloads" />}
          color={theme.palette.primary.main}
          iconPrimary={DocumentDownload}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
