// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, LinearProgress, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { API_MEDIA_URL, ThemeMode } from 'config';
import PropTypes from 'prop-types';
// assets
import cardBack from 'assets/images/widget/img-dropbox-bg.svg';
const avatarImage = require.context('assets/images/users', true);
// ===========================|| STATISTICS - DROPBOX ||=========================== //

const StationCard = ({ user }) => {
  const theme = useTheme();
  const defaultAvatar = avatarImage('./default.jpeg');

  return (
    <MainCard
      sx={{
        color: 'common.white',
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.100' : 'secondary.800',
        '&:after': {
          content: '""',
          backgroundImage: `url(${cardBack})`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.5,
          backgroundPosition: 'bottom right',
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat'
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Avatar alt="Avatar 1" size="lg" src={user && user.logo ? `${API_MEDIA_URL}${user.logo}` : defaultAvatar} />
            <Typography variant="h5">{user && user.stationName}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={0.75}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="h6">{user && user.email}</Typography>
              <Typography variant="caption">{user && user.frequency}</Typography>
            </Stack>
            <Box sx={{ display: 'flex' }}>
              <LinearProgress variant="determinate" value={100} color="error" sx={{ width: '16%' }} />
              <LinearProgress variant="determinate" value={100} color="warning" sx={{ width: '18%', right: 2 }} />
              <LinearProgress variant="determinate" value={100} color="secondary" sx={{ width: '20%', right: 4 }} />
              <LinearProgress variant="determinate" value={100} color="success" sx={{ width: '28%', right: 8 }} />
              <LinearProgress variant="determinate" value={100} color="primary" sx={{ width: '18%', right: 10 }} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default StationCard;

StationCard.propTypes = {
  user: PropTypes.object
};
