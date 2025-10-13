// third-party
import { FormattedMessage } from 'react-intl';

import {
  MusicDashboard,
  ArchiveBox,
  Send,
  MusicPlaylist,
  MusicPlay,
  GalleryFavorite,
  MessageNotif,
  UserSquare,
  Radio
} from 'iconsax-react';

// icons
const icons = {
  dashboard: MusicDashboard,
  artistsMenu: MusicPlay,
  albums: ArchiveBox,
  suggest: Send,
  songs: MusicPlaylist,
  favorite: GalleryFavorite,
  chat: MessageNotif,
  artistIcon: UserSquare,
  station: Radio
};

const artistsMenu = {
  id: 'group-artistsMenu',
  title: <FormattedMessage id="artistsMenu" />,
  icon: icons.artistsMenu,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/artist/dashboard',
      icon: icons.dashboard
    },
    {
      id: 'albums',
      title: <FormattedMessage id="albums" />,
      type: 'item',
      url: '/artist/albums',
      icon: icons.albums
    },
    {
      id: 'songs',
      title: <FormattedMessage id="songs" />,
      type: 'item',
      url: '/artist/songs',
      icon: icons.songs
    },
    // {
    //   id: 'favorite',
    //   title: 'Favorite',
    //   type: 'item',
    //   url: '/artist/favorite',
    //   icon: icons.favorite
    // },
    {
      id: 'station',
      title: <FormattedMessage id="stations" />,
      type: 'item',
      url: '/artist/stations',
      icon: icons.station
    },
    {
      id: 'suggest',
      title: <FormattedMessage id="suggest" />,
      type: 'item',
      url: '/artist/suggest/0',
      icon: icons.suggest
    },
    {
      id: 'chat',
      title: <FormattedMessage id="chat" />,
      type: 'item',
      url: '/artist/chat',
      icon: icons.chat
    },
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'item',
      url: '/artist/profile/basic',
      icon: icons.artistIcon
    }
  ]
};

export default artistsMenu;
