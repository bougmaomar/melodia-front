// React imports
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Material-UI imports
import { Typography } from '@mui/material';

// Custom component imports
import AuthRegister from './AuthRegister'; // assuming you have an AuthRegister component

const AuthRegisterRole = ({ role }) => {
  const history = useHistory();
  const [roleTitle, setRoleTitle] = useState('');

  useEffect(() => {
    // Set the role title based on the role prop
    switch (role) {
      case 'artist':
        setRoleTitle('Artist');
        break;
      case 'admin':
        setRoleTitle('Admin');
        break;
      case 'agent':
        setRoleTitle('Agent');
        break;
      case 'station':
        setRoleTitle('Station');
        break;
      default:
        break;
    }
  }, [role]);

  useEffect(() => {
    // If the role is not valid, redirect to the registration role selection page
    if (!['artist', 'admin', 'agent', 'station'].includes(role)) {
      history.push('/register-role');
    }
  }, [history, role]);

  return (
    <>
      <Typography variant="h3" align="center" gutterBottom>
        Register as {roleTitle}
      </Typography>
      <AuthRegister />
    </>
  );
};

export default AuthRegisterRole;
