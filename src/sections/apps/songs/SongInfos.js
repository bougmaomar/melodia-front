import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { ButtonBase, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';
import { FormattedMessage } from 'react-intl';

// ==============================|| COLORS OPTION ||============================== //

const Colors = ({ checked, colorsData }) => {
  const theme = useTheme();

  return (
    <Grid item>
      <Tooltip title={colorsData.length && colorsData[0] && colorsData[0].label ? colorsData[0].label : ''}>
        <ButtonBase
          sx={{
            borderRadius: '50%',
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.secondary.dark}`,
              outlineOffset: 2
            }
          }}
        >
          <Avatar
            color="inherit"
            size="sm"
            sx={{
              bgcolor: colorsData[0]?.bg,
              color: theme.palette.mode === ThemeMode.DARK ? 'secondary.800' : 'secondary.lighter',
              border: '3px solid',
              borderColor: checked ? theme.palette.secondary.light : theme.palette.background.paper
            }}
          >
            {' '}
          </Avatar>
        </ButtonBase>
      </Tooltip>
    </Grid>
  );
};

Colors.propTypes = {
  checked: PropTypes.bool,
  colorsData: PropTypes.array
};

// ==============================|| PRODUCT DETAILS - INFORMATION ||============================== //

const SongInfos = ({ song }) => {
  const languagesLabels = song.languageLabels ? song.languageLabels.$values.join(' | ') : '';
  const artistNames = song.artistNames ? song.artistNames.$values.join(' | ') : '';

  return (
    <Stack>
      <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '0.8rem' }}>
        {song.title}
      </Typography>
      <Typography color="textSecondary" variant="h4" marginBlock={0.5}>
        {artistNames}
      </Typography>
      <Typography color="textSecondary" marginBlock={0.5}>
        <strong>
          <FormattedMessage id="language" />:
        </strong>{' '}
        {languagesLabels}
      </Typography>
      <Grid container spacing={1} marginBlock={1}>
        <Chip
          size="small"
          label={song.genreMusicName}
          sx={{
            width: 'fit-content',
            borderRadius: '6px',
            color: 'success.main',
            bgcolor: 'success.lighter'
          }}
        />
        <Chip
          size="small"
          label={song.albumTitle || 'None'}
          sx={{
            width: 'fit-content',
            borderRadius: '6px',
            color: 'secondary.main',
            marginX: 1
          }}
        />
      </Grid>
    </Stack>
  );
};

SongInfos.propTypes = {
  song: PropTypes.object,
  id: PropTypes.number,
  coverImage: PropTypes.node,
  releaseDate: PropTypes.string,
  genreMusicName: PropTypes.string,
  title: PropTypes.string,
  active: PropTypes.bool,
  albumTitle: PropTypes.string,
  languageLabel: PropTypes.string,
  artistNames: PropTypes.arrayOf(PropTypes.string),
  duration: PropTypes.string
};

export default SongInfos;
