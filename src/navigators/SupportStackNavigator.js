import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import Support from './../screens/Support';
import Guide from './../screens/Support/Guide';

const routeConfigs = {
  [keys.Support]: { screen: Support },
  [keys.SupportGuide]: { screen: Guide }
};

const navigatorConfig = {
  initialRouteName: keys.Support,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
