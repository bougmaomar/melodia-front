// material-ui
import { Grid, LinearProgress, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// ===========================|| DATA WIDGET - TRAFFIC SOURCES ||=========================== //

const TrafficSources = () => (
  <MainCard
    title="Types de music"
    subheader={
      <Typography variant="caption" color="secondary">
        You’re getting more and more sources, keep it up!
      </Typography>
    }
  >
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">Classical</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              12%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={12} color="primary" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">Pop</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              38%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={38} color="primary" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">Jazz</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              40%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={40} color="success" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">Electronic</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              10%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={10} color="secondary" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </MainCard>
);

export default TrafficSources;
