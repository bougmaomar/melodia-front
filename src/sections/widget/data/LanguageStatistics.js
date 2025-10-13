// material-ui
import { Grid, LinearProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
// project-imports
import MainCard from 'components/MainCard';
import { FormattedMessage } from 'react-intl';

// ===========================|| DATA WIDGET - TRAFFIC SOURCES ||=========================== //

const LanguageStatistics = ({ languages }) => (
  <MainCard
    title={<FormattedMessage id="languages" />}
    subheader={
      <Typography variant="caption" color="secondary">
        <FormattedMessage id="mostUsedLanguages" />
      </Typography>
    }
  >
    <Grid container spacing={3}>
      {languages &&
        languages.map((lang, key) => (
          <Grid key={key} item xs={12}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item sm zeroMinWidth>
                <Typography variant="body2">{lang.key == 'Others' ? <FormattedMessage id={lang.key} /> : lang.key}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" align="right">
                  {lang.value} %
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={lang.value} color="primary" />
              </Grid>
            </Grid>
          </Grid>
        ))}
    </Grid>
  </MainCard>
);

export default LanguageStatistics;

LanguageStatistics.propTypes = {
  languages: PropTypes.array
};
