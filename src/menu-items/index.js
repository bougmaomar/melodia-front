import adminsMenu from './admins-menu';
import artistsMenu from './artists-menu';
import settingsMenu from './settings-menu';
import stationsMenu from './stations-menu';
import agentsMenu from './agents-menu';

// ==============================|| MENU ITEMS ||============================== //

const MenuItems = (user) => {
  let items = [settingsMenu];
  if (user) {
    const roleMenus = {
      Admin: [adminsMenu, settingsMenu],
      Artist: [artistsMenu, settingsMenu],
      Agent: [agentsMenu, settingsMenu],
      Station: [stationsMenu, settingsMenu]
    };
    items = roleMenus[user.role] || [adminsMenu, artistsMenu, settingsMenu, stationsMenu];
  } else {
    items = [settingsMenu];
  }

  return {
    items: items.map((item, index) => ({
      ...item,
      key: `menu-item-${index}` // ✅ Ensure unique keys
    }))
  };
};

export default MenuItems;
