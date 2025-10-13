import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  // Rating,
  Stack,
  Typography
} from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import SimpleBar from 'components/third-party/SimpleBar';
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { Heart } from 'iconsax-react';
import useSongs from 'hooks/useSongs';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

export const ListSongs = ({ song, role }) => {
  const theme = useTheme();
  const history = useNavigate();

  const [wishlisted, setWishlisted] = useState(false);
  const addToFavourite = () => {
    setWishlisted(!wishlisted);
    dispatch(
      openSnackbar({
        open: true,
        message: 'Added to favourites',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  const linkHandler = (id) => {
    if (role == 'Artist') {
      history(`/artist/songs-details/${id}`);
    } else if (role == 'Agent') {
      history(`/agent/songs-details/${id}`);
    }
  };

  return (
    <ListItemButton divider onClick={() => linkHandler(song.id)}>
      <ListItemAvatar>
        <Avatar
          alt="Avatar"
          size="xl"
          color="secondary"
          variant="rounded"
          type="combined"
          src={song.coverImagePath ? `${API_MEDIA_URL}${song.coverImagePath}` : ''}
          sx={{ borderColor: theme.palette.divider, mr: 1 }}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={<Typography variant="subtitle1">{song.title}</Typography>}
        secondary={
          <Stack spacing={1}>
            <Typography color="text.secondary">
              {song.genreMusicName} - {song.albumTitle || 'no album'}
            </Typography>
            {/* <Stack spacing={1}>
              <Rating name="simple-controlled" value={song.rating < 4 ? song.rating + 1 : song.rating} readOnly precision={0.1} />
            </Stack> */}
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          size="medium"
          color="secondary"
          sx={{ opacity: wishlisted ? 1 : 0.5, '&:hover': { bgcolor: 'transparent' } }}
          onClick={addToFavourite}
        >
          {wishlisted ? (
            <Heart variant="Bold" style={{ fontSize: '1.15rem', color: theme.palette.error.main }} />
          ) : (
            <Heart style={{ fontSize: '1.15rem' }} />
          )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

ListSongs.propTypes = {
  song: PropTypes.object,
  role: PropTypes.string
};

// ==============================|| SONGS DETAILS - RELATED SONGS ||============================== //

const RelatedSongs = ({ id }) => {
  const navigate = useNavigate();
  const [related, setRelated] = useState([]);
  const { getRelatedSongs } = useSongs();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alb = await getRelatedSongs(id);
        setRelated(alb);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleGoToSongs = () => {
    user.role == 'Agent' && navigate('/agent/songs');
  };

  const filteredSongs = related.filter((song) => song.id !== parseInt(id));
  let songResult = <></>;
  if (filteredSongs.length) {
    songResult = (
      <List
        component="nav"
        sx={{
          '& .MuiListItemButton-root': {
            borderRadius: 0,
            my: 0,
            px: 3,
            py: 2,
            alignItems: 'flex-start',
            '& .MuiListItemSecondaryAction-root': {
              alignSelf: 'flex-start',
              ml: 1,
              position: 'relative',
              right: 'auto',
              top: 'auto',
              transform: 'none'
            },
            '& .MuiListItemAvatar-root': { mr: 1, mt: 0.75 }
          },
          p: 0
        }}
      >
        {filteredSongs.map((song, index) => (
          <ListSongs key={index} song={song} role={user.role} />
        ))}
      </List>
    );
  }

  return (
    <SimpleBar sx={{ height: { xs: '100%', md: 'calc(100% - 62px)' } }}>
      <Grid item>
        <Stack>
          {songResult}
          <Button color="secondary" variant="outlined" sx={{ mx: 2, my: 4, textTransform: 'none' }} onClick={handleGoToSongs}>
            <FormattedMessage id="viewAllSongs" />
          </Button>
        </Stack>
      </Grid>
    </SimpleBar>
  );
};

RelatedSongs.propTypes = {
  id: PropTypes.string.isRequired
};

export default RelatedSongs;
