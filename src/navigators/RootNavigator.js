import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import { keys, screens } from './helpers';
import AppNavigator from './AppNavigator';

const routeConfigs = {
  [keys.Launch]: { screen: screens.Launch },
  [keys.App]: AppNavigator
};

const navigatorConfig = { initialRouteName: keys.Launch };
const RootNavigator = createSwitchNavigator(routeConfigs, navigatorConfig);

export default createAppContainer(RootNavigator);
