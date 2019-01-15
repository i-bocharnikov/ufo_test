import { createSwitchNavigator } from 'react-navigation';

import { keys, screens } from './helpers';
import AppNavigator from './AppNavigator';

const routeConfigs = {
  [keys.Launch]: { screen: screens.Launch },
  [keys.App]: AppNavigator
};

const navigatorConfig = { initialRouteName: keys.Launch };

export default createSwitchNavigator(routeConfigs, navigatorConfig);
