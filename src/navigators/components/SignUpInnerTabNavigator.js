import { createMaterialTopTabNavigator } from 'react-navigation';
import i18n from 'i18next';

import keys from './../helpers/screenKeys';
import UserInfo from './../../screens/SignUp/UserInfo';
import LoyalityInfo from './../../screens/SignUp/LoyalityInfo';
import { colors } from './../../utils/theme';
import styles from './../styles/tabBarTop';

const routeConfigs = {
  [keys.UserInfo]: {
    screen: UserInfo,
    navigationOptions: { tabBarLabel: i18n.t('register:userInfoTabLabel') }
  },
  [keys.LoyalityInfo]: {
    screen: LoyalityInfo,
    navigationOptions: { tabBarLabel: i18n.t('register:loyalityInfoTabLabel') }
  }
};

const navigatorConfig = {
  initialRouteName: keys.UserInfo,
  backBehavior: 'none',
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: colors.TEXT_INVERT_COLOR,
    inactiveTintColor: colors.TEXT_LIGHT_TRANSPARENT,
    upperCaseLabel: true,
    style: styles.container,
    labelStyle: styles.label,
    indicatorStyle: styles.indicator
  }
};

export default createMaterialTopTabNavigator(routeConfigs, navigatorConfig);
