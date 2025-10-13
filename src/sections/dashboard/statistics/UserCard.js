// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, LinearProgress, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { API_MEDIA_URL, ThemeMode } from 'config';
import PropTypes from 'prop-types';
// assets
// import { Cloud } from 'iconsax-react';
import cardBack from 'assets/images/widget/img-dropbox-bg.svg';
import { FormattedMessage } from 'react-intl';
const avatarImage = require.context('assets/images/users', true);
// ===========================|| STATISTICS - DROPBOX ||=========================== //

const UserCard = ({ user }) => {
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
            <Avatar alt="Avatar 1" size="lg" src={user && user.photoProfile ? `${API_MEDIA_URL}${user.photoProfile}` : defaultAvatar} />
            <Typography variant="h4">{user && user.artistRealName}</Typography>
          </Stack>
          {/* <Avatar color="secondary" variant="rounded" sx={{ mt: 0.75, bgcolor: 'secondary.dark' }}>
            <Cloud color={theme.palette.secondary.light} />
          </Avatar> */}
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={0.75}>
            <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
              <Typography variant="h5">{user && user.numberOfAlbumSongs}</Typography>
              <Typography variant="h5">{user && user.numberOfAlbums}</Typography>
              <Typography variant="h5">{user && user.numberOfSingles}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
              <Typography variant="caption">
                <FormattedMessage id="songs" />
              </Typography>
              <Typography variant="caption">Albums</Typography>
              <Typography variant="caption">Singles</Typography>
            </Stack>
            <Box sx={{ display: 'flex' }}>
              <LinearProgress variant="determinate" value={100} color="error" sx={{ width: '15%' }} />
              <LinearProgress variant="determinate" value={100} color="warning" sx={{ width: '18%', right: 2 }} />
              <LinearProgress variant="determinate" value={100} color="secondary" sx={{ width: '20%', right: 4 }} />
              <LinearProgress variant="determinate" value={100} color="success" sx={{ width: '28%', right: 8 }} />
              <LinearProgress variant="determinate" value={100} color="primary" sx={{ width: '19%', right: 8 }} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UserCard;

UserCard.propTypes = {
  user: PropTypes.object
};
