import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { keys, screens } from './helpers';

const routeConfigs = {
  [keys.BookingStep1Book]: {
    screen: screens.Step1Book
  },
  [keys.BookingStep2Pay]: {
    screen: screens.Step2Pay
  },
  [keys.BookingStep3Drive]: {
    screen: screens.Step3Drive
  }
};

const navigatorConfig = {
  initialRouteName: keys.BookingStep1Book,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
