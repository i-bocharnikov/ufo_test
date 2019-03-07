import { createMaterialTopTabNavigator } from 'react-navigation';
import i18n from 'i18next';

import keys from './../helpers/screenKeys';
import GuideList from './../../screens/Support/GuideList';
import Chat from './../../screens/Support/Chat';
import Faq from './../../screens/Support/Faq';
import { colors } from './../../utils/theme';
import styles from './../styles/tabBarTop';

const routeConfigs = {
  [keys.SupportGuideList]: {
    screen: GuideList,
    navigationOptions: { tabBarLabel: i18n.t('support:guideListTab') }
  },
  [keys.SupportChat]: {
    screen: Chat,
    navigationOptions: { tabBarLabel: i18n.t('support:chatTab') }
  },
  [keys.SupportFaq]: {
    screen: Faq,
    navigationOptions: { tabBarLabel: i18n.t('support:faqTab') }
  }
};

const navigatorConfig = {
  initialRouteName: keys.SupportGuideList,
  backBehavior: 'none',
  swipeEnabled: true,
  lazy: true,
  tabBarOptions: {
    activeTintColor: colors.TEXT_INVERT_COLOR,
    inactiveTintColor: colors.TEXT_LIGHT_TRANSPARENT,
    upperCaseLabel: true,
    style: styles.container,
    labelStyle: styles.label,
    indicatorStyle: styles.tripleIndicator
  }
};

export default createMaterialTopTabNavigator(routeConfigs, navigatorConfig);
