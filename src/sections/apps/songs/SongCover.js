import PropTypes from 'prop-types';
import { API_MEDIA_URL } from 'config';
import { useNavigate } from 'react-router';

// material-ui
import { Box, Grid } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';

// ==============================|| PRODUCT DETAILS - IMAGES ||============================== //

const SongCover = ({ coverImage }) => {
  const history = useNavigate();

  const initialImage = `${API_MEDIA_URL}${coverImage}`;

  return (
    <>
      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              aspectRatio: { xs: '2 / 1', sm: '1 / 1' },
              overflow: 'hidden',
              borderRadius: '12px'
            }}
          >
            <img
              src={initialImage}
              alt="songTitle"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
                aspectRatio: { xs: '2 / 1', sm: '1 / 1' },
                cursor: 'pointer',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 0
              }}
            />
            <IconButton
              onClick={() => history(-1)}
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                color: 'black',
                cursor: 'pointer',
                width: 40,
                height: 40,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
              }}
            >
              <ArrowLeft sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

SongCover.propTypes = {
  id: PropTypes.number,
  coverImage: PropTypes.string,
  refreshFavorites: PropTypes.func
};

export default SongCover;
