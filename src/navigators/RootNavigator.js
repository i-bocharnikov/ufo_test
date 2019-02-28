import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import keys from './helpers/screenKeys';
import AppNavigator from './AppNavigator';
import Launch from './../screens/Launch';

const routeConfigs = {
  [keys.Launch]: { screen: Launch },
  [keys.App]: AppNavigator
};

const navigatorConfig = { initialRouteName: keys.Launch };
const RootNavigator = createSwitchNavigator(routeConfigs, navigatorConfig);

export default createAppContainer(RootNavigator);
