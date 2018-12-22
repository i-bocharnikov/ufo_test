import { createStackNavigator } from 'react-navigation';

import { keys, screens } from './helpers';

const routeConfigs = {
  [keys.SupportFaqs]: { screen: screens.SupportFaqs },
  [keys.SupportFaq]: { screen: screens.SupportFaq },
  [keys.SupportChat]: { screen: screens.SupportChat }
};

const navigatorConfig = {
  initialRouteName: keys.SupportFaqs,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
