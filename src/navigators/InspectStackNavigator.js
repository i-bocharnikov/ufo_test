import { createStackNavigator } from 'react-navigation';

import { keys, screens } from './helpers';

const routeConfigs = {
  [keys.Inspect]: { screen: screens.Inspect },
  [keys.InspectLocateDamage]: { screen: screens.LocateDamage },
  [keys.InspectCaptureDamage]: { screen: screens.CaptureDamage },
  [keys.InspectCommentDamage]: { screen: screens.CommentDamage }
};

const navigatorConfig = {
  initialRouteName: keys.Inspect,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
