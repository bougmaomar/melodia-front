// material-ui
import { Grid, LinearProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// project-imports
import MainCard from 'components/MainCard';
import { FormattedMessage } from 'react-intl';

// ===========================|| DATA WIDGET - TRAFFIC SOURCES ||=========================== //

const GenreStatistics = ({ types }) => (
  <MainCard
    title={<FormattedMessage id="musicGenres" />}
    subheader={
      <Typography variant="caption" color="secondary">
        <FormattedMessage id="mostUsedTypes" />
      </Typography>
    }
  >
    <Grid container spacing={3}>
      {types &&
        types.map((type, key) => (
          <Grid key={key} item xs={12}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item sm zeroMinWidth>
                <Typography variant="body2">{type.key == 'Others' ? <FormattedMessage id={type.key} /> : type.key}</Typography>{' '}
                {/* Use type.key or appropriate property */}
              </Grid>
              <Grid item>
                <Typography variant="body2" align="right">
                  {type.value} % {/* Use type.value or appropriate property */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={type.value} color="success" /> {/* Use type.value for the progress */}
              </Grid>
            </Grid>
          </Grid>
        ))}
    </Grid>
  </MainCard>
);

export default GenreStatistics;

GenreStatistics.propTypes = {
  types: PropTypes.array
};
