import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import StepBook from './../screens/Booking/StepBook';
import StepPay from './../screens/Booking/StepPay';
import StepDrive from './../screens/Booking/StepDrive';
import StepCancellation from './../screens/Booking/StepCancellation';
import BookingDetails from './../screens/Booking/BookingDetails';

const routeConfigs = {
  [keys.BookingStepBook]: { screen: StepBook },
  [keys.BookingStepPay]: { screen: StepPay },
  [keys.BookingStepDrive]: { screen: StepDrive },
  [keys.BookingStepCancellation]: { screen: StepCancellation },
  [keys.BookingDetails]: { screen: BookingDetails }
};

const navigatorConfig = {
  initialRouteName: keys.BookingStepBook,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);
