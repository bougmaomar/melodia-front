import React from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from 'contexts/UserContext';

const RoleGuard = ({ children, roles }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/maintenance/401" />;
  }

  return children;
};

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RoleGuard;
