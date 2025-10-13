import { useMemo } from 'react';

// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project-imports
//import Search from './Search';
import Profile from './Profile';
import Localization from './Localization';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';
import { MenuOrientation } from 'config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // const localization = useMemo(() => <Localization />, [i18n]);
  const localization = useMemo(() => <Localization />, []);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
        {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
        {/* {!downLG && <Search />} */}
        {!downLG && localization}
        {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
        {!downLG && <Profile />}
      </Box>
    </>
  );
};

export default HeaderContent;
