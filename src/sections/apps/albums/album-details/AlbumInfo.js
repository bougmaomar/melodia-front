import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  ButtonBase,
  Chip,
  Grid,
  Stack,
  // TextField,
  Tooltip,
  Typography
} from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';
import { FormattedMessage } from 'react-intl';
import { extractMinutesSecondsText } from 'utils/globals/functions';

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

// ==============================|| ALBUM DETAILS - INFORMATION ||============================== //

const AlbumInfo = ({ album }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h1" sx={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
        {album.title}
      </Typography>
      <Grid>
        <Chip
          size="small"
          label={album.albumTypeName}
          sx={{
            width: 'fit-content',
            borderRadius: '4px',
            color: 'success.main',
            bgcolor: 'success.lighter'
          }}
        />
      </Grid>
      <Grid display="flex" justifyContent="start">
        <Typography color="textSecondary">
          {album?.songs?.$values.length} <FormattedMessage id="songs" /> -{' '}
        </Typography>
        <Chip
          size="small"
          label={extractMinutesSecondsText(album.totalDuration)}
          sx={{
            width: 'fit-content',
            borderRadius: '8px',
            ml: 2,
            color: 'secondary.main'
            // bgcolor: 'success.lighter'
          }}
        />
      </Grid>

      <Typography variant="h6" color="GrayText" style={{ marginInlineEnd: 30 }}>
        {album?.description}
      </Typography>
    </Stack>
  );
};

AlbumInfo.propTypes = {
  album: PropTypes.object,
  id: PropTypes.number,
  coverImage: PropTypes.node,
  releaseDate: PropTypes.string,
  albumTypeName: PropTypes.string,
  title: PropTypes.string,
  active: PropTypes.bool,
  songs: PropTypes.arrayOf(PropTypes.string),
  artistNames: PropTypes.arrayOf(PropTypes.string),
  totalDuration: PropTypes.string
};

export default AlbumInfo;
