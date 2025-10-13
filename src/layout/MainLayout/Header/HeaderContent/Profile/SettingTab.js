import { useState } from 'react';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { Profile } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

import { useContext } from 'react';
import { UserContext } from 'contexts/UserContext';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user } = useContext(UserContext);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        style={{ display: user.role === 'Admin' ? 'none' : 'flex' }}
        selected={selectedIndex === 0}
        onClick={(event) => {
          var pathname = '/' + user.role.toLowerCase() + '/profile/personal';
          if (user.role === 'Station') pathname = '/radio-station/profile/personal';
          handleListItemClick(event, 0), (window.location.href = pathname);
        }}
      >
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="account_settings" />} />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
