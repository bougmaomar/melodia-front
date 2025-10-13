import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardMedia, Grid } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// third-party
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

// assets
import { ArrowLeft2, ArrowRight2, Heart } from 'iconsax-react';

import { API_MEDIA_URL } from 'config';

// ==============================|| ALBUM DETAILS - IMAGES ||============================== //

const AlbumImages = (coverImage) => {
  const theme = useTheme();

  const initialImage = coverImage ? `${API_MEDIA_URL}${coverImage.coverImage}` : '';

  const [modal, setModal] = useState(false);

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

  const ArrowUp = ({ currentSlide, slideCount, ...props }) => (
    <Box
      {...props}
      id={slideCount}
      className={'prev' + (currentSlide === 0 ? ' slick-disabled' : '')}
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      color="secondary"
      sx={{ cursor: 'pointer', borderRadius: 1 }}
    >
      <ArrowLeft2 style={{ color: theme.palette.secondary.light }} />
    </Box>
  );

  ArrowUp.propTypes = {
    currentSlide: PropTypes.number,
    slideCount: PropTypes.number
  };

  const ArrowDown = ({ currentSlide, slideCount, ...props }) => (
    <Box
      {...props}
      color="secondary"
      className={'next' + (currentSlide === slideCount - 1 ? ' slick-disabled' : '')}
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      sx={{ cursor: 'pointer', borderRadius: 1, p: 0.75 }}
    >
      <ArrowRight2 size={18} style={{ color: theme.palette.secondary[400] }} />
    </Box>
  );

  ArrowDown.propTypes = {
    currentSlide: PropTypes.number,
    slideCount: PropTypes.number
  };

  return (
    <>
      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <MainCard
            content={false}
            border={false}
            boxShadow={false}
            sx={{
              m: '0 auto',
              width: 'auto',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.lighter' : 'secondary.200'
              // '& .react-transform-wrapper': { cursor: 'crosshair', height: '100%' },
              // '& .react-transform-component': { height: '100%', width: '100%' }
            }}
          >
            <TransformWrapper initialScale={1}>
              {() => (
                <>
                  <TransformComponent>
                    <CardMedia
                      onClick={() => setModal(!modal)}
                      component="img"
                      image={initialImage}
                      title="Scroll Zoom"
                      sx={{ width: '300', height: '200', borderRadius: '4px', position: 'relative' }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
            <IconButton
              color="secondary"
              sx={{ ml: 'auto', position: 'absolute', top: 12, right: 12, '&:hover': { background: 'transparent' } }}
              onClick={addToFavourite}
            >
              {wishlisted ? <Heart variant="Bold" style={{ color: theme.palette.error.main }} /> : <Heart />}
            </IconButton>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export default AlbumImages;
