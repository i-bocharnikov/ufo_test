import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import SupportFaqs from './../screens/support/faqsScreen';
import SupportFaq from './../screens/support/faqScreen';
import SupportChat from './../screens/support/chatScreen';

const routeConfigs = {
  [keys.SupportFaqs]: { screen: SupportFaqs },
  [keys.SupportFaq]: { screen: SupportFaq },
  [keys.SupportChat]: { screen: SupportChat }
};

const navigatorConfig = {
  initialRouteName: keys.SupportFaqs,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
