// material-ui
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { extractMinutesSecondsText } from 'utils/globals/functions';

// ==============================|| ALBUM DETAILS - FEATURES ||============================== //

function AlbumDetail({ album }) {
  const artistNames = album.artistNames ? album.artistNames.$values.join(' | ') : '';

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="Album_Title" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ fontSize: 16 }}>{album.title}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="type" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ fontSize: 16 }}>{album.albumTypeName}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="description" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ fontSize: 16 }}>{album.description}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="release_date" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ fontSize: 16 }}>{formatReleaseDate(album.releaseDate)}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="duration" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ fontSize: 16 }}>{extractMinutesSecondsText(album.totalDuration)}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography color="textSecondary" style={{ fontSize: 16 }}>
          <FormattedMessage id="artists" />:{' '}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ fontSize: 16 }}>{artistNames}</Typography>
      </Grid>
    </Grid>
  );
}

AlbumDetail.propTypes = {
  album: PropTypes.object,
  id: PropTypes.number,
  title: PropTypes.string,
  totalDuration: PropTypes.string,
  artistNames: PropTypes.string,
  albumTypeName: PropTypes.string,
  releaseDate: PropTypes.string
};

export default AlbumDetail;
