// third-party
import { FormattedMessage } from 'react-intl';

import { Global, Musicnote, Settings, UserSquare, UserTag, Building, Notepad, MusicDashboard } from 'iconsax-react';

// icons
const icons = {
  adminsMenu: Settings,
  languages: Global,
  musicGenres: Musicnote,
  artistIcon: UserSquare,
  roles: UserSquare,
  // accesses: Check,
  positionsIcon: UserTag,
  stationTypesIcon: Building,
  programTypes: Notepad,
  dashboard: MusicDashboard
};

const adminsMenu = {
  id: 'group-adminsMenu',
  title: <FormattedMessage id="adminsMenu" />,
  icon: icons.adminsMenu,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/admin/dashboard',
      icon: icons.dashboard
    },
    {
      id: 'roles',
      title: <FormattedMessage id="roles" />,
      type: 'item',
      url: '/admin/manage-roles',
      icon: icons.roles
    },
    // {
    //   id: 'accesses',
    //   title: <FormattedMessage id="accesses" />,
    //   type: 'item',
    //   url: '/admin/manage-accesses',
    //   icon: icons.accesses
    // },
    {
      id: 'artists',
      title: <FormattedMessage id="artists" />,
      type: 'item',
      url: '/admin/manage-artists',
      icon: icons.artistIcon
    },
    {
      id: 'agents',
      title: <FormattedMessage id="agents" />,
      type: 'item',
      url: '/admin/manage-agents',
      icon: icons.artistIcon
    },
    {
      id: 'stations',
      title: <FormattedMessage id="stations" />,
      type: 'item',
      url: '/admin/manage-stations',
      icon: icons.artistIcon
    },
    {
      id: 'positions',
      title: <FormattedMessage id="positions" />,
      type: 'item',
      url: '/admin/manage-positions',
      icon: icons.positionsIcon
    },
    {
      id: 'stationTypes',
      title: <FormattedMessage id="stationTypes" />,
      type: 'item',
      url: '/admin/manage-station-types',
      icon: icons.stationTypesIcon
    },
    {
      id: 'languages',
      title: <FormattedMessage id="languages" />,
      type: 'item',
      url: '/admin/manage-languages',
      icon: icons.languages
    },
    {
      id: 'musicGenres',
      title: <FormattedMessage id="musicGenres" />,
      type: 'item',
      url: '/admin/manage-musicGenres',
      icon: icons.musicGenres
    },
    {
      id: 'programTypes',
      title: <FormattedMessage id="programTypes" />,
      type: 'item',
      url: '/admin/manage-program-types',
      icon: icons.programTypes
    }
  ]
};

export default adminsMenu;
