// third-party
import { FormattedMessage } from 'react-intl';

import { MusicDashboard, UserSquare, Send, MusicPlay, ArchiveBox, MusicPlaylist, Radio, MessageNotif } from 'iconsax-react';

// icons
const icons = {
  dashboard: MusicDashboard,
  agentsMenu: MusicPlay,
  albums: ArchiveBox,
  suggest: Send,
  artistIcon: UserSquare,
  songs: MusicPlaylist,
  station: Radio,
  chat: MessageNotif
  // favorite : FavoriteChart
};

const agentsMenu = {
  id: 'group-agentsMenu',
  title: <FormattedMessage id="agentsMenu" />,
  icon: icons.agentsMenu,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/agent/dashboard',
      icon: icons.dashboard
    },
    {
      id: 'artists',
      title: <FormattedMessage id="artists" />,
      type: 'item',
      url: '/agent/artists',
      icon: icons.agentsMenu
    },
    {
      id: 'albums',
      title: <FormattedMessage id="albums" />,
      type: 'item',
      url: '/agent/albums',
      icon: icons.albums
    },
    {
      id: 'songs',
      title: <FormattedMessage id="songs" />,
      type: 'item',
      url: '/agent/songs',
      icon: icons.songs
    },
    {
      id: 'station',
      title: <FormattedMessage id="stations" />,
      type: 'item',
      url: '/agent/stations',
      icon: icons.station
    },
    // {
    //   id: 'favorite',
    //   title: "Favorite",
    //   type: 'item',
    //   url: '/agent/favorite',
    //   icon: icons.favorite
    // },
    {
      id: 'suggest',
      title: <FormattedMessage id="suggest" />,
      type: 'item',
      url: '/agent/suggest/0',
      icon: icons.suggest
    },
    {
      id: 'chat',
      title: <FormattedMessage id="chat" />,
      type: 'item',
      url: '/agent/chat',
      icon: icons.chat
    },
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'item',
      url: '/agent/profile/basic',
      icon: icons.artistIcon
    }
  ]
};

export default agentsMenu;
