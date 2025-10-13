import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| AUTHENTICATION - CARD ||============================== //

const AuthCard = ({ children, ...other }) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, md: 600 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%'
      }
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 3, sm: 4, md: 5, xl: 6 } }}>{children}</Box>
  </MainCard>
);

AuthCard.propTypes = {
  children: PropTypes.node
};

export default AuthCard;
