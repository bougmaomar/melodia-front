// third-party
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const LogoutMenu = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      if (user) {
        try {
          await logout();
        } catch (err) {
          console.error(err);
        }
      }
    };

    handleLogout();
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate(`/login`);
    }
  }, [user]);

  if (!user) {
    return null;
  }
  return null;
};

export default LogoutMenu;
