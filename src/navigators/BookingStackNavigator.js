import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { keys, screens } from './helpers';

const routeConfigs = {
  [keys.BookingStepBook]: {
    screen: screens.StepBook
  },
  [keys.BookingStepPay]: {
    screen: screens.StepPay
  },
  [keys.BookingStepDrive]: {
    screen: screens.StepDrive
  }
};

const navigatorConfig = {
  initialRouteName: keys.BookingStepBook,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
