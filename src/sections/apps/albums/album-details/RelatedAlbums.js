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
import useAlbums from 'hooks/useAlbums';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

export const ListAlbums = ({ album, role }) => {
  const theme = useTheme();
  const history = useNavigate();

  const [wishlisted, setWishlisted] = useState(false);

  const artistNames = album.artistNames ? album.artistNames.$values.join(' | ') : '';

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
      history(`/artist/albums-details/${id}`);
    } else if (role == 'Agent') {
      history(`/agent/albums/album-details/${id}`);
    }
  };

  return (
    <ListItemButton divider onClick={() => linkHandler(album.id)}>
      <ListItemAvatar>
        <Avatar
          alt="Avatar"
          size="xl"
          color="secondary"
          variant="rounded"
          type="combined"
          src={album.coverImage ? `${API_MEDIA_URL}${album.coverImage}` : ''}
          sx={{ borderColor: theme.palette.divider, mr: 1 }}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={<Typography variant="subtitle1">{album.title}</Typography>}
        secondary={
          <Stack spacing={1}>
            <Typography color="text.secondary">
              {album.albumTypeName} - {artistNames}
            </Typography>
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

ListAlbums.propTypes = {
  album: PropTypes.object,
  role: PropTypes.string
};

// ==============================|| ALBUMS DETAILS - RELATED ALBUMS ||============================== //

const RelatedAlbums = ({ id }) => {
  const navigate = useNavigate();
  const [related, setRelated] = useState([]);
  const { getRelatedAlbums } = useAlbums();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alb = await getRelatedAlbums(id);

        setRelated(alb);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleGoToAlbums = () => {
    user.role == 'Artist' && navigate('/artist/albums');
    user.role == 'Agent' && navigate('/agent/albums');
  };

  const filteredAlbums = related.filter((album) => album.id !== parseInt(id));
  let albumResult = <></>;
  if (filteredAlbums.length) {
    albumResult = (
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
        {filteredAlbums.map((album, index) => (
          <ListAlbums key={index} album={album} role={user.role} />
        ))}
      </List>
    );
  }

  return (
    <SimpleBar sx={{ height: { xs: '100%', md: 'calc(100% - 62px)' } }}>
      <Grid item>
        <Stack>
          {albumResult}
          <Button color="secondary" variant="outlined" sx={{ mx: 2, my: 4, textTransform: 'none' }} onClick={handleGoToAlbums}>
            <FormattedMessage id="viewAllAlbums" />
          </Button>
        </Stack>
      </Grid>
    </SimpleBar>
  );
};

RelatedAlbums.propTypes = {
  id: PropTypes.string.isRequired
};

export default RelatedAlbums;
