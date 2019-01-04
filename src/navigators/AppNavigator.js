import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import { keys, screens } from './helpers';
import BookingStackNavigator from './BookingStackNavigator';
import InspectStackNavigator from './InspectStackNavigator';
import SupportStackNavigator from './SupportStackNavigator';
import RegisterStackNavigator from './RegisterStackNavigator';

export default createBottomTabNavigator({
  [keys.Drive]: { screen: screens.Drive },
  [keys.Booking]: BookingStackNavigator,
  [keys.Register]: RegisterStackNavigator,
  [keys.Inspect]: InspectStackNavigator,
  [keys.Support]: SupportStackNavigator,
  [keys.Find]: { screen: screens.Find },
  [keys.Return]: { screen: screens.Return },
  [keys.RentalAgreement]: { screen: screens.RentalAgreement },
  [keys.FaceRecognizer]: { screen: screens.FaceRecognizer }
},
{
  initialRouteName: keys.Home,
  navigationOptions: () => ({ tabBarVisible: false })
});
