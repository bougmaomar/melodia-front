// third-party
import { FormattedMessage } from 'react-intl';

import { Settings, Logout } from 'iconsax-react';

// icons
const icons = {
  adminsMenu: Settings,
  logout: Logout
};

const settingsMenu = {
  id: 'group-settigsMenu',
  title: <FormattedMessage id="settings" />,
  icon: icons.adminsMenu,
  type: 'group',
  children: [
    {
      id: 'logout',
      title: <FormattedMessage id="logout" />,
      type: 'item',
      url: '/logout',
      icon: icons.logout
    }
  ]
};

export default settingsMenu;
