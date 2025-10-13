import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardContent, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { extractMinutesSeconds } from 'utils/globals/functions';

// assets
import { Heart } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';

// const prodImage = require.context('assets/images/e-commerce', true);

// ==============================|| PRODUCT CARD ||============================== //

const ProductCard = ({ id, title, totalDuration, active, coverImage, albumTypeName, releaseDate }) => {
  const theme = useTheme();

  const prodProfile = `${API_MEDIA_URL}${coverImage}`;
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

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <SkeletonProductPlaceholder />;

  return (
    <MainCard
      content={false}
      sx={{
        '&:hover': {
          transform: 'scale3d(1.02, 1.02, 1)',
          transition: 'all .4s ease-in-out'
        }
      }}
    >
      <Box sx={{ width: '100%', height: '90%', position: 'relative', minHeight: 250 }}>
        {/* Semi-transparent overlay for blur effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '25%',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        {/* Card media */}
        <CardMedia
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 'calc(100% - 16px)',
            height: 'calc(100% - 16px)',
            textDecoration: 'none',
            opacity: active ? 1 : 0.25,
            borderRadius: '8px',
            zIndex: 0 // Ensure the photo is positioned behind the overlay
          }}
          image={prodProfile}
          component={Link}
          to={`/artist/albums-details/${id}`}
        />
        {/* Other card content */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1, zIndex: 2 }} // Ensure the heart and totalDuration are positioned above the overlay
        >
          {!active && <Chip variant="light" color="error" size="small" label="Sold out" />}
          {totalDuration && <Chip label={extractMinutesSeconds(totalDuration)} variant="combined" color="success" size="small" />}
          <IconButton color="secondary" sx={{ ml: 'auto', '&:hover': { background: 'transparent' } }} onClick={addToFavourite}>
            {wishlisted ? (
              <Heart variant="Bold" style={{ fontSize: '1.15rem', color: theme.palette.error.main }} />
            ) : (
              <Heart style={{ fontSize: '1.15rem' }} />
            )}
          </IconButton>
        </Stack>
      </Box>
      {/* Card content */}
      <CardContent sx={{ p: 2, py: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack>
              <Typography
                component={Link}
                to={`/apps/e-commerce/product-details/${id}`}
                color="textPrimary"
                variant="h5"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textDecoration: 'none' }}
              >
                {title} - Album
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {albumTypeName} - {formatReleaseDate(releaseDate)}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

ProductCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  totalDuration: PropTypes.string,
  albumTypeName: PropTypes.string,
  active: PropTypes.bool,
  coverImage: PropTypes.string,
  releaseDate: PropTypes.string
};

export default ProductCard;
