import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  APP_DEFAULT_PATH,
  APP_DEFAULT_ADMIN_PATH,
  APP_DEFAULT_ARTIST_PATH,
  APP_DEFAULT_AGENT_PATH,
  APP_DEFAULT_STATION_PATH
} from 'config';
import useAuth from 'hooks/useAuth';

// Role to path mapping
const rolePathMap = {
  Admin: APP_DEFAULT_ADMIN_PATH,
  Artist: APP_DEFAULT_ARTIST_PATH,
  Agent: APP_DEFAULT_AGENT_PATH,
  Station: APP_DEFAULT_STATION_PATH
};

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // const [path, setPath] = useState(APP_DEFAULT_PATH);

  useEffect(() => {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      const userRole = user?.role;
      const defaultPath = rolePathMap[userRole] || APP_DEFAULT_PATH;

      navigate(location?.state?.from || defaultPath, {
        state: { from: '' },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
