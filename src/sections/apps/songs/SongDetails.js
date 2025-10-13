// material-ui
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { extractMinutesSecondsText } from 'utils/globals/functions';

// ==============================|| PRODUCT DETAILS - FEATURES ||============================== //

function SongDetails({ song }) {
  const artistNames = song.artistNames ? song.artistNames.$values.join(' | ') : '';
  const composersNames = song.composersNames ? song.composersNames.$values.join(' | ') : '';
  const writersNames = song.writersNames ? song.writersNames.$values.join(' | ') : '';
  const crOwnersNames = song.crOwnersNames ? song.crOwnersNames.$values.join(' | ') : '';
  const languagesLabels = song.languageLabels ? song.languageLabels.$values.join(' | ') : '';

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="title" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{song.title}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="interpreters" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{artistNames || '--'}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="duration" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{extractMinutesSecondsText(song.duration)}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="writers" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{writersNames}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="composers" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{composersNames}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="album" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{song.albumTitle || '--'}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="recordCompany" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>--</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="distributer" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{crOwnersNames}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="editors" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>--</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="isrc_code" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{song.codeISRC}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="musicGenre" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{song.genreMusicName}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="language" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontSize: 16 }}>{languagesLabels}</Typography>
      </Grid>
    </Grid>
  );
}

SongDetails.propTypes = {
  song: PropTypes.object,
  id: PropTypes.number,
  title: PropTypes.string,
  duration: PropTypes.string,
  composersNames: PropTypes.string,
  genreMusicName: PropTypes.string,
  coverImage: PropTypes.string,
  audioPath: PropTypes.string,
  releaseDate: PropTypes.string
};

export default SongDetails;
