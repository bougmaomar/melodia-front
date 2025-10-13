import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import DrawerHeaderStyled from './DrawerHeaderStyled';
import { MenuOrientation } from 'config';
import Melodia from './../../../../assets/images/logo-melodia.jpeg';
import MelodiaSmall from './../../../../assets/images/melodia_mini_icon.png';
import { DRAWER_WIDTH, HEADER_HEIGHT } from 'config';
import useConfig from 'hooks/useConfig';

const DrawerHeader = ({ open }) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : HEADER_HEIGHT,
        width: isHorizontal ? { xs: '100%', lg: DRAWER_WIDTH + 50 } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0,
        transition: 'none' // Disable transitions on the parent container
      }}
    >
      {/* Conditional rendering of logos based on 'open' prop */}
      <img
        src={open ? Melodia : MelodiaSmall}
        alt={open ? 'Large Logo' : 'Small Logo'}
        style={{
          width: open ? 120 : 52,
          height: open ? 'auto' : 52,
          transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out' // Smooth transition for width and height only
        }}
      />
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
