// third-party
import { FormattedMessage } from 'react-intl';

import { MusicPlay, DirectboxReceive, MusicDashboard, UserSquare, TagUser, Musicnote, MessageNotif } from 'iconsax-react';

// icons
const icons = {
  dashboard: MusicDashboard,
  artistsMenu: MusicPlay,
  userIcon: UserSquare,
  proposals: DirectboxReceive,
  listen: MusicPlay,
  selected: Musicnote,
  artists: TagUser,
  chat: MessageNotif
};

const stationsMenu = {
  id: 'group-stationsMenu',
  title: <FormattedMessage id="stationsMenu" />,
  icon: icons.stationsMenu,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/radio-station/dashboard',
      icon: icons.dashboard
    },
    {
      id: 'artists',
      title: <FormattedMessage id="artists" />,
      type: 'item',
      url: '/radio-station/artists',
      icon: icons.artists
    },
    {
      id: 'listen',
      title: <FormattedMessage id="listen" />,
      type: 'item',
      url: '/radio-station/listen',
      icon: icons.listen
    },
    {
      id: 'proposals',
      title: <FormattedMessage id="proposals" />,
      type: 'item',
      url: '/radio-station/proposals',
      icon: icons.proposals
    },
    {
      id: 'selected',
      title: <FormattedMessage id="selectedPage" />,
      type: 'item',
      url: '/radio-station/selected',
      icon: icons.selected
    },
    {
      id: 'chat',
      title: <FormattedMessage id="chat" />,
      type: 'item',
      url: '/radio-station/chat',
      icon: icons.chat
    },
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'item',
      url: '/radio-station/profile/basic',
      icon: icons.userIcon
    }
  ]
};

export default stationsMenu;
