import { useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { DocumentText, Lock, Profile } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const ProfileTabs = () => {
  const { pathname } = useLocation();

  let selectedTab = 0;
  switch (pathname) {
    case '/agent/profile/personal':
      selectedTab = 1;
      break;
    case '/agent/profile/password':
      selectedTab = 2;
      break;
    case '/agent/profile/basic':
    default:
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard border={false}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
          <Tab
            label={<FormattedMessage id="profile" />}
            component={Link}
            to="/agent/profile/basic"
            icon={<Profile />}
            iconPosition="start"
          />
          <Tab
            label={<FormattedMessage id="editProfile" />}
            component={Link}
            to="/agent/profile/personal"
            icon={<DocumentText />}
            iconPosition="start"
          />
          <Tab
            label={<FormattedMessage id="changePass" />}
            component={Link}
            to="/agent/profile/password"
            icon={<Lock />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Outlet />
      </Box>
    </MainCard>
  );
};

export default ProfileTabs;
