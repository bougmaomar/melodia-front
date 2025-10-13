// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DocumentCode2, OceanProtocol, Level, ShieldCross, InfoCircle, I24Support, Driving } from 'iconsax-react';

// icons
const icons = {
  samplePage: DocumentCode2,
  menuLevel: OceanProtocol,
  menuLevelSubtitle: Level,
  disabledMenu: ShieldCross,
  chipMenu: InfoCircle,
  documentation: I24Support,
  roadmap: Driving
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const menu = {
  id: 'other',
  title: <FormattedMessage id="Others" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="sample-page" />,
      type: 'item',
      url: '/',
      icon: icons.samplePage
    }
  ]
};

export default menu;
