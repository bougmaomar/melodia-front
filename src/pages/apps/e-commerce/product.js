import { useEffect, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';

// project-imports
import Loader from 'components/Loader';
import ProductCard from 'components/cards/e-commerce/ProductCard';
import FloatingCart from 'components/cards/e-commerce/FloatingCart';
// import AlbumImage from 'assets/images/e-commerce/prod-1.png';
import ProductFilterDrawer from 'sections/apps/albums/ProductFilterDrawer';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import ProductsHeader from 'sections/apps/albums/ProductsHeader';
import ProductEmpty from 'sections/apps/albums/ProductEmpty';

import useConfig from 'hooks/useConfig';
import { dispatch } from 'store';
// import { resetCart } from 'store/reducers/cart';
import { openDrawer } from 'store/reducers/menu';
import { getProducts, filterProducts } from 'store/reducers/product';
import useAlbums from 'hooks/useAlbums';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'container' })(({ theme, open, container }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter
  }),
  marginLeft: -320,
  ...(container && {
    [theme.breakpoints.only('lg')]: {
      marginLeft: !open ? -240 : 0
    }
  }),
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 0,
    marginLeft: 0
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: 0
  })
}));

// ==============================|| ECOMMERCE - PRODUCTS ||============================== //

const ProductsPage = () => {
  const { getAlbums } = useAlbums();
  const theme = useTheme();

  // const productState = useSelector((state) => state.product);
  // const cart = useSelector((state) => state.cart);
  const { container } = useConfig();

  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  useEffect(() => {
    setProductLoading(false);
  }, []);

  // product data
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albums = await getAlbums();
        console.log(albums);
        setProducts(albums);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [getAlbums]);

  // const productsData = [
  //   {
  //     id: '1',
  //     coverImage: 'cover4.jpeg',
  //     title: 'To Night',
  //     albumTypeName: 'Live',
  //     totalDuration: '13:03',
  //     active: true,
  //     releaseDate: '09/05/2018'
  //   }
  // ];

  useEffect(() => {
    const productsCall = dispatch(getProducts());
    // hide left drawer when email app opens
    const drawerCall = dispatch(openDrawer(false));
    Promise.all([drawerCall, productsCall]).then(() => setLoading(false));
  }, []);

  const [openFilterDrawer, setOpenFilterDrawer] = useState(true);
  const handleDrawerOpen = () => {
    setOpenFilterDrawer((prevState) => !prevState);
  };

  // filter
  const initialState = {
    search: '',
    sort: 'low',
    gender: [],
    categories: ['all'],
    colors: [],
    price: '',
    rating: 0
  };
  const [filter, setFilter] = useState(initialState);

  const filterData = async () => {
    await dispatch(filterProducts(filter));
    setProductLoading(false);
  };

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  let productResult = <></>;
  if (products && products.length > 0) {
    productResult = products.map((product, index) => (
      <Grid key={index} item xs={12} sm={6} md={4}>
        <ProductCard
          id={product.id}
          coverImage={product.coverImage}
          title={product.title}
          albumTypeName={product.albumTypeName}
          active={product.active}
          releaseDate={product.releaseDate}
          totalDuration={product.totalDuration}
          open={openFilterDrawer}
        />
      </Grid>
    ));
  } else {
    productResult = (
      <Grid item xs={12} sx={{ mt: 3 }}>
        <ProductEmpty handelFilter={() => setFilter(initialState)} />
      </Grid>
    );
  }

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      <ProductFilterDrawer
        filter={filter}
        setFilter={setFilter}
        openFilterDrawer={openFilterDrawer}
        handleDrawerOpen={handleDrawerOpen}
        setLoading={setProductLoading}
        initialState={initialState}
      />
      <Main theme={theme} open={openFilterDrawer} container={container}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <ProductsHeader filter={filter} handleDrawerOpen={handleDrawerOpen} setFilter={setFilter} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {productLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Grid key={item} item xs={12} sm={6} md={4} lg={4}>
                      <SkeletonProductPlaceholder />
                    </Grid>
                  ))
                : productResult}
            </Grid>
          </Grid>
        </Grid>
      </Main>
      <FloatingCart />
    </Box>
  );
};

export default ProductsPage;
