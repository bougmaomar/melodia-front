// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, ButtonBase } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { Spotify, Youtube } from 'iconsax-react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const MediaCard = ({ youtube, spotify }) => {
  const theme = useTheme();

  return (
    <MainCard
      content={false}
      sx={{
        bgcolor: alpha(theme.palette.secondary.main, 1),
        color: 'common.white',
        position: 'relative',
        '&:after': {
          content: '""',
          background: `linear-gradient(245deg, transparent 25.46%, rgba(0, 0, 0, 0.2) 68.77%, rgba(0, 0, 0, 0.3) 81.72%)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.6
        }
      }}
    >
      <Box sx={{ p: 2, position: 'inherit', zIndex: 2 }}>
        {/* Spotify Button or Plain Text */}
        {spotify ? (
          <ButtonBase
            href={spotify}
            target="_blank"
            sx={{
              display: 'block',
              textAlign: 'left',
              width: '100%',
              '&:hover': {
                color: 'green' // Change color on hover if clickable
              }
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Avatar
                variant="rounded"
                size="xs"
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'success.100' : 'success.darker',
                  color: 'white'
                }}
              >
                <Spotify />
              </Avatar>
              <Stack>
                <Typography variant="h6">
                  <FormattedMessage id="openSpotify" />
                </Typography>
              </Stack>
            </Stack>
          </ButtonBase>
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Avatar
              variant="rounded"
              size="xs"
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'success.100' : 'success.darker',
                color: 'white'
              }}
            >
              <Spotify />
            </Avatar>
            <Typography variant="h6" sx={{ color: theme.palette.grey[500] }}>
              <FormattedMessage id="notAvailableSpotify" />
            </Typography>
          </Stack>
        )}

        {/* YouTube Button or Plain Text */}
        {youtube ? (
          <ButtonBase
            href={youtube}
            target="_blank"
            sx={{
              display: 'block',
              textAlign: 'left',
              width: '100%',
              mt: 2,
              '&:hover': {
                color: 'red' // Change color on hover if clickable
              }
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Avatar
                variant="rounded"
                size="xs"
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? 'error.100' : 'error.darker',
                  color: 'white'
                }}
              >
                <Youtube />
              </Avatar>
              <Stack>
                <Typography variant="h6">
                  <FormattedMessage id="openYoutube" />
                </Typography>
              </Stack>
            </Stack>
          </ButtonBase>
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mt: 2 }}>
            <Avatar
              variant="rounded"
              size="xs"
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'error.100' : 'error.darker',
                color: 'white'
              }}
            >
              <Youtube />
            </Avatar>
            <Typography variant="h6" sx={{ color: theme.palette.grey[500] }}>
              <FormattedMessage id="notAvailableYoutube" />
            </Typography>
          </Stack>
        )}
      </Box>
    </MainCard>
  );
};

export default MediaCard;

MediaCard.propTypes = {
  youtube: PropTypes.string,
  spotify: PropTypes.string
};
